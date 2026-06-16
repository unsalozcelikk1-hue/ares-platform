const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb, query, run, get } = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Data Models
const PROPERTIES = [
  { id: "prop-esentepe-villa", price: 550000, commissionRate: 0.08 },
  { id: "prop-iskele-penthouse", price: 240000, commissionRate: 0.07 },
  { id: "prop-bellapais-mansion", price: 1200000, commissionRate: 0.06 },
  { id: "prop-alsancak-bungalow", price: 185000, commissionRate: 0.06 } // corrected ALS Fiyat matching index.html
];

const AGENT_MODELS = {
  mini: { name: "GPT-4o Mini", speedBoost: 1.0, qualityBoost: 1.0 },
  standard: { name: "Claude 3.5 Sonnet", speedBoost: 1.6, qualityBoost: 1.3 },
  pro: { name: "o1 Pro (Reasoning)", speedBoost: 2.8, qualityBoost: 1.8 }
};

const DIALOG_TEMPLATES = {
  "german-expat": {
    name: "Dieter Schmidt",
    origin: "Almanya (Stuttgart)",
    region: "germany",
    budget: 450000,
    propertyId: "prop-esentepe-villa",
    avatarColor: "#4facfe",
    messages: [
      { sender: "agent", text: "Merhaba Dieter Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak Esentepe projemizi incelediniz mi?" },
      { sender: "client", text: "Merhaba. Evet, Almanya'da vergiler çok yüksek. Kıbrıs'ın emlak alımında %0 Capital Gains (Sermaye Kazancı Vergisi) sunduğunu duydum, bu doğru mu? Bir de oturum izni süreci nasıl işliyor?" },
      { sender: "agent", text: "Kesinlikle doğru Dieter Bey. Kuzey Kıbrıs'ta gayrimenkul yatırımı yaptığınızda sermaye kazancı vergisi sıfırdır. Ayrıca £125.000 üzeri mülk alımlarında adada hızlı oturum izni hakkı kazanırsınız. Esentepe villamız tam size göre." },
      { sender: "client", text: "Harika! Bütçem £450.000 civarında. Villanın konumu çok güzel duruyor. Beni Kıbrıs'taki satış ekibiyle eşleştirebilir misiniz? Gelecek hafta Girne'ye bir inceleme gezisi (inspection trip) yapabilirim." }
    ]
  },
  "uk-retiree": {
    name: "Margaret Evans",
    origin: "İngiltere (Manchester)",
    region: "uk",
    budget: 200000,
    propertyId: "prop-iskele-penthouse",
    avatarColor: "#fda085",
    messages: [
      { sender: "agent", text: "Hello Margaret, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?" },
      { sender: "client", text: "Hello dear. I am looking for a warm place to retire, away from the rainy Manchester weather. But I want something near the beach with easy access to shops. Is Iskele safe?" },
      { sender: "agent", text: "North Cyprus is ranked among the safest small nations globally, Margaret. The Iskele Long Beach area is flat, beautifully pedestrianized, and contains supermarkets, clinics, and sandy beaches within walking distance." },
      { sender: "client", text: "That sounds lovely. My budget is around £150,000 to £200,000. The Penthouse looks spectacular and the rental yields could fund my pension. Please forward my details to the developer to reserve a unit." }
    ]
  },
  "crypto-whale": {
    name: "Dmitry Ivanov",
    origin: "Rusya (Moskova)",
    region: "russia",
    budget: 1200000,
    propertyId: "prop-bellapais-mansion",
    avatarColor: "#10b981",
    messages: [
      { sender: "agent", text: "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var." },
      { sender: "client", text: "Selam. Evet, Moskova'dan sermaye transferi zor olduğu için ödemeyi tamamen USDT üzerinden yapmak istiyorum. Kıbrıs'taki inşaat firmaları bunu kabul ediyor mu ve yasal süreç nasıl?" },
      { sender: "agent", text: "Evet Dmitry Bey, Kıbrıs'ta neredeyse tüm büyük inşaat firmaları ve avukatlar USDT ödemelerini kabul ediyor. Sözleşme avukat gözetiminde kripto cüzdan transferiyle resmileştiriliyor. Bellapais malikanesi için bunu yapabiliriz." },
      { sender: "client", text: "Çok iyi. Bütçe sorun değil, malikane için £1.2M ödemeye hazırım. Hemen işlemleri başlatacak emlak avukatını ve geliştiriciyi ayarlayın, cüzdan hazır." }
    ]
  },
  "scand-dev": {
    name: "Erik Larsson",
    origin: "İsveç (Stockholm)",
    region: "scand",
    budget: 190000,
    propertyId: "prop-alsancak-bungalow",
    avatarColor: "#a78bfa",
    messages: [
      { sender: "agent", text: "Hej Erik! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our Alsancak bungalow listing?" },
      { sender: "client", text: "Hej. Yes, I'm working remotely as a Tech Lead. I want a house surrounded by nature but with fast fiber internet. Alsancak seems to have good mountain views." },
      { sender: "agent", text: "Exactly, Alsancak has excellent infrastructure, English schools, supermarkets, and fiber optic connection up to 100 Mbps. It provides the perfect work-from-paradise environment." },
      { sender: "client", text: "Perfect. I want to schedule a virtual tour of the bungalow. If the internet speeds are verified, I can sign the contract online. Please connect me with the broker immediately." }
    ]
  }
};

