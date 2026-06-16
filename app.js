// ARES - Cyprus Luxury Lead-Gen Platform Game Logic

// 1. Initial Data Models
const PROPERTIES = [
  {
    id: "prop-esentepe-villa",
    title: "Esentepe Denize Sıfır Villa",
    location: "Esentepe, Girne",
    price: 550000,
    commissionRate: 0.08,
    yield: "9.5%",
    description: "Sonsuzluk havuzlu, 3+1 özel tasarım lüks villa. Akdeniz'e sıfır konumda yüksek kiralama getirisi sunar.",
    suitability: "Avrupalı Emekliler / Vergi Muafiyeti Arayanlar",
    imageSvg: `<svg viewBox="0 0 100 60" width="100%" height="100%"><rect width="100" height="60" fill="#1e293b"/><path d="M10 45 L50 15 L90 45 Z" fill="#0f172a"/><rect x="25" y="35" width="50" height="20" fill="#334155"/><rect x="40" y="42" width="20" height="13" fill="#f5a623" opacity="0.8"/><circle cx="80" cy="20" r="8" fill="#fda085"/></svg>`
  },
  {
    id: "prop-iskele-penthouse",
    title: "Long Beach Luxury Penthouse",
    location: "İskele, Gazimağusa",
    price: 240000,
    commissionRate: 0.07,
    yield: "11.2%",
    description: "İskele Long Beach sahiline 150m mesafede, 2+1 geniş teraslı penthouse daire. Rezidans konseptli tatil kiralama.",
    suitability: "Kripto Yatırımcıları / Airbnb İşletmecileri",
    imageSvg: `<svg viewBox="0 0 100 60" width="100%" height="100%"><rect width="100" height="60" fill="#1e293b"/><rect x="15" y="15" width="70" height="35" fill="#0f172a"/><line x1="15" y1="25" x2="85" y2="25" stroke="#f5a623" stroke-width="2"/><rect x="30" y="30" width="10" height="20" fill="#334155"/><rect x="60" y="30" width="10" height="20" fill="#334155"/></svg>`
  },
  {
    id: "prop-bellapais-mansion",
    title: "Bellapais Tarihi Malikane",
    location: "Bellapais, Girne",
    price: 1200000,
    commissionRate: 0.06,
    yield: "7.0%",
    description: "Bellapais Manastırı yakınında, dağ ve deniz manzaralı, 5+2 otantik taş mimariye sahip ultra lüks malikane.",
    suitability: "HNI / Prestij ve Oturum İzni Arayanlar",
    imageSvg: `<svg viewBox="0 0 100 60" width="100%" height="100%"><rect width="100" height="60" fill="#1e293b"/><path d="M20 40 L50 10 L80 40 Z" fill="#0f172a"/><rect x="30" y="30" width="40" height="25" fill="#0f172a"/><rect x="45" y="40" width="10" height="15" fill="#f5a623"/></svg>`
  },
  {
    id: "prop-alsancak-bungalow",
    title: "Alsancak Doğa Bungalovu",
    location: "Alsancak, Girne",
    price: 1850000,
    commissionRate: 0.06,
    yield: "8.5%",
    description: "Dağ esintisine sahip, zeytin ağaçları arasında 3+1 özel havuzlu dağbungalovu. Sakin yaşam arayanlar için ideal.",
    suitability: "İngiliz Expatlar / Doğa Severler",
    imageSvg: `<svg viewBox="0 0 100 60" width="100%" height="100%"><rect width="100" height="60" fill="#1e293b"/><path d="M15 45 L50 20 L85 45 Z" fill="#334155"/><rect x="25" y="40" width="50" height="15" fill="#0f172a"/></svg>`
  }
];

const SHOP_ITEMS = [
  {
    id: "shop-laptop",
    title: "M4 Ultra Workstation",
    desc: "AI kazıma algoritmalarınızı daha hızlı çalıştırmak için üst düzey bilgisayar donanımı.",
    cost: 1200,
    multiplier: 1.5,
    passiveBoost: 0,
    category: "Equipment",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg>`
  },
  {
    id: "shop-assistant",
    title: "AI CRM Assistant Bot",
    desc: "Sohbetleri otomatik yöneterek pasif gelir akışı üretir.",
    cost: 5000,
    multiplier: 1.0,
    passiveBoost: 50, // GBP per second
    category: "Automation",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`
  },
  {
    id: "shop-penthouse",
    title: "Girne Marina Penthouse",
    desc: "Girne Marina'da lüks ofis/yaşam alanı. AI kazıma ağınızı genişletir ve prestijinizi artırır.",
    cost: 25000,
    multiplier: 2.5,
    passiveBoost: 150,
    category: "Housing",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`
  },
  {
    id: "shop-agent-pro",
    title: "ARES Pro Outreach Modülü",
    desc: "Sosyal medya ve LinkedIn API entegrasyonu. Aday müşteri bulma hızını 3 katına çıkarır.",
    cost: 65000,
    multiplier: 3.0,
    passiveBoost: 350,
    category: "Automation",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
  },
  {
    id: "shop-villa-bellapais",
    title: "Bellapais Havuzlu Malikane",
    desc: "Sonsuzluk havuzlu ve dağ manzaralı lüks konut. En üst düzey yaşam ve donanım standardı.",
    cost: 150000,
    multiplier: 5.0,
    passiveBoost: 1000,
    category: "Housing",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`
  }
];

const AGENT_MODELS = {
  mini: { name: "GPT-4o Mini", cost: 0, speedBoost: 1.0, qualityBoost: 1.0, next: "standard" },
  standard: { name: "Claude 3.5 Sonnet", cost: 12000, speedBoost: 1.6, qualityBoost: 1.3, next: "pro" },
  pro: { name: "o1 Pro (Reasoning)", cost: 45000, speedBoost: 2.8, qualityBoost: 1.8, next: null }
};

// Simulated CRM dialog paths for different prospects
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

