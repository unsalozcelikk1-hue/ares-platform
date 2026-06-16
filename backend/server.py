import os
import json
import time
import sqlite3
import random
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

# Configurations
PORT = 5050
backend_dir = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(backend_dir, 'database.sqlite')

PROPERTIES = [
  { "id": "prop-esentepe-villa", "price": 550000, "commissionRate": 0.08 },
  { "id": "prop-iskele-penthouse", "price": 240000, "commissionRate": 0.07 },
  { "id": "prop-bellapais-mansion", "price": 1200000, "commissionRate": 0.06 },
  { "id": "prop-alsancak-bungalow", "price": 185000, "commissionRate": 0.06 }
]

AGENT_MODELS = {
  "mini": { "name": "GPT-4o Mini", "speedBoost": 1.0, "qualityBoost": 1.0 },
  "standard": { "name": "Claude 3.5 Sonnet", "speedBoost": 1.6, "qualityBoost": 1.3 },
  "pro": { "name": "o1 Pro (Reasoning)", "speedBoost": 2.8, "qualityBoost": 1.8 }
}

DIALOG_TEMPLATES = {
  "german-expat": {
    "name": "Dieter Schmidt",
    "origin": "Almanya (Stuttgart)",
    "region": "germany",
    "budget": 450000,
    "propertyId": "prop-esentepe-villa",
    "avatarColor": "#4facfe",
    "messages": [
      { "sender": "agent", "text": "Merhaba Dieter Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak Esentepe projemizi incelediniz mi?" },
      { "sender": "client", "text": "Merhaba. Evet, Almanya'da vergiler çok yüksek. Kıbrıs'ın emlak alımında %0 Capital Gains (Sermaye Kazancı Vergisi) sunduğunu duydum, bu doğru mu? Bir de oturum izni süreci nasıl işliyor?" },
      { "sender": "agent", "text": "Kesinlikle doğru Dieter Bey. Kuzey Kıbrıs'ta gayrimenkul yatırımı yaptığınızda sermaye kazancı vergisi sıfırdır. Ayrıca £125.000 üzeri mülk alımlarında adada hızlı oturum izni hakkı kazanırsınız. Esentepe villamız tam size göre." },
      { "sender": "client", "text": "Harika! Bütçem £450.000 civarında. Villanın konumu çok güzel duruyor. Beni Kıbrıs'taki satış ekibiyle eşleştirebilir misiniz? Gelecek hafta Girne'ye bir inceleme gezisi (inspection trip) yapabilirim." }
    ]
  },
  "uk-retiree": {
    "name": "Margaret Evans",
    "origin": "İngiltere (Manchester)",
    "region": "uk",
    "budget": 200000,
    "propertyId": "prop-iskele-penthouse",
    "avatarColor": "#fda085",
    "messages": [
      { "sender": "agent", "text": "Hello Margaret, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?" },
      { "sender": "client", "text": "Hello dear. I am looking for a warm place to retire, away from the rainy Manchester weather. But I want something near the beach with easy access to shops. Is Iskele safe?" },
      { "sender": "agent", "text": "North Cyprus is ranked among the safest small nations globally, Margaret. The Iskele Long Beach area is flat, beautifully pedestrianized, and contains supermarkets, clinics, and sandy beaches within walking distance." },
      { "sender": "client", "text": "That sounds lovely. My budget is around £150,000 to £200,000. The Penthouse looks spectacular and the rental yields could fund my pension. Please forward my details to the developer to reserve a unit." }
    ]
  },
  "crypto-whale": {
    "name": "Dmitry Ivanov",
    "origin": "Rusya (Moskova)",
    "region": "russia",
    "budget": 1200000,
    "propertyId": "prop-bellapais-mansion",
    "avatarColor": "#10b981",
    "messages": [
      { "sender": "agent", "text": "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var." },
      { "sender": "client", "text": "Selam. Evet, Moskova'dan sermaye transferi zor olduğu için ödemeyi tamamen USDT üzerinden yapmak istiyorum. Kıbrıs'taki inşaat firmaları bunu kabul ediyor mu ve yasal süreç nasıl?" },
      { "sender": "agent", "text": "Evet Dmitry Bey, Kıbrıs'ta neredeyse tüm büyük inşaat firmaları ve avukatlar USDT ödemelerini kabul ediyor. Sözleşme avukat gözetiminde kripto cüzdan transferiyle resmileştiriliyor. Bellapais malikanesi için bunu yapabiliriz." },
      { "sender": "client", "text": "Çok iyi. Bütçe sorun değil, malikane için £1.2M ödemeye hazırım. Hemen işlemleri başlatacak emlak avukatını ve geliştiriciyi ayarlayın, cüzdan hazır." }
    ]
  },
  "scand-dev": {
    "name": "Erik Larsson",
    "origin": "İsveç (Stockholm)",
    "region": "scand",
    "budget": 190000,
    "propertyId": "prop-alsancak-bungalow",
    "avatarColor": "#a78bfa",
    "messages": [
      { "sender": "agent", "text": "Hej Erik! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our Alsancak bungalow listing?" },
      { "sender": "client", "text": "Hej. Yes, I'm working remotely as a Tech Lead. I want a house surrounded by nature but with fast fiber internet. Alsancak seems to have good mountain views." },
      { "sender": "agent", "text": "Exactly, Alsancak has excellent infrastructure, English schools, supermarkets, and fiber optic connection up to 100 Mbps. It provides the perfect work-from-paradise environment." },
      { "sender": "client", "text": "Perfect. I want to schedule a virtual tour of the bungalow. If the internet speeds are verified, I can sign the contract online. Please connect me with the broker immediately." }
    ]
  }
}

