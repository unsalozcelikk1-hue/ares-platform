const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Promise-wrapped queries for async/await support
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize schema and seed defaults
function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // 1. State Table
        db.run(`
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
        `);

        // 2. Leads Table
        db.run(`
          CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT,
            origin TEXT,
            region TEXT,
            budget REAL,
            propertyId TEXT,
            avatarColor TEXT,
            status TEXT,
            history TEXT, -- JSON string array of messages
            dialogKey TEXT,
            currentStep INTEGER DEFAULT 0,
            tickCounter INTEGER DEFAULT 0,
            timestamp INTEGER
          )
        `);

        // 3. Prompts Table
        db.run(`
          CREATE TABLE IF NOT EXISTS prompts (
            key TEXT PRIMARY KEY,
            template TEXT
          )
        `);

        // Seed State if empty
        db.get("SELECT COUNT(*) as count FROM state", (err, row) => {
          if (row && row.count === 0) {
            db.run(`
              INSERT INTO state (id, networth, passiveIncome, lifestyleIndex, ownedUpgrades, dealsClosed, feedLogs, agents, cryptoUSDT)
              VALUES (1, 500.0, 0.0, 1.0, '[]', 0, '[]', '{"scraper":{"targetRegion":"all","model":"mini"},"negotiator":{"model":"mini"},"closer":{"model":"mini"}}', 0.0)
            `);
          }
        });

        // Seed Prompts if empty
        db.get("SELECT COUNT(*) as count FROM prompts", (err, row) => {
          if (row && row.count === 0) {
            const defaultPrompts = [
              ["german-expat", "Merhaba {name} Bey, Kuzey Kıbrıs emlak piyasasına gösterdiğiniz ilgi için teşekkürler. Almanya'daki vergi yükünüzü azaltacak ve Sterlin bazlı %9+ getiri sağlayacak {property} projemizi incelediniz mi?"],
              ["uk-retiree", "Hello {name}, ARES AI network detected your interest in warm Mediterranean properties. Are you looking for a quiet retirement home or an investment?"],
              ["crypto-whale", "Dmitry Bey selamlar. Kıbrıs Bellapais bölgesindeki tarihi malikane portföyümüz için ulaştım. Alımı kripto para (USDT/BTC) ile gerçekleştirmek istediğinizi belirten algoritma eşleşmemiz var."],
              ["scand-dev", "Hej {name}! North Cyprus property is booming for remote developers due to low living costs and zero remote-work income tax. Have you checked out our {property} listing?"]
            ];
            
            const stmt = db.prepare("INSERT INTO prompts (key, template) VALUES (?, ?)");
            defaultPrompts.forEach(p => stmt.run(p));
            stmt.finalize(() => {
              console.log("SQLite database schema initialized and seeded.");
              resolve();
            });
          } else {
            console.log("SQLite database schema loaded.");
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  db,
  query,
  run,
  get,
  initDb
};