// 2. State Management
let state = {
  networth: 500, // Starting capital (GBP)
  passiveIncome: 0, // GBP per second
  lifestyleIndex: 1.0,
  ownedUpgrades: [],
  leads: [],
  dealsClosed: 0,
  feedLogs: [],
  lastTick: Date.now(),
  agents: {
    scraper: { targetRegion: 'all', model: 'mini' },
    negotiator: { model: 'mini' },
    closer: { model: 'mini' }
  },
  prompts: {
    "german-expat": "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?",
    "uk-retiree": "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?",
    "crypto-whale": "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var.",
    "scand-dev": "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?"
  },
  cryptoUSDT: 0 // Crypto asset balance in USDT
};

// API configuration and state sync variables
let backendActive = false;
const API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:5050';

let lastCrmFingerprint = "";
let lastRenderedLeadId = null;
let lastRenderedMsgCount = 0;

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/state`);
    if (res.ok) {
      backendActive = true;
      console.log("ARES Backend is active. Running in online mode.");
    }
  } catch (e) {
    console.log("ARES Backend is offline. Running in local fallback mode (localStorage).");
  }
}

async function fetchStateAndLeads() {
  if (!backendActive) return;
  try {
    const [stateRes, leadsRes, promptsRes] = await Promise.all([
      fetch(`${API_BASE}/api/state`),
      fetch(`${API_BASE}/api/leads`),
      fetch(`${API_BASE}/api/prompts`)
    ]);
    
    if (stateRes.ok && leadsRes.ok && promptsRes.ok) {
      const serverState = await stateRes.json();
      const serverLeads = await leadsRes.json();
      const serverPrompts = await promptsRes.json();
      
      state.networth = serverState.networth;
      state.passiveIncome = serverState.passiveIncome;
      state.lifestyleIndex = serverState.lifestyleIndex;
      state.ownedUpgrades = serverState.ownedUpgrades;
      state.dealsClosed = serverState.dealsClosed;
      state.feedLogs = serverState.feedLogs;
      state.agents = serverState.agents;
      state.cryptoUSDT = serverState.cryptoUSDT;
      otcExchangeRate = serverState.otcExchangeRate;
      
      state.leads = serverLeads;
      state.prompts = serverPrompts;
    }
  } catch (e) {
    console.error("Error fetching online data", e);
  }
}

// Helper: Format Money
function formatMoney(amount) {
  return "£" + Math.floor(amount).toLocaleString('en-GB');
}

// 3. Save / Load State
function saveState() {
  if (backendActive) return;
  localStorage.setItem("ares_state", JSON.stringify(state));
}

async function loadState() {
  if (backendActive) {
    await fetchStateAndLeads();
    return;
  }
  const saved = localStorage.getItem("ares_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure arrays/objects exist
      state = {
        networth: parsed.networth ?? 500,
        passiveIncome: parsed.passiveIncome ?? 0,
        lifestyleIndex: parsed.lifestyleIndex ?? 1.0,
        ownedUpgrades: parsed.ownedUpgrades ?? [],
        leads: parsed.leads ?? [],
        dealsClosed: parsed.dealsClosed ?? 0,
        feedLogs: parsed.feedLogs ?? [],
        lastTick: parsed.lastTick ?? Date.now(),
        agents: parsed.agents ?? {
          scraper: { targetRegion: 'all', model: 'mini' },
          negotiator: { model: 'mini' },
          closer: { model: 'mini' }
        },
        prompts: parsed.prompts ?? {
          "german-expat": "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?",
          "uk-retiree": "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?",
          "crypto-whale": "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var.",
          "scand-dev": "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?"
        },
        cryptoUSDT: parsed.cryptoUSDT ?? 0
      };
    } catch (e) {
      console.error("Error loading state, resetting.", e);
    }
  }
}

// 4. View Controller (Tab switching)
const navItems = document.querySelectorAll(".nav-item");
const viewPanels = document.querySelectorAll(".view-panel");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    // Remove active from nav
    navItems.forEach(nav => nav.classList.remove("active"));
    // Add active to current
    item.classList.add("active");
    
    // Hide all panels
    viewPanels.forEach(panel => panel.classList.remove("active-view"));
    // Show active panel
    const viewId = "view-" + item.getAttribute("data-view");
    document.getElementById(viewId).classList.add("active-view");
    
    // Refresh Tab views if needed
    if (item.getAttribute("data-view") === "agents") {
      renderAgents();
    } else if (item.getAttribute("data-view") === "shop") {
      renderShop();
      renderPortfolio();
    }
  });
});

let otcExchangeRate = 1.255;

// 5. Render Functions
function updateTopNavbar() {
  document.getElementById("networth-value").textContent = formatMoney(state.networth);
  document.getElementById("passive-value").textContent = `£${state.passiveIncome}/sn`;
  document.getElementById("lifestyle-value").textContent = `${state.lifestyleIndex.toFixed(1)} / 10.0`;
}

// Render Property Catalog
function renderProperties() {
  const container = document.getElementById("properties-container");
  container.innerHTML = "";
  
  PROPERTIES.forEach(prop => {
    const card = document.createElement("div");
    card.className = "glass-card property-card";
    
    const potentialCommission = prop.price * prop.commissionRate;
    const aresCut = potentialCommission * 0.4; // 40% Co-brokerage share
    
    card.innerHTML = `
      <div class="property-img-box">
        ${prop.imageSvg}
        <span class="property-badge">${prop.location}</span>
        <span class="property-commission-badge">ARES Payı: ${formatMoney(aresCut)}</span>
      </div>
      <div class="property-details">
        <div>
          <h3 class="property-title">${prop.title}</h3>
          <p class="property-desc">${prop.description}</p>
        </div>
        <div class="property-stats">
          <div class="prop-stat-box">
            <span class="prop-stat-label">Fiyat</span>
            <span class="prop-stat-val">${formatMoney(prop.price)}</span>
          </div>
          <div class="prop-stat-box">
            <span class="prop-stat-label">Kira Getirisi</span>
            <span class="prop-stat-val" style="color: var(--primary);">${prop.yield}</span>
          </div>
          <div class="prop-stat-box">
            <span class="prop-stat-label">Uygun Kitle</span>
            <span class="prop-stat-val" style="font-size: 9px; line-height: 1.2;">${prop.suitability}</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Shop Upgrades