# State Cache and Lock
cached_state = None
otc_exchange_rate = 1.255
state_lock = threading.Lock()

# Ollama local LLM and Cloud LLM configurations
import os

ARES_LLM_API_KEY = os.environ.get("ARES_LLM_API_KEY")
ARES_LLM_PROVIDER = os.environ.get("ARES_LLM_PROVIDER", "deepseek").lower()
ARES_LLM_MODEL = os.environ.get("ARES_LLM_MODEL")

OLLAMA_BASE_URL = "http://localhost:11434"
active_ollama_model = None

import urllib.request
import urllib.error

def detect_ollama_model():
    global active_ollama_model
    try:
        req = urllib.request.Request(f"{OLLAMA_BASE_URL}/api/tags")
        with urllib.request.urlopen(req, timeout=1.5) as response:
            data = json.loads(response.read().decode('utf-8'))
            models = data.get("models", [])
            if models:
                active_ollama_model = models[0]["name"]
                return active_ollama_model
    except Exception:
        pass
    active_ollama_model = None
    return None

def call_llm_chat(messages):
    global ARES_LLM_API_KEY, ARES_LLM_PROVIDER, ARES_LLM_MODEL
    
    # 1. Route to Cloud LLM API if key is set
    if ARES_LLM_API_KEY:
        url = ""
        model_name = ARES_LLM_MODEL
        
        if ARES_LLM_PROVIDER == "deepseek":
            url = "https://api.deepseek.com/v1/chat/completions"
            if not model_name: model_name = "deepseek-chat"
        elif ARES_LLM_PROVIDER == "groq":
            url = "https://api.groq.com/openai/v1/chat/completions"
            if not model_name: model_name = "llama3-8b-8192"
        elif ARES_LLM_PROVIDER == "openrouter":
            url = "https://openrouter.ai/api/v1/chat/completions"
            if not model_name: model_name = "meta-llama/llama-3-8b-instruct"
        elif ARES_LLM_PROVIDER == "openai":
            url = "https://api.openai.com/v1/chat/completions"
            if not model_name: model_name = "gpt-4o-mini"
        else:
            url = ARES_LLM_PROVIDER  # Treat custom value as endpoint URL
            if not model_name: model_name = "deepseek-chat"
            
        payload = {
            "model": model_name,
            "messages": messages,
            "stream": False
        }
        
        try:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                url,
                data=data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {ARES_LLM_API_KEY}"
                }
            )
            with urllib.request.urlopen(req, timeout=10.0) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                choices = res_data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "")
        except Exception as e:
            print(f"[Cloud LLM API Call Error] provider={ARES_LLM_PROVIDER}: {e}")
            
    # 2. Fall back to local Ollama if online
    ollama_model = detect_ollama_model()
    if ollama_model:
        url = f"{OLLAMA_BASE_URL}/api/chat"
        payload = {
            "model": ollama_model,
            "messages": messages,
            "stream": False
        }
        try:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                url,
                data=data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=8.0) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                return res_data.get("message", {}).get("content", "")
        except Exception as e:
            print(f"[Ollama Call Error]: {e}")
            
    return None

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. State Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            networth REAL DEFAULT 500.0,
            passiveIncome REAL DEFAULT 0.0,
            lifestyleIndex REAL DEFAULT 1.0,
            ownedUpgrades TEXT DEFAULT '[]',
            dealsClosed INTEGER DEFAULT 0,
            feedLogs TEXT DEFAULT '[]',
            agents TEXT DEFAULT '{"scraper":{"targetRegion":"all","model":"mini"},"negotiator":{"model":"mini"},"closer":{"model":"mini"}}',
            cryptoUSDT REAL DEFAULT 0.0
        )
    ''')

    # 2. Leads Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT,
            origin TEXT,
            region TEXT,
            budget REAL,
            propertyId TEXT,
            avatarColor TEXT,
            status TEXT,
            history TEXT,
            dialogKey TEXT,
            currentStep INTEGER DEFAULT 0,
            tickCounter INTEGER DEFAULT 0,
            timestamp REAL
        )
    ''')

    # 3. Prompts Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prompts (
            key TEXT PRIMARY KEY,
            template TEXT
        )
    ''')

    # Seed defaults if empty
    cursor.execute("SELECT COUNT(*) FROM state")
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO state (id, networth, passiveIncome, lifestyleIndex, ownedUpgrades, dealsClosed, feedLogs, agents, cryptoUSDT)
            VALUES (1, 500.0, 0.0, 1.0, '[]', 0, '[]', '{"scraper":{"targetRegion":"all","model":"mini"},"negotiator":{"model":"mini"},"closer":{"model":"mini"}}', 0.0)
        ''')

    cursor.execute("SELECT COUNT(*) FROM prompts")
    if cursor.fetchone()[0] == 0:
        default_prompts = [
            ("german-expat", "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?"),
            ("uk-retiree", "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?"),
            ("crypto-whale", "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var."),
            ("scand-dev", "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?")
        ]
        cursor.executemany("INSERT INTO prompts (key, template) VALUES (?, ?)", default_prompts)
        
    conn.commit()
    conn.close()