// Global Server State Cache (High Performance Ticking)
let cachedState = null;
let otcExchangeRate = 1.255;

// Load state into cache from DB
async function loadStateToCache() {
  const row = await get("SELECT * FROM state WHERE id = 1");
  if (row) {
    cachedState = {
      networth: row.networth,
      passiveIncome: row.passiveIncome,
      lifestyleIndex: row.lifestyleIndex,
      ownedUpgrades: JSON.parse(row.ownedUpgrades),
      dealsClosed: row.dealsClosed,
      feedLogs: JSON.parse(row.feedLogs),
      agents: JSON.parse(row.agents),
      cryptoUSDT: row.cryptoUSDT
    };
  }
}

// Write cached state to DB
async function saveCacheToDb() {
  if (!cachedState) return;
  await run(`
    UPDATE state 
    SET networth = ?, passiveIncome = ?, lifestyleIndex = ?, ownedUpgrades = ?, dealsClosed = ?, feedLogs = ?, agents = ?, cryptoUSDT = ?
    WHERE id = 1
  `, [
    cachedState.networth,
    cachedState.passiveIncome,
    cachedState.lifestyleIndex,
    JSON.stringify(cachedState.ownedUpgrades),
    cachedState.dealsClosed,
    JSON.stringify(cachedState.feedLogs),
    JSON.stringify(cachedState.agents),
    cachedState.cryptoUSDT
  ]);
}

// Helper to push logs
function addServerLog(msg, type = "normal") {
  if (!cachedState) return;
  const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
  cachedState.feedLogs.unshift({ timestamp, msg, type });
  if (cachedState.feedLogs.length > 30) cachedState.feedLogs.pop();
}

// REST Endpoints

// 1. GET State
app.get('/api/state', (req, res) => {
  if (!cachedState) return res.status(500).json({ error: "State not loaded yet" });
  res.json({ ...cachedState, otcExchangeRate });
});