function renderShop() {
  const container = document.getElementById("shop-container");
  container.innerHTML = "";
  
  SHOP_ITEMS.forEach(item => {
    const isOwned = state.ownedUpgrades.includes(item.id);
    const canAfford = state.networth >= item.cost;
    
    const card = document.createElement("div");
    card.className = `glass-card shop-card ${isOwned ? 'owned' : (canAfford ? 'unlocked' : '')}`;
    
    card.innerHTML = `
      <div>
        <div class="shop-icon-box">
          ${item.icon}
        </div>
        <h3 class="shop-title">${item.title}</h3>
        <p class="shop-desc">${item.desc}</p>
        <p style="font-size: 11px; color: var(--primary); margin-top: 4px;">
          ${item.multiplier > 1 ? `Kazıma Hızı: +%${Math.floor((item.multiplier - 1) * 100)}` : ''}
          ${item.passiveBoost > 0 ? `Pasif Gelir: +£${item.passiveBoost}/sn` : ''}
        </p>
      </div>
      <div class="shop-footer">
        <span class="shop-cost">${isOwned ? 'SAHİP' : formatMoney(item.cost)}</span>
        <button class="btn-buy" id="btn-buy-${item.id}" ${isOwned ? 'disabled' : (canAfford ? '' : 'disabled')}>
          ${isOwned ? 'Yüklendi' : 'Satın Al'}
        </button>
      </div>
    `;
    container.appendChild(card);
    
    if (!isOwned) {
      document.getElementById(`btn-buy-${item.id}`).addEventListener("click", () => buyUpgrade(item));
    }
  });
}