def load_state():
    global cached_state
    with state_lock:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM state WHERE id = 1")
        row = cursor.fetchone()
        if row:
            cached_state = {
                "networth": row["networth"],
                "passiveIncome": row["passiveIncome"],
                "lifestyleIndex": row["lifestyleIndex"],
                "ownedUpgrades": json.loads(row["ownedUpgrades"]),
                "dealsClosed": row["dealsClosed"],
                "feedLogs": json.loads(row["feedLogs"]),
                "agents": json.loads(row["agents"]),
                "cryptoUSDT": row["cryptoUSDT"]
            }
        conn.close()

def save_state():
    global cached_state
    if not cached_state:
        return
    with state_lock:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE state
            SET networth = ?, passiveIncome = ?, lifestyleIndex = ?, ownedUpgrades = ?, dealsClosed = ?, feedLogs = ?, agents = ?, cryptoUSDT = ?
            WHERE id = 1
        ''', (
            cached_state["networth"],
            cached_state["passiveIncome"],
            cached_state["lifestyleIndex"],
            json.dumps(cached_state["ownedUpgrades"]),
            cached_state["dealsClosed"],
            json.dumps(cached_state["feedLogs"]),
            json.dumps(cached_state["agents"]),
            cached_state["cryptoUSDT"]
        ))
        conn.commit()
        conn.close()

def add_server_log(msg, log_type="normal"):
    global cached_state
    if not cached_state:
        return
    timestamp = time.strftime('%H:%M:%S', time.localtime())
    cached_state["feedLogs"].insert(0, { "timestamp": timestamp, "msg": msg, "type": log_type })
    if len(cached_state["feedLogs"]) > 30:
        cached_state["feedLogs"].pop()

# Request Handler serving API and Static Frontend files
class ARESHTTPRequestHandler(BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        global cached_state, otc_exchange_rate
        
        # API Endpoints
        if self.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            
            response_data = { **cached_state, "otcExchangeRate": otc_exchange_rate }
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            return
            
        elif self.path == '/api/prompts':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM prompts")
            rows = cursor.fetchall()
            conn.close()
            
            prompts = { r[0]: r[1] for r in rows }
            self.wfile.write(json.dumps(prompts).encode('utf-8'))
            return
            
        elif self.path == '/api/leads':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM leads ORDER BY timestamp DESC")
            rows = cursor.fetchall()
            conn.close()
            
            leads = []
            for r in rows:
                leads.append({
                    "id": r["id"],
                    "name": r["name"],
                    "origin": r["origin"],
                    "region": r["region"],
                    "budget": r["budget"],
                    "propertyId": r["propertyId"],
                    "avatarColor": r["avatarColor"],
                    "status": r["status"],
                    "history": json.loads(r["history"]),
                    "dialogKey": r["dialogKey"],
                    "currentStep": r["currentStep"],
                    "tickCounter": r["tickCounter"],
                    "timestamp": r["timestamp"]
                })
            self.wfile.write(json.dumps(leads).encode('utf-8'))
            return

        # Serve Static Frontend Files from parent directory
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        file_path = ""
        content_type = "text/plain"
        
        if self.path == '/' or self.path == '/index.html':
            file_path = os.path.join(parent_dir, 'index.html')
            content_type = 'text/html; charset=utf-8'
        elif self.path == '/style.css':
            file_path = os.path.join(parent_dir, 'style.css')
            content_type = 'text/css'
        elif self.path == '/app.js':
            file_path = os.path.join(parent_dir, 'app.js')
            content_type = 'application/javascript'
            
        if file_path and os.path.exists(file_path):
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    def do_POST(self):
        global cached_state, otc_exchange_rate
        
        content_length_header = self.headers.get('Content-Length')
        content_length = int(content_length_header) if content_length_header is not None else 0
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ""
        body = json.loads(post_data) if post_data else {}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()

        # Reset Database
        if self.path == '/api/state/reset':
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM leads")
            cursor.execute('''
                UPDATE state 
                SET networth = 500, passiveIncome = 0, lifestyleIndex = 1.0, ownedUpgrades = '[]', 
                    dealsClosed = 0, feedLogs = '[]', 
                    agents = '{"scraper":{"targetRegion":"all","model":"mini"},"negotiator":{"model":"mini"},"closer":{"model":"mini"}}', 
                    cryptoUSDT = 0 
                WHERE id = 1
            ''')
            
            cursor.execute("DELETE FROM prompts")
            default_prompts = [
                ("german-expat", "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?"),
                ("uk-retiree", "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?"),
                ("crypto-whale", "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var."),
                ("scand-dev", "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?")
            ]
            cursor.executemany("INSERT INTO prompts (key, template) VALUES (?, ?)", default_prompts)
            conn.commit()
            conn.close()
            
            load_state()
            add_server_log("Tüm sistem verileri yerel veri tabanında sıfırlandı.", "warning")
            save_state()
            
            self.wfile.write(json.dumps({ **cached_state, "otcExchangeRate": otc_exchange_rate }).encode('utf-8'))
            
        # Buy Upgrade
        elif self.path == '/api/state/upgrade':
            upgrade_id = body.get("id")
            cost = body.get("cost")
            passive_boost = body.get("passiveBoost", 0)
            category = body.get("category")
            
            if cached_state["networth"] >= cost and upgrade_id not in cached_state["ownedUpgrades"]:
                cached_state["networth"] -= cost
                cached_state["ownedUpgrades"].append(upgrade_id)
                if passive_boost > 0:
                    cached_state["passiveIncome"] += passive_boost
                
                if category == "Housing":
                    cached_state["lifestyleIndex"] += 2.0;
                elif category == "Equipment":
                    cached_state["lifestyleIndex"] += 0.5;
                else:
                    cached_state["lifestyleIndex"] += 0.3;
                
                add_server_log(f"Altyapı yatırımı satın alındı: {upgrade_id}. Varlık ve altyapı endeksi güncellendi.", "success")
                save_state()
                self.wfile.write(json.dumps(cached_state).encode('utf-8'))
            else:
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Insufficient funds or upgrade owned" }).encode('utf-8'))

        # OTC Swap GBP to USDT
        elif self.path == '/api/state/swap':
            amount_gbp = body.get("amountGbp", 0)
            if amount_gbp <= 0:
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Invalid amount" }).encode('utf-8'))
                return
                
            if cached_state["networth"] >= amount_gbp:
                cached_state["networth"] -= amount_gbp
                received_usdt = amount_gbp * otc_exchange_rate
                cached_state["cryptoUSDT"] += received_usdt
                
                add_server_log(f"OTC Swap İşlemi: £{amount_gbp} satılarak {received_usdt:.2f} USDT alındı.", "success")
                save_state()
                self.wfile.write(json.dumps(cached_state).encode('utf-8'))
            else:
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Insufficient funds" }).encode('utf-8'))

        # Upgrade Agent Model
        elif self.path == '/api/agents/upgrade':
            agent_id = body.get("agentId")
            next_model_id = body.get("nextModelId")
            cost = body.get("cost")
            
            if cached_state["networth"] >= cost:
                cached_state["networth"] -= cost
                cached_state["agents"][agent_id]["model"] = next_model_id
                
                next_name = AGENT_MODELS[next_model_id]["name"]
                add_server_log(f"AI Ajanı modeli yükseltildi: {agent_id} -> {next_name}", "success")
                save_state()
                self.wfile.write(json.dumps(cached_state).encode('utf-8'))
            else:
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Insufficient funds" }).encode('utf-8'))

        # Set Scraper Region
        elif self.path == '/api/agents/region':
            region = body.get("region")
            cached_state["agents"]["scraper"]["targetRegion"] = region
            add_server_log(f"Scraper hedef pazar bölgesi değiştirildi: {region}", "warning")
            save_state()
            self.wfile.write(json.dumps(cached_state).encode('utf-8'))

        # Update Prompt Template
        elif self.path == '/api/prompts':
            key = body.get("key")
            template = body.get("template")
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("INSERT OR REPLACE INTO prompts (key, template) VALUES (?, ?)", (key, template))
            conn.commit()
            conn.close()
            
            add_server_log(f"İletişim şablonu güncellendi: {key}", "success")
            self.wfile.write(json.dumps({ "success": True }).encode('utf-8'))

        # Qualify & Claim Commission
        elif self.path.startswith('/api/leads/') and self.path.endswith('/qualify'):
            lead_id = self.path.split('/')[-2]
            
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
            lead = cursor.fetchone()
            
            if not lead or lead["status"] != "QUALIFIED":
                conn.close()
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Lead not ready" }).encode('utf-8'))
                return
                
            property_id = lead["propertyId"]
            prop = next((p for p in PROPERTIES if p["id"] == property_id), None)
            
            if not prop:
                conn.close()
                self.send_response(400)
                self.wfile.write(json.dumps({ "error": "Property not found" }).encode('utf-8'))
                return
                
            closer_model = cached_state["agents"]["closer"]["model"]
            closer_quality = AGENT_MODELS[closer_model]["qualityBoost"]
            commission = prop["price"] * prop["commissionRate"] * 0.4 * closer_quality
            
            cached_state["networth"] += commission
            cached_state["dealsClosed"] += 1
            
            cursor.execute("UPDATE leads SET status = 'COMPLETED' WHERE id = ?", (lead_id,))
            conn.commit()
            conn.close()
            
            add_server_log(f"HEDEF TAMAMLANDI: {lead['name']} başarıyla yönlendirildi. £{int(commission)} hesaba geçti!", "success")
            save_state()
            
            self.wfile.write(json.dumps({ **cached_state, "commission": commission }).encode('utf-8'))

# Background simulation runner (1s tick)
def start_simulation_loop():
    global cached_state, otc_exchange_rate
    
    save_counter = 0
    while True:
        time.sleep(1.0)
        if not cached_state:
            continue
            
        # 1. Passive Income
        if cached_state["passiveIncome"] > 0:
            cached_state["networth"] += cached_state["passiveIncome"] * 1.0
            
        # 2. Float OTC rate
        otc_exchange_rate += (random.random() - 0.5) * 0.002
        if otc_exchange_rate < 1.240: otc_exchange_rate = 1.240
        if otc_exchange_rate > 1.275: otc_exchange_rate = 1.275
        
        # 3. Random feed log
        if random.random() < 0.05:
            logs = [
              "AI Ajanı LinkedIn aramalarını güncelliyor...",
              "Reddit Cyprus Real Estate konuları taranıyor...",
              "Girne bölgesindeki emlak komisyon sözleşmeleri inceleniyor...",
              "Alman expat forumunda Kıbrıs vergi avantajları tartışılıyor..."
            ]
            add_server_log(random.choice(logs))
            
        # 4. Generate leads based on scraper speed
        upgrades_mult = 1.0
        if "shop-laptop" in cached_state["ownedUpgrades"]: upgrades_mult *= 1.5
        if "shop-penthouse" in cached_state["ownedUpgrades"]: upgrades_mult *= 2.5
        if "shop-agent-pro" in cached_state["ownedUpgrades"]: upgrades_mult *= 3.0
        if "shop-villa-bellapais" in cached_state["ownedUpgrades"]: upgrades_mult *= 5.0
        
        scraper_model = cached_state["agents"]["scraper"]["model"]
        scraper_speed = AGENT_MODELS[scraper_model]["speedBoost"]
        current_mult = upgrades_mult * scraper_speed
        
        # Count active leads
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM leads WHERE status != 'COMPLETED'")
        active_leads_count = cursor.fetchone()[0]
        
        if active_leads_count < 6 and random.random() < (0.015 * current_mult):
            keys = list(DIALOG_TEMPLATES.keys())
            region = cached_state["agents"]["scraper"]["targetRegion"]
            if region != 'all':
                keys = [k for k in keys if DIALOG_TEMPLATES[k]["region"] == region]
                
            if len(keys) > 0:
                random_key = random.choice(keys)
                template = DIALOG_TEMPLATES[random_key]
                
                cursor.execute("SELECT id FROM leads WHERE name = ? AND status != 'COMPLETED'", (template["name"],))
                if not cursor.fetchone():
                    # Fetch customized prompt
                    cursor.execute("SELECT template FROM prompts WHERE key = ?", (random_key,))
                    prompt_row = cursor.fetchone()
                    prompt_template = prompt_row[0] if prompt_row else template["messages"][0]["text"]
                    
                    first_msg = prompt_template.replace("{name}", template["name"]).replace("{property}", "Kıbrıs Emlak Projesi")
                    lead_id = f"lead-{int(time.time() * 1000)}-{random.randint(0,99)}"
                    history_json = json.dumps([{ "sender": "agent", "text": first_msg }])
                    
                    cursor.execute('''
                        INSERT INTO leads (id, name, origin, region, budget, propertyId, avatarColor, status, history, dialogKey, currentStep, tickCounter, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'CHATTING', ?, ?, 0, 0, ?)
                    ''', (lead_id, template["name"], template["origin"], template["region"], template["budget"], template["propertyId"], template["avatarColor"], history_json, random_key, time.time()))
                    conn.commit()
                    
                    add_server_log(f"MÜŞTERİ HEDEFİ BULUNDU: {template['name']} ({template['origin']}) taranarak ağa bağlandı.", "warning")
                    
        # 5. Progress chat logs based on negotiator speed
        negotiator_model = cached_state["agents"]["negotiator"]["model"]
        negotiator_speed = AGENT_MODELS[negotiator_model]["speedBoost"]
        ticks_needed = max(3, int(8 / negotiator_speed))
        
        cursor.execute("SELECT * FROM leads WHERE status = 'CHATTING'")
        active_chats = cursor.fetchall()
        
        for lead in active_chats:
            current_ticks = lead["tickCounter"] + 1
            if current_ticks >= ticks_needed:
                template = DIALOG_TEMPLATES[lead["dialogKey"]]
                next_step = lead["currentStep"] + 1
                history = json.loads(lead["history"])
                
                if next_step < len(template["messages"]):
                    is_last = next_step == len(template["messages"]) - 1
                    status = "QUALIFIED" if is_last else "CHATTING"
                    
                    response_text = None
                    try:
                        if ARES_LLM_API_KEY or detect_ollama_model():
                            property_id = lead["propertyId"]
                            prop_details = next((p for p in PROPERTIES if p["id"] == property_id), None)
                            friendly_names = {
                                "prop-esentepe-villa": "Esentepe Denize Sıfır Villa",
                                "prop-iskele-penthouse": "Long Beach Luxury Penthouse",
                                "prop-bellapais-mansion": "Bellapais Tarihi Malikane",
                                "prop-alsancak-bungalow": "Alsancak Doğa Bungalovu"
                            }
                            property_title = friendly_names.get(property_id, "Kuzey Kıbrıs Gayrimenkulü")
                            property_price = prop_details["price"] if prop_details else 250000
                            
                            if next_step % 2 != 0: # Client's turn to speak
                                system_prompt = (
                                    f"You are roleplaying as {lead['name']}, a property buyer from {lead['origin']} "
                                    f"interested in purchasing {property_title} in North Cyprus (budget: £{int(lead['budget'])}). "
                                    f"Respond to the estate agent's messages. Be brief (1-2 sentences) and speak naturally in your character's persona "
                                    f"(e.g., if you are Dieter Schmidt, you are German; if Dmitry Ivanov, you are Russian and prefer crypto/USDT payment). "
                                    f"Do not write the agent's dialogues or act as the agent."
                                )
                                if is_last:
                                    system_prompt += " This is the final message. You must explicitly agree to the agent's referral to connect you with the builder or lawyer in Cyprus. Say you are ready and accept."
                                else:
                                    system_prompt += " Ask a specific question related to your character's persona (e.g. taxes, safety, residency, or crypto payment)."
                            else: # Agent's turn to speak
                                system_prompt = (
                                    f"You are ARES, a professional real estate qualification agent. "
                                    f"Your goal is to qualify the client {lead['name']} for the property {property_title} (Price: £{property_price}). "
                                    f"Be highly professional and brief (1-2 sentences). Address their concerns "
                                    f"(such as 0% capital gains, yields, safety, residency, or USDT payment). "
                                    f"Propose to refer them to the local developers or estate lawyers in Girne/Cyprus to finalize details. "
                                    f"Do not write the client's dialogue or act as the client."
                                )
                                
                            ollama_messages = [{"role": "system", "content": system_prompt}]
                            for msg in history:
                                if next_step % 2 != 0:
                                    role = "user" if msg["sender"] == "agent" else "assistant"
                                else:
                                    role = "assistant" if msg["sender"] == "agent" else "user"
                                ollama_messages.append({"role": role, "content": msg["text"]})
                                
                            response_text = call_llm_chat(ollama_messages)
                    except Exception as e:
                        print(f"LLM integration error in tick loop: {e}")
                        response_text = None
                        
                    if response_text:
                        response_text = response_text.strip()
                        prefixes = [
                            f"{lead['name']}:", "Agent:", "Client:", "ARES:", "Dieter Schmidt:", 
                            "Margaret Evans:", "Dmitry Ivanov:", "Erik Larsson:"
                        ]
                        for p in prefixes:
                            if response_text.lower().startswith(p.lower()):
                                response_text = response_text[len(p):].strip()
                        if response_text.startswith('"') and response_text.endswith('"'):
                            response_text = response_text[1:-1].strip()
                            
                        history.append({
                            "sender": "client" if next_step % 2 != 0 else "agent",
                            "text": response_text
                        })
                    else:
                        history.append(template["messages"][next_step])
                        
                    cursor.execute('''
                        UPDATE leads 
                        SET currentStep = ?, tickCounter = 0, status = ?, history = ? 
                        WHERE id = ?
                    ''', (next_step, status, json.dumps(history), lead["id"]))
                    conn.commit()
                    
                    if is_last:
                        add_server_log(f"Müşteri {lead['name']} ile görüşme tamamlandı. Bütçe doğrulandı ve yönlendirme için hazır!", "success")
                    else:
                        add_server_log(f"{lead['name']} ile AI sohbeti ilerliyor: \"{history[-1]['text'][:30]}...\"")
            else:
                cursor.execute("UPDATE leads SET tickCounter = ? WHERE id = ?", (current_ticks, lead["id"]))
                conn.commit()
                
        conn.close()
        
        # 6. Periodic save (5 seconds)
        save_counter += 1
        if save_counter >= 5:
            save_counter = 0
            save_state()

def run_server():
    init_db()
    load_state()
    
    # Check LLM availability
    if ARES_LLM_API_KEY:
        model_name = ARES_LLM_MODEL if ARES_LLM_MODEL else ("deepseek-chat" if ARES_LLM_PROVIDER == "deepseek" else "default")
        print(f"ARES Cloud LLM active. Provider: {ARES_LLM_PROVIDER.upper()} (Model: {model_name})")
    else:
        ollama_model = detect_ollama_model()
        if ollama_model:
            print(f"ARES Local LLM active. Provider: OLLAMA (Model: {ollama_model})")
        else:
            print("ARES LLM services offline (Cloud Key not set & Ollama offline). Fallback template dialogues will be used.")
        
    # Start thread
    t = threading.Thread(target=start_simulation_loop)
    t.daemon = True
    t.start()
    
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ARESHTTPRequestHandler)
    print(f"ARES Secure Python Backend running on http://localhost:{PORT}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