// 2. POST State Reset
app.post('/api/state/reset', async (req, res) => {
  try {
    await run("DELETE FROM leads");
    await run("UPDATE state SET networth = 500, passiveIncome = 0, lifestyleIndex = 1.0, ownedUpgrades = '[]', dealsClosed = 0, feedLogs = '[]', agents = '{\"scraper\":{\"targetRegion\":\"all\",\"model\":\"mini\"},\"negotiator\":{\"model\":\"mini\"},\"closer\":{\"model\":\"mini\"}}', cryptoUSDT = 0 WHERE id = 1");
    await loadStateToCache();
    
    // Reset prompts to default
    await run("DELETE FROM prompts");
    const defaultPrompts = [
      ["german-expat", "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?"],
      ["uk-retiree", "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?"],
      ["crypto-whale", "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var."],
      ["scand-dev", "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?"]
    ];
    const stmt = db.prepare("INSERT INTO prompts (key, template) VALUES (?, ?)");
    defaultPrompts.forEach(p => stmt.run(p));
    stmt.finalize();

    addServerLog("Tüm sistem verileri yerel veri tabanında sıfırlandı.", "warning");
    await saveCacheToDb();
    res.json({ ...cachedState, otcExchangeRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Shop Upgrade
app.post('/api/state/upgrade', async (req, res) => {
  const { id, cost, passiveBoost, category } = req.body;
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  if (cachedState.networth >= cost && !cachedState.ownedUpgrades.includes(id)) {
    cachedState.networth -= cost;
    cachedState.ownedUpgrades.push(id);
    if (passiveBoost > 0) cachedState.passiveIncome += passiveBoost;
    
    if (category === "Housing") cachedState.lifestyleIndex += 2.0;
    else if (category === "Equipment") cachedState.lifestyleIndex += 0.5;
    else cachedState.lifestyleIndex += 0.3;
    
    addServerLog(`Altyapı yatırımı satın alındı: ${id}. Varlık ve altyapı endeksi güncellendi.`, "success");
    await saveCacheToDb();
    res.json(cachedState);
  } else {
    res.status(400).json({ error: "Insufficient funds or upgrade already owned" });
  }
});

// 4. POST OTC Swap
app.post('/api/state/swap', async (req, res) => {
  const { amountGbp } = req.body;
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  if (amountGbp <= 0) return res.status(400).json({ error: "Invalid swap amount" });
  if (cachedState.networth >= amountGbp) {
    cachedState.networth -= amountGbp;
    const receivedUsdt = amountGbp * otcExchangeRate;
    cachedState.cryptoUSDT += receivedUsdt;
    
    addServerLog(`OTC Swap İşlemi: £${amountGbp} nakit satılarak ${receivedUsdt.toFixed(2)} USDT alındı.`, "success");
    await saveCacheToDb();
    res.json(cachedState);
  } else {
    res.status(400).json({ error: "Insufficient funds" });
  }
});

// 5. POST Upgrade Agent Model
app.post('/api/agents/upgrade', async (req, res) => {
  const { agentId, nextModelId, cost } = req.body;
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  if (cachedState.networth >= cost) {
    cachedState.networth -= cost;
    cachedState.agents[agentId].model = nextModelId;
    
    const nextModelName = AGENT_MODELS[nextModelId].name;
    addServerLog(`AI Ajanı modeli yükseltildi: ${agentId} -> ${nextModelName}`, "success");
    await saveCacheToDb();
    res.json(cachedState);
  } else {
    res.status(400).json({ error: "Insufficient funds to upgrade agent" });
  }
});

// 6. POST Scraper Target Region
app.post('/api/agents/region', async (req, res) => {
  const { region } = req.body;
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  cachedState.agents.scraper.targetRegion = region;
  addServerLog(`Scraper hedef pazar bölgesi değiştirildi: ${region}`, "warning");
  await saveCacheToDb();
  res.json(cachedState);
});

// 7. GET Prompts
app.get('/api/prompts', async (req, res) => {
  try {
    const rows = await query("SELECT * FROM prompts");
    const promptsObj = {};
    rows.forEach(r => promptsObj[r.key] = r.template);
    res.json(promptsObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. POST Update Prompt
app.post('/api/prompts', async (req, res) => {
  const { key, template } = req.body;
  try {
    await run("INSERT OR REPLACE INTO prompts (key, template) VALUES (?, ?)", [key, template]);
    addServerLog(`İletişim şablonu güncellendi: ${key}`, "success");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. GET Leads
app.get('/api/leads', async (req, res) => {
  try {
    const rows = await query("SELECT * FROM leads ORDER BY timestamp DESC");
    const formatted = rows.map(r => ({
      ...r,
      history: JSON.parse(r.history)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. POST Generate Lead
app.post('/api/leads/generate', async (req, res) => {
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  try {
    let keys = Object.keys(DIALOG_TEMPLATES);
    const region = cachedState.agents.scraper.targetRegion;
    if (region !== 'all') {
      keys = keys.filter(k => DIALOG_TEMPLATES[k].region === region);
    }
    if (keys.length === 0) return res.status(400).json({ error: "No templates for active region filter" });
    
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const template = DIALOG_TEMPLATES[randomKey];
    
    // Check if lead already active
    const activeRow = await get("SELECT id FROM leads WHERE name = ? AND status != 'COMPLETED'", [template.name]);
    if (activeRow) return res.json({ status: "already_active" });
    
    // Load prompt
    const promptRow = await get("SELECT template FROM prompts WHERE key = ?", [randomKey]);
    const promptTemplate = promptRow ? promptRow.template : template.messages[0].text;
    
    const propertyTitle = "Kıbrıs Luxury Gayrimenkulü"; // Default fallback title
    const firstMsgText = promptTemplate
      .replace("{name}", template.name)
      .replace("{property}", propertyTitle);
      
    const leadId = "lead-" + Date.now() + "-" + Math.floor(Math.random() * 100);
    const historyJson = JSON.stringify([{ sender: "agent", text: firstMsgText }]);
    
    await run(`
      INSERT INTO leads (id, name, origin, region, budget, propertyId, avatarColor, status, history, dialogKey, currentStep, tickCounter, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'CHATTING', ?, ?, 0, 0, ?)
    `, [
      leadId,
      template.name,
      template.origin,
      template.region,
      template.budget,
      template.propertyId,
      template.avatarColor,
      historyJson,
      randomKey,
      Date.now()
    ]);
    
    addServerLog(`MÜŞTERİ HEDEFİ BULUNDU: ${template.name} (${template.origin}) taranarak ağa bağlandı.`, "warning");
    res.json({ id: leadId, name: template.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. POST Qualify & Claim Commission
app.post('/api/leads/:id/qualify', async (req, res) => {
  const { id } = req.params;
  if (!cachedState) return res.status(500).json({ error: "State not loaded" });
  
  try {
    const lead = await get("SELECT * FROM leads WHERE id = ?", [id]);
    if (!lead || lead.status !== "QUALIFIED") return res.status(400).json({ error: "Lead not ready for qualification" });
    
    const propertyId = lead.propertyId;
    // Base commission matching PROPERTIES prices
    const prop = PROPERTIES.find(p => p.id === propertyId);
    if (!prop) return res.status(400).json({ error: "Property matching failed" });
    
    const closerModel = cachedState.agents.closer.model;
    const closerQuality = AGENT_MODELS[closerModel].qualityBoost;
    
    const commission = prop.price * prop.commissionRate * 0.4 * closerQuality;
    
    cachedState.networth += commission;
    cachedState.dealsClosed += 1;
    
    await run("UPDATE leads SET status = 'COMPLETED' WHERE id = ?", [id]);
    
    addServerLog(`HEDEF TAMAMLANDI: ${lead.name} başarıyla yönlendirildi. £${Math.floor(commission)} hesaba geçti!`, "success");
    await saveCacheToDb();
    
    res.json({ ...cachedState, commission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Background Simulation Timer (Runs once every 1s in memory)
let tickCounter = 0;
function startSimulationLoop() {
  setInterval(async () => {
    if (!cachedState) return;
    
    // 1. Accumulate Passive Income
    if (cachedState.passiveIncome > 0) {
      cachedState.networth += cachedState.passiveIncome * 1.0;
    }
    
    // 2. Float OTC Rate
    otcExchangeRate += (Math.random() - 0.5) * 0.002;
    if (otcExchangeRate < 1.240) otcExchangeRate = 1.240;
    if (otcExchangeRate > 1.275) otcExchangeRate = 1.275;
    
    // 3. Random Log Generation
    if (Math.random() < 0.05) {
      const logs = [
        "AI Ajanı LinkedIn aramalarını güncelliyor...",
        "Reddit Cyprus Real Estate konuları taranıyor...",
        "Girne bölgesindeki emlak komisyon sözleşmeleri inceleniyor...",
        "Alman expat forumunda Kıbrıs vergi avantajları tartışılıyor..."
      ];
      addServerLog(logs[Math.floor(Math.random() * logs.length)]);
    }
    
    // 4. Scraper Lead Generation
    let upgradesMultiplier = 1.0;
    // We would calculate it by parsing ownedUpgrades and mapping multipliers
    // For simplicity, we scan if specific upgrade ids exist in ownedUpgrades
    if (cachedState.ownedUpgrades.includes("shop-laptop")) upgradesMultiplier *= 1.5;
    if (cachedState.ownedUpgrades.includes("shop-penthouse")) upgradesMultiplier *= 2.5;
    if (cachedState.ownedUpgrades.includes("shop-agent-pro")) upgradesMultiplier *= 3.0;
    if (cachedState.ownedUpgrades.includes("shop-villa-bellapais")) upgradesMultiplier *= 5.0;
    
    const scraperModel = cachedState.agents.scraper.model;
    const scraperSpeed = AGENT_MODELS[scraperModel].speedBoost;
    
    const currentMultiplier = upgradesMultiplier * scraperSpeed;
    
    // Fetch active leads count
    const activeLeadsCountRow = await get("SELECT COUNT(*) as count FROM leads WHERE status != 'COMPLETED'");
    const activeLeadsCount = activeLeadsCountRow ? activeLeadsCountRow.count : 0;
    
    if (activeLeadsCount < 6 && Math.random() < (0.015 * currentMultiplier)) {
      // Trigger API endpoints generating lead asynchronously
      // For backend ease, we generate directly
      try {
        let keys = Object.keys(DIALOG_TEMPLATES);
        const region = cachedState.agents.scraper.targetRegion;
        if (region !== 'all') {
          keys = keys.filter(k => DIALOG_TEMPLATES[k].region === region);
        }
        if (keys.length > 0) {
          const randomKey = keys[Math.floor(Math.random() * keys.length)];
          const template = DIALOG_TEMPLATES[randomKey];
          
          const alreadyActive = await get("SELECT id FROM leads WHERE name = ? AND status != 'COMPLETED'", [template.name]);
          if (!alreadyActive) {
            const promptRow = await get("SELECT template FROM prompts WHERE key = ?", [randomKey]);
            const promptTemplate = promptRow ? promptRow.template : template.messages[0].text;
            
            const firstMsgText = promptTemplate
              .replace("{name}", template.name)
              .replace("{property}", "Kıbrıs Emlak Projesi");
              
            const leadId = "lead-" + Date.now() + "-" + Math.floor(Math.random() * 100);
            const historyJson = JSON.stringify([{ sender: "agent", text: firstMsgText }]);
            
            await run(`
              INSERT INTO leads (id, name, origin, region, budget, propertyId, avatarColor, status, history, dialogKey, currentStep, tickCounter, timestamp)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'CHATTING', ?, ?, 0, 0, ?)
            `, [leadId, template.name, template.origin, template.region, template.budget, template.propertyId, template.avatarColor, historyJson, randomKey, Date.now()]);
            
            addServerLog(`MÜŞTERİ HEDEFİ BULUNDU: ${template.name} (${template.origin}) taranarak ağa bağlandı.`, "warning");
          }
        }
      } catch (err) {
        console.error("Lead generation error", err);
      }
    }
    
    // 5. Progress active lead conversations
    try {
      const activeLeads = await query("SELECT * FROM leads WHERE status = 'CHATTING'");
      const negotiatorModel = cachedState.agents.negotiator.model;
      const negotiatorSpeed = AGENT_MODELS[negotiatorModel].speedBoost;
      const ticksNeeded = Math.max(3, Math.floor(8 / negotiatorSpeed));
      
      for (const lead of activeLeads) {
        let currentTicks = lead.tickCounter + 1;
        
        if (currentTicks >= ticksNeeded) {
          // Progress step
          const template = DIALOG_TEMPLATES[lead.dialogKey];
          const nextStep = lead.currentStep + 1;
          const messagesHistory = JSON.parse(lead.history);
          
          if (nextStep < template.messages.length) {
            messagesHistory.push(template.messages[nextStep]);
            const isLastMessage = nextStep === template.messages.length - 1;
            const newStatus = isLastMessage ? "QUALIFIED" : "CHATTING";
            
            await run("UPDATE leads SET currentStep = ?, tickCounter = 0, status = ?, history = ? WHERE id = ?", [
              nextStep,
              newStatus,
              JSON.stringify(messagesHistory),
              lead.id
            ]);
            
            if (isLastMessage) {
              addServerLog(`Müşteri ${lead.name} ile görüşme tamamlandı. Bütçe doğrulandı ve yönlendirme için hazır!`, "success");
            } else {
              addServerLog(`${lead.name} ile AI sohbeti ilerliyor: "${template.messages[nextStep].text.substring(0, 30)}..."`);
            }
          }
        } else {
          await run("UPDATE leads SET tickCounter = ? WHERE id = ?", [currentTicks, lead.id]);
        }
      }
    } catch (err) {
      console.error("Dialogue progression error", err);
    }
    
    // 6. Periodic DB Save (Every 5 seconds)
    tickCounter++;
    if (tickCounter >= 5) {
      tickCounter = 0;
      await saveCacheToDb();
    }
    
  }, 1000);
}

// Start Server
async function startServer() {
  try {
    await initDb();
    await loadStateToCache();
    startSimulationLoop();
    app.listen(PORT, () => {
      console.log(`ARES Secure Backend Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start database & server:", err);
  }
}

// Support DB references in route closure
const dbModule = require('./db');
const db = dbModule.db;

startServer();