async function buyUpgrade(item) {
  if (backendActive) {
    try {
      const res = await fetch(`${API_BASE}/api/state/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          cost: item.cost,
          passiveBoost: item.passiveBoost,
          category: item.category
        })
      });
      if (res.ok) {
        const updatedState = await res.json();
        Object.assign(state, updatedState);
        updateTopNavbar();
        renderShop();
        renderPortfolio();
        updateFunnelDisplay();
        renderFeedLogs();
      } else {
        const err = await res.json();
        alert(`Hata: ${err.error}`);
      }
    } catch (e) {
      console.error("Upgrade error", e);
    }
  } else {
    if (state.networth >= item.cost && !state.ownedUpgrades.includes(item.id)) {
      state.networth -= item.cost;
      state.ownedUpgrades.push(item.id);
      
      // Apply stats
      if (item.passiveBoost > 0) {
        state.passiveIncome += item.passiveBoost;
      }
      
      // Upgrade lifestyle index based on purchases
      if (item.category === "Housing") {
        state.lifestyleIndex += 2.0;
      } else if (item.category === "Equipment") {
        state.lifestyleIndex += 0.5;
      } else {
        state.lifestyleIndex += 0.3;
      }
      
      addFeedLog(`Yükseltme satın alındı: ${item.title}. Operasyonel kapasite ve yaşam kalitesi başarıyla artırıldı.`, "success");
      
      saveState();
      updateTopNavbar();
      renderShop();
      renderPortfolio();
      updateFunnelDisplay();
    }
  }
}

// 6. CRM Lead and Chat logic
let selectedLeadId = null;

function renderCrm() {
  const chatListContainer = document.getElementById("crm-chat-list");
  if (!chatListContainer) return;
  
  const fingerprint = selectedLeadId + "_" + state.leads.map(l => `${l.id}:${l.status}`).join("|");
  if (lastCrmFingerprint === fingerprint) {
    return;
  }
  lastCrmFingerprint = fingerprint;
  
  chatListContainer.innerHTML = "";
  
  if (state.leads.length === 0) {
    chatListContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; margin-top: 24px;">Henüz aktif aday müşteri yok. AI tarayıcının lead bulması bekleniyor...</div>`;
    return;
  }
  
  state.leads.forEach(lead => {
    const isSelected = lead.id === selectedLeadId;
    const item = document.createElement("div");
    item.className = `chat-item ${isSelected ? 'active' : ''}`;
    item.setAttribute("data-lead-id", lead.id);
    
    const isCompleted = lead.status === "COMPLETED";
    const isQualified = lead.status === "QUALIFIED";
    
    let badgeClass = "";
    if (isCompleted) badgeClass = "qualified";
    else if (isQualified) badgeClass = "hot";
    
    const closerQuality = AGENT_MODELS[state.agents.closer.model].qualityBoost;
    const potentialCommission = PROPERTIES.find(p => p.id === lead.propertyId).price * PROPERTIES.find(p => p.id === lead.propertyId).commissionRate * 0.4 * closerQuality;

    item.innerHTML = `
      <div class="chat-item-avatar ${badgeClass}" style="border-color: ${lead.avatarColor};">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="${lead.avatarColor}" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="chat-item-details">
        <div class="chat-item-name">
          <span>${lead.name}</span>
          <span class="chat-item-status ${isCompleted ? 'qualified' : ''}">
            ${lead.status === "SCRAPING" ? 'Taranıyor' : ''}
            ${lead.status === "CHATTING" ? 'AI Konuşuyor' : ''}
            ${lead.status === "QUALIFIED" ? 'Hazır!' : ''}
            ${lead.status === "COMPLETED" ? 'Yönlendirildi' : ''}
          </span>
        </div>
        <div class="chat-item-msg">${lead.origin} | Bütçe: ${formatMoney(lead.budget)}</div>
      </div>
    `;
    
    item.addEventListener("click", () => {
      selectedLeadId = lead.id;
      renderCrm();
      renderActiveChat();
    });
    
    chatListContainer.appendChild(item);
  });
}

function renderActiveChat() {
  const headerContainer = document.getElementById("active-chat-info");
  const threadContainer = document.getElementById("chat-thread-container");
  const qualifyBtn = document.getElementById("btn-qualify-lead");
  
  if (!selectedLeadId) {
    headerContainer.innerHTML = `
      <div class="client-meta">
        <div class="client-name">Sohbet Seçilmedi</div>
        <div class="client-budget">İletişimi başlatmak için sol taraftan bir müşteri seçin.</div>
      </div>
    `;
    threadContainer.innerHTML = `<div class="msg-bubble agent-action">AI Ajanlarımız aktif olarak forum ve sosyal ağları tarayarak potansiyel alıcı adaylarıyla ilk temasları kurmaktadır.</div>`;
    qualifyBtn.disabled = true;
    lastRenderedLeadId = null;
    lastRenderedMsgCount = 0;
    return;
  }
  
  const lead = state.leads.find(l => l.id === selectedLeadId);
  if (!lead) return;
  
  const msgCount = lead.history.length;
  const leadStatus = lead.status;
  if (lastRenderedLeadId === selectedLeadId && lastRenderedMsgCount === msgCount && qualifyBtn.getAttribute("data-status") === leadStatus) {
    return;
  }
  
  lastRenderedLeadId = selectedLeadId;
  lastRenderedMsgCount = msgCount;
  qualifyBtn.setAttribute("data-status", leadStatus);
  
  const property = PROPERTIES.find(p => p.id === lead.propertyId);
  const closerQuality = AGENT_MODELS[state.agents.closer.model].qualityBoost;
  const potentialCommission = property.price * property.commissionRate * 0.4 * closerQuality;
  
  headerContainer.innerHTML = `
    <div class="client-meta">
      <div class="client-name">${lead.name} (${lead.origin})</div>
      <div class="client-budget">İlan: ${property.title} | Komisyon Payı: ${formatMoney(potentialCommission)}</div>
    </div>
  `;
  
  threadContainer.innerHTML = "";
  
  // Render message history
  lead.history.forEach(msg => {
    const bubble = document.createElement("div");
    if (msg.sender === "agent") {
      bubble.className = "msg-bubble outgoing";
    } else {
      bubble.className = "msg-bubble incoming";
    }
    bubble.textContent = msg.text;
    threadContainer.appendChild(bubble);
  });
  
  // Auto-scroll chat thread to bottom
  threadContainer.scrollTop = threadContainer.scrollHeight;
  
  // Handle Button Status
  if (lead.status === "QUALIFIED") {
    qualifyBtn.disabled = false;
    qualifyBtn.classList.remove("btn-primary");
    qualifyBtn.classList.add("btn-accent");
    qualifyBtn.textContent = "Yönlendir ve Komisyon Al";
  } else if (lead.status === "COMPLETED") {
    qualifyBtn.disabled = true;
    qualifyBtn.textContent = "Satış Ekibine Gönderildi";
  } else {
    qualifyBtn.disabled = true;
    qualifyBtn.textContent = "AI Kalifikasyonu Sürüyor...";
  }
}

// 7. Qualify Lead Modal actions
const dealModal = document.getElementById("deal-modal");
const modalBodyText = document.getElementById("modal-body-text");
const confirmDealBtn = document.getElementById("btn-confirm-deal");
const closeModalBtn = document.getElementById("btn-close-modal");

document.getElementById("btn-qualify-lead").addEventListener("click", () => {
  if (!selectedLeadId) return;
  const lead = state.leads.find(l => l.id === selectedLeadId);
  if (lead && lead.status === "QUALIFIED") {
    const property = PROPERTIES.find(p => p.id === lead.propertyId);
    const closerQuality = AGENT_MODELS[state.agents.closer.model].qualityBoost;
    const potentialCommission = property.price * property.commissionRate * 0.4 * closerQuality;
    
    modalBodyText.innerHTML = `
      Müşteri <strong>${lead.name}</strong>, ilgilendiği <strong>${property.title}</strong> projesi için Kıbrıs'taki partner acentemize yönlendiriliyor.<br><br>
      Elde edeceğiniz Co-Brokerage gelir payı: <strong>${formatMoney(potentialCommission)}</strong>
    `;
    dealModal.classList.add("active");
  }
});

closeModalBtn.addEventListener("click", () => {
  dealModal.classList.remove("active");
});

confirmDealBtn.addEventListener("click", async () => {
  if (!selectedLeadId) return;
  const lead = state.leads.find(l => l.id === selectedLeadId);
  if (lead && lead.status === "QUALIFIED") {
    if (backendActive) {
      try {
        const res = await fetch(`${API_BASE}/api/leads/${lead.id}/qualify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const result = await res.json();
          Object.assign(state, result);
          dealModal.classList.remove("active");
          await fetchStateAndLeads();
          updateTopNavbar();
          renderCrm();
          renderActiveChat();
          updateFunnelDisplay();
          renderFeedLogs();
        } else {
          const err = await res.json();
          alert(`Hata: ${err.error}`);
        }
      } catch (e) {
        console.error("Qualify error", e);
      }
    } else {
      const property = PROPERTIES.find(p => p.id === lead.propertyId);
      const closerQuality = AGENT_MODELS[state.agents.closer.model].qualityBoost;
      const potentialCommission = property.price * property.commissionRate * 0.4 * closerQuality;
      
      state.networth += potentialCommission;
      lead.status = "COMPLETED";
      state.dealsClosed += 1;
      
      addFeedLog(`ANLAŞMA BAŞARILI! ${lead.name} yönlendirildi. ${formatMoney(potentialCommission)} hesabınıza geçti!`, "success");
      
      dealModal.classList.remove("active");
      saveState();
      updateTopNavbar();
      renderCrm();
      renderActiveChat();
      updateFunnelDisplay();
    }
  }
});

// 8. Feed Logs
function addFeedLog(msg, type = "normal") {
  const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
  state.feedLogs.unshift({ timestamp, msg, type });
  
  // Cap logs at 30 items
  if (state.feedLogs.length > 30) {
    state.feedLogs.pop();
  }
  
  renderFeedLogs();
}

function renderFeedLogs() {
  const container = document.getElementById("feed-container");
  if (!container) return;
  container.innerHTML = "";
  
  state.feedLogs.forEach(log => {
    const item = document.createElement("div");
    item.className = `feed-item ${log.type === 'warning' ? 'warning' : (log.type === 'success' ? 'success' : '')}`;
    item.innerHTML = `
      <span class="feed-time">[${log.timestamp}]</span>
      <span class="feed-message">${log.msg}</span>
    `;
    container.appendChild(item);
  });
}

// 9. Funnel Updates
function updateFunnelDisplay() {
  // Scraper speed calculated by upgrades multiplier and active scraper model
  let baseScrapeSpeed = 15;
  let multiplier = 1.0;
  
  state.ownedUpgrades.forEach(upId => {
    const up = SHOP_ITEMS.find(s => s.id === upId);
    if (up) multiplier *= up.multiplier;
  });
  
  const scraperSpeed = AGENT_MODELS[state.agents.scraper.model].speedBoost;
  const scraperQuality = AGENT_MODELS[state.agents.scraper.model].qualityBoost;
  
  const currentScrapeSpeed = Math.floor(baseScrapeSpeed * multiplier * scraperSpeed);
  
  document.getElementById("funnel-scraped-speed").textContent = `${currentScrapeSpeed} profil / dk`;
  document.getElementById("funnel-matched-rate").textContent = `%${Math.floor((22 + (multiplier * 2)) * scraperQuality)}`;
  
  const activeLeadsCount = state.leads.filter(l => l.status !== "COMPLETED").length;
  document.getElementById("funnel-inbox-count").textContent = `${activeLeadsCount} aktif lead`;
  document.getElementById("funnel-deals-closed").textContent = `${state.dealsClosed} anlaşma`;
  
  document.getElementById("pool-count").textContent = Math.floor((242 * multiplier + (state.dealsClosed * 4)) * scraperSpeed);
  document.getElementById("multiplier-value").textContent = `${(multiplier * scraperSpeed).toFixed(1)}x`;
}

// 10. Simulation Loop Logic
function generateNewLead() {
  // Choose random template based on region settings
  let keys = Object.keys(DIALOG_TEMPLATES);
  const region = state.agents.scraper.targetRegion;
  if (region !== 'all') {
    keys = keys.filter(k => DIALOG_TEMPLATES[k].region === region);
  }
  if (keys.length === 0) return; // Fallback
  
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const template = DIALOG_TEMPLATES[randomKey];
  
  // Check if lead already exists in system to prevent duplicate names active
  const alreadyActive = state.leads.some(l => l.name === template.name && l.status !== "COMPLETED");
  if (alreadyActive) return;
  
  const propertyTitle = PROPERTIES.find(p => p.id === template.propertyId).title;
  const firstMsgText = state.prompts[randomKey]
    .replace("{name}", template.name)
    .replace("{property}", propertyTitle);
  
  // Generate lead object
  const newLead = {
    id: "lead-" + Date.now() + "-" + Math.floor(Math.random() * 100),
    name: template.name,
    origin: template.origin,
    budget: template.budget,
    propertyId: template.propertyId,
    avatarColor: template.avatarColor,
    status: "CHATTING",
    history: [{ sender: "agent", text: firstMsgText }], // Start with customized first message
    dialogKey: randomKey,
    currentStep: 0,
    tickCounter: 0
  };
  
  state.leads.push(newLead);
  addFeedLog(`YENİ MÜŞTERİ YAKALANDI: ${newLead.name} (${newLead.origin}) ARES AI kazıma ağına takıldı. İlk mesaj gönderildi.`, "warning");
  saveState();
  renderCrm();
  updateFunnelDisplay();
}

async function processSimulationTicks() {
  if (backendActive) {
    await fetchStateAndLeads();
    updateTopNavbar();
    renderShop();
    renderAgents();
    renderPortfolio();
    
    const tickerSpan = document.getElementById("swap-ticker-rate");
    if (tickerSpan) {
      tickerSpan.textContent = `Güncel OTC Kuru: 1 GBP = ${otcExchangeRate.toFixed(3)} USDT`;
    }
    updateOtcSwapOutput();
    renderCrm();
    renderActiveChat();
    renderFeedLogs();
    updateFunnelDisplay();
    return;
  }
  
  // Accumulate passive income
  const now = Date.now();
  const delta = (now - state.lastTick) / 1000;
  state.lastTick = now;
  
  if (state.passiveIncome > 0 && delta > 0) {
    state.networth += state.passiveIncome * delta;
    updateTopNavbar();
    
    // Dynamically enable shop and agent buttons as balance increases
    renderShop();
    renderAgents();
  }
  
  // Float OTC exchange rate slightly
  otcExchangeRate += (Math.random() - 0.5) * 0.002;
  if (otcExchangeRate < 1.240) otcExchangeRate = 1.240;
  if (otcExchangeRate > 1.275) otcExchangeRate = 1.275;
  
  // Update swap ticker if element exists
  const tickerSpan = document.getElementById("swap-ticker-rate");
  if (tickerSpan) {
    tickerSpan.textContent = `Güncel OTC Kuru: 1 GBP = ${otcExchangeRate.toFixed(3)} USDT`;
  }
  
  // Recalculate output if user is typing
  updateOtcSwapOutput();
  
  // Refresh portfolio values
  renderPortfolio();
  
  // Random feed logs simulation
  if (Math.random() < 0.05) {
    const logs = [
      "AI Ajanı LinkedIn aramalarını güncelliyor...",
      "Reddit Cyprus Real Estate konuları taranıyor...",
      "Girne bölgesindeki emlak komisyon sözleşmeleri inceleniyor...",
      "Alman expat forumunda Kıbrıs vergi avantajları tartışılıyor...",
      "Emlak partnerlerimizden Döveç Group yeni portföy yükledi."
    ];
    addFeedLog(logs[Math.floor(Math.random() * logs.length)]);
  }
  
  // Try to generate new lead based on scraping multiplier
  let multiplier = 1.0;
  state.ownedUpgrades.forEach(upId => {
    const up = SHOP_ITEMS.find(s => s.id === upId);
    if (up) multiplier *= up.multiplier;
  });
  
  // Base lead generation probability
  const activeLeads = state.leads.filter(l => l.status !== "COMPLETED").length;
  if (activeLeads < 6 && Math.random() < (0.015 * multiplier)) {
    generateNewLead();
  }
  
  // Progress active lead conversations
  const negotiatorSpeed = AGENT_MODELS[state.agents.negotiator.model].speedBoost;
  const ticksNeeded = Math.max(3, Math.floor(8 / negotiatorSpeed));
  
  state.leads.forEach(lead => {
    if (lead.status === "CHATTING") {
      lead.tickCounter = (lead.tickCounter || 0) + 1;
      
      // Progress chat message based on negotiator speed
      if (lead.tickCounter >= ticksNeeded) {
        lead.tickCounter = 0;
        const template = DIALOG_TEMPLATES[lead.dialogKey];
        const nextStep = lead.currentStep + 1;
        
        if (nextStep < template.messages.length) {
          lead.currentStep = nextStep;
          lead.history.push(template.messages[nextStep]);
          
          const isLastMessage = nextStep === template.messages.length - 1;
          if (isLastMessage) {
            lead.status = "QUALIFIED";
            addFeedLog(`Müşteri ${lead.name} ile görüşme tamamlandı. Bütçe doğrulandı ve yönlendirme için hazır!`, "success");
          } else {
            addFeedLog(`${lead.name} ile AI sohbeti ilerliyor: "${template.messages[nextStep].text.substring(0, 30)}..."`);
          }
          
          saveState();
          renderCrm();
          if (selectedLeadId === lead.id) {
            renderActiveChat();
          }
          updateFunnelDisplay();
        }
      }
    }
  });
}

// 11. Reset Functionality
document.getElementById("btn-reset-data").addEventListener("click", async () => {
  if (confirm("Tüm oyun verilerinizi sıfırlamak istediğinize emin misiniz? Tüm birikimleriniz ve yükseltmeleriniz silinecektir.")) {
    if (backendActive) {
      try {
        const res = await fetch(`${API_BASE}/api/state/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const updatedState = await res.json();
          Object.assign(state, updatedState);
          selectedLeadId = null;
          await fetchStateAndLeads();
          addFeedLog("Tüm sistem verileri yerel veri tabanında sıfırlandı.", "warning");
          updateTopNavbar();
          renderProperties();
          renderShop();
          renderAgents();
          renderPortfolio();
          renderCrm();
          renderActiveChat();
          updateFunnelDisplay();
          renderFeedLogs();
        }
      } catch (e) {
        console.error("Reset state error", e);
      }
    } else {
      localStorage.removeItem("ares_state");
      state = {
        networth: 500,
        passiveIncome: 0,
        lifestyleIndex: 1.0,
        ownedUpgrades: [],
        leads: [],
        dealsClosed: 0,
        feedLogs: [],
        lastTick: Date.now(),
        agents: {
          scraper: { targetRegion: 'all', model: 'mini' },
          negotiator: { model: 'mini' },
          closer: { model: 'mini' }
        },
        prompts: {
          "german-expat": "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?",
          "uk-retiree": "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?",
          "crypto-whale": "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var.",
          "scand-dev": "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?"
        },
        cryptoUSDT: 0
      };
      selectedLeadId = null;
      
      saveState();
      addFeedLog("Tüm sistem verileri sıfırlandı ve simülasyon baştan başlatıldı.", "warning");
      
      updateTopNavbar();
      renderProperties();
      renderShop();
      renderAgents();
      renderPortfolio();
      renderCrm();
      renderActiveChat();
      updateFunnelDisplay();
    }
  }
});

// 12. Initialization
async function init() {
  await checkBackend();
  if (backendActive) {
    await fetchStateAndLeads();
  } else {
    loadState();
  }
  state.lastTick = Date.now(); // Reset time diff on load
  
  // Initial Feed Logs if empty
  if (state.feedLogs.length === 0) {
    addFeedLog("ARES AI Lead-Gen Ağı başlatıldı. Tarayıcı botlar aktif hale getirildi.");
    addFeedLog("Girne merkezli Co-Brokerage sözleşmeleri onaylandı.", "success");
  }
  
  updateTopNavbar();
  renderProperties();
  renderShop();
  renderAgents();
  renderPortfolio();
  initOtcSwapEvents();
  renderCrm();
  renderActiveChat();
  renderFeedLogs();
  updateFunnelDisplay();
  
  // Start Game Loop Interval
  setInterval(processSimulationTicks, 1000);
}

// 13. Render Agents View
function renderAgents() {
  const container = document.getElementById("agents-container");
  if (!container) return;
  container.innerHTML = "";
  
  const agentsConfig = [
    {
      id: "scraper",
      title: "ARES Kazıyıcı Ajan (Scraper)",
      desc: "Dijital mecraları (Reddit, LinkedIn, Telegram) tarayarak yatırımcı sinyalleri yakalar.",
      model: state.agents.scraper.model,
      icon: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>`,
      extraHtml: `
        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 9px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Hedef Pazar Bölgesi</label>
          <select id="select-scraper-region" style="background: var(--bg-sidebar); border: 1px solid var(--border-color); color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-family: var(--font-sans); outline: none; width: 100%; cursor: pointer;">
            <option value="all" ${state.agents.scraper.targetRegion === 'all' ? 'selected' : ''}>Tüm Bölgeler (Karma)</option>
            <option value="uk" ${state.agents.scraper.targetRegion === 'uk' ? 'selected' : ''}>Birleşik Krallık (Emekli & Bungalov)</option>
            <option value="germany" ${state.agents.scraper.targetRegion === 'germany' ? 'selected' : ''}>Almanya (Vergi Expatı & Villa)</option>
            <option value="russia" ${state.agents.scraper.targetRegion === 'russia' ? 'selected' : ''}>Rusya (Kripto Balinası & Malikane)</option>
            <option value="scand" ${state.agents.scraper.targetRegion === 'scand' ? 'selected' : ''}>İskandinavya (Uzak Çalışan & Havuzlu)</option>
          </select>
        </div>
      `
    },
    {
      id: "negotiator",
      title: "ARES Müzakereci Ajan (Negotiator)",
      desc: "Aday müşterilerle otomatik ilk teması kurar, Kıbrıs'ın avantajlarını anlatarak bütçelerini doğrular.",
      model: state.agents.negotiator.model,
      icon: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
      extraHtml: ""
    },
    {
      id: "closer",
      title: "ARES Kapatıcı Ajan (Closer)",
      desc: "Kalifiye olan alıcıları Kıbrıs'taki doğru emlak acentesiyle eşleştirir, komisyon sözleşmelerini garantiler.",
      model: state.agents.closer.model,
      icon: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
      extraHtml: ""
    }
  ];
  
  agentsConfig.forEach(agent => {
    const curModelInfo = AGENT_MODELS[agent.model];
    const nextModelId = curModelInfo.next;
    const nextModelInfo = nextModelId ? AGENT_MODELS[nextModelId] : null;
    
    const card = document.createElement("div");
    const canAfford = nextModelInfo ? state.networth >= nextModelInfo.cost : false;
    
    card.className = `glass-card shop-card ${nextModelInfo && canAfford ? 'unlocked' : ''}`;
    
    card.innerHTML = `
      <div>
        <div class="shop-icon-box" style="color: var(--primary); border-color: var(--border-color);">
          ${agent.icon}
        </div>
        <h3 class="shop-title">${agent.title}</h3>
        <p class="shop-desc">${agent.desc}</p>
        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; line-height: 1.6;">
          Aktif Model: <strong style="color: #fff;">${curModelInfo.name}</strong><br>
          Hız Katsayısı: <strong style="color: var(--primary);">${curModelInfo.speedBoost.toFixed(1)}x</strong><br>
          Kalifikasyon Katsayısı: <strong style="color: var(--success);">${curModelInfo.qualityBoost.toFixed(1)}x</strong>
        </p>
        ${agent.extraHtml}
      </div>
      <div class="shop-footer" style="margin-top: 16px;">
        <span class="shop-cost">${nextModelInfo ? formatMoney(nextModelInfo.cost) : 'MAKSİMUM'}</span>
        <button class="btn-buy" id="btn-upgrade-agent-${agent.id}" ${nextModelInfo && canAfford ? '' : 'disabled'}>
          ${nextModelInfo ? `Model Yükselt (${nextModelInfo.name.split(' ')[0]})` : 'Zirve Seviye'}
        </button>
      </div>
    `;
    container.appendChild(card);
    
    // Wire up events
    if (agent.id === "scraper") {
      const select = document.getElementById("select-scraper-region");
      if (select) {
        select.addEventListener("change", async (e) => {
          const region = e.target.value;
          if (backendActive) {
            try {
              const res = await fetch(`${API_BASE}/api/agents/region`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region })
              });
              if (res.ok) {
                const updatedState = await res.json();
                Object.assign(state, updatedState);
                updateFunnelDisplay();
                renderFeedLogs();
              }
            } catch (e) {
              console.error("Region update error", e);
            }
          } else {
            state.agents.scraper.targetRegion = region;
            saveState();
            addFeedLog(`Hedef pazar bölgesi değiştirildi: ${e.target.options[e.target.selectedIndex].text}`, "warning");
          }
        });
      }
    }
    
    if (nextModelInfo) {
      document.getElementById(`btn-upgrade-agent-${agent.id}`).addEventListener("click", async () => {
        if (state.networth >= nextModelInfo.cost) {
          if (backendActive) {
            try {
              const res = await fetch(`${API_BASE}/api/agents/upgrade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  agentId: agent.id,
                  nextModelId: nextModelId,
                  cost: nextModelInfo.cost
                })
              });
              if (res.ok) {
                const updatedState = await res.json();
                Object.assign(state, updatedState);
                updateTopNavbar();
                renderAgents();
                updateFunnelDisplay();
                renderFeedLogs();
              } else {
                const err = await res.json();
                alert(`Hata: ${err.error}`);
              }
            } catch (e) {
              console.error("Agent upgrade error", e);
            }
          } else {
            state.networth -= nextModelInfo.cost;
            state.agents[agent.id].model = nextModelId;
            
            addFeedLog(`AI Ajanı modeli yükseltildi: ${agent.title} -> ${nextModelInfo.name}`, "success");
            
            saveState();
            updateTopNavbar();
            renderAgents();
            updateFunnelDisplay();
          }
        }
      });
    }
  });
  
  // Refresh Prompt Editor UI
  renderPromptEditor();
}

// 14. Render Prompt Editor View
let selectedPromptKey = "german-expat";

function renderPromptEditor() {
  const listContainer = document.getElementById("prompt-templates-list");
  const activeTitle = document.getElementById("active-template-title");
  const textarea = document.getElementById("prompt-editor-textarea");
  const saveBtn = document.getElementById("btn-save-prompt");
  const statusSpan = document.getElementById("prompt-save-status");
  
  if (!listContainer || !textarea) return;
  
  if (document.activeElement === textarea) {
    // User is editing, don't overwrite the contents of the textarea to prevent losing focus/cursor
    return;
  }
  
  listContainer.innerHTML = "";
  
  const templateConfig = [
    { key: "german-expat", label: "Almanya (Dieter S.)" },
    { key: "uk-retiree", label: "Birleşik Krallık (Margaret E.)" },
    { key: "crypto-whale", label: "Rusya (Dmitry I.)" },
    { key: "scand-dev", label: "İsveç (Erik L.)" }
  ];
  
  templateConfig.forEach(cfg => {
    const btn = document.createElement("button");
    btn.className = `btn-buy`;
    btn.style.width = "100%";
    btn.style.textAlign = "left";
    btn.style.padding = "8px 10px";
    btn.style.fontSize = "11px";
    btn.style.border = "1px solid var(--border-color)";
    btn.style.borderRadius = "4px";
    btn.style.background = cfg.key === selectedPromptKey ? "var(--bg-card-hover)" : "rgba(0,0,0,0.15)";
    btn.style.color = cfg.key === selectedPromptKey ? "var(--accent)" : "var(--text-secondary)";
    btn.style.borderColor = cfg.key === selectedPromptKey ? "var(--accent)" : "var(--border-color)";
    btn.style.cursor = "pointer";
    btn.style.transition = "var(--transition-smooth)";
    btn.textContent = cfg.label;
    
    btn.addEventListener("click", () => {
      selectedPromptKey = cfg.key;
      renderPromptEditor();
    });
    
    listContainer.appendChild(btn);
  });
  
  // Set active prompt content
  const activeLabel = templateConfig.find(t => t.key === selectedPromptKey).label;
  activeTitle.textContent = `${activeLabel} - Ajan İlk Mesajı`;
  textarea.value = state.prompts[selectedPromptKey];
  
  // Wire save button once
  saveBtn.onclick = null; // Clear old click handler
  saveBtn.onclick = async () => {
    const templateText = textarea.value;
    if (backendActive) {
      try {
        const res = await fetch(`${API_BASE}/api/prompts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: selectedPromptKey,
            template: templateText
          })
        });
        if (res.ok) {
          state.prompts[selectedPromptKey] = templateText;
          statusSpan.style.opacity = "1";
          setTimeout(() => {
            statusSpan.style.opacity = "0";
          }, 2000);
          addFeedLog(`Müşteri iletişim şablonu güncellendi: ${activeLabel}`, "success");
          renderFeedLogs();
        }
      } catch (e) {
        console.error("Save prompt error", e);
      }
    } else {
      state.prompts[selectedPromptKey] = templateText;
      saveState();
      
      statusSpan.style.opacity = "1";
      setTimeout(() => {
        statusSpan.style.opacity = "0";
      }, 2000);
      
      addFeedLog(`Müşteri iletişim şablonu güncellendi: ${activeLabel}`, "success");
    }
  };
}

// 15. Render Portfolio
function renderPortfolio() {
  const cashEl = document.getElementById("portfolio-cash");
  const cryptoEl = document.getElementById("portfolio-crypto");
  const realestateEl = document.getElementById("portfolio-realestate");
  
  if (!cashEl || !cryptoEl || !realestateEl) return;
  
  cashEl.textContent = formatMoney(state.networth);
  cryptoEl.textContent = `${state.cryptoUSDT.toFixed(2)} USDT`;
  
  // Calculate real estate assets value based on owned upgrades in category Housing
  let realEstateVal = 0;
  state.ownedUpgrades.forEach(upId => {
    const item = SHOP_ITEMS.find(s => s.id === upId);
    if (item && item.category === "Housing") {
      realEstateVal += item.cost;
    }
  });
  
  realestateEl.textContent = formatMoney(realEstateVal);
}

// 16. OTC Swap Mechanics
function updateOtcSwapOutput() {
  const gbpInput = document.getElementById("swap-input-gbp");
  const usdtOutput = document.getElementById("swap-output-usdt");
  if (!gbpInput || !usdtOutput) return;
  
  const gbpVal = parseFloat(gbpInput.value) || 0;
  if (gbpVal > 0) {
    usdtOutput.value = `${(gbpVal * otcExchangeRate).toFixed(2)} USDT`;
  } else {
    usdtOutput.value = "";
  }
}

function initOtcSwapEvents() {
  const gbpInput = document.getElementById("swap-input-gbp");
  const executeBtn = document.getElementById("btn-execute-swap");
  
  if (!gbpInput || !executeBtn) return;
  
  // Listen to input typing
  gbpInput.oninput = updateOtcSwapOutput;
  
  // Executing swap
  executeBtn.onclick = async () => {
    const gbpVal = parseFloat(gbpInput.value) || 0;
    if (gbpVal <= 0) {
      alert("Lütfen geçerli bir dönüştürme miktarı giriniz.");
      return;
    }
    
    if (state.networth < gbpVal) {
      alert("Dönüştürme işlemi için nakit bakiyeniz yetersiz.");
      return;
    }
    
    if (backendActive) {
      try {
        const res = await fetch(`${API_BASE}/api/state/swap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountGbp: gbpVal })
        });
        if (res.ok) {
          const updatedState = await res.json();
          Object.assign(state, updatedState);
          addFeedLog(`OTC SWAP BAŞARILI: ${formatMoney(gbpVal)} satılarak ${(gbpVal * otcExchangeRate).toFixed(2)} USDT alındı.`, "success");
          updateTopNavbar();
          renderPortfolio();
          gbpInput.value = "";
          updateOtcSwapOutput();
          renderFeedLogs();
        } else {
          const err = await res.json();
          alert(`Hata: ${err.error}`);
        }
      } catch (e) {
        console.error("OTC Swap error", e);
      }
    } else {
      // Process swap
      state.networth -= gbpVal;
      const receivedUSDT = gbpVal * otcExchangeRate;
      state.cryptoUSDT += receivedUSDT;
      
      addFeedLog(`OTC SWAP BAŞARILI: ${formatMoney(gbpVal)} satılarak ${receivedUSDT.toFixed(2)} USDT alındı.`, "success");
      
      saveState();
      updateTopNavbar();
      renderPortfolio();
      
      // Clear inputs
      gbpInput.value = "";
      updateOtcSwapOutput();
    }
  };
}

// Run init on load
window.onload = init;
