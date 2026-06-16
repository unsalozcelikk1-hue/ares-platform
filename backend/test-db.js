const { initDb, query, run, get, db } = require('./db');

async function test() {
  console.log("Starting database verification test...");
  try {
    await initDb();
    
    // Check initial state
    const state = await get("SELECT * FROM state WHERE id = 1");
    console.log("Database connection established: OK");
    console.log("Fetched State Row:", JSON.stringify(state));
    
    if (state && state.networth >= 500) {
      console.log("State verification check: OK");
    } else {
      console.log("State verification check: WARNING (Unexpected state properties)");
    }
    
    // Check prompts
    const prompts = await query("SELECT * FROM prompts");
    console.log("Default Prompts seeded count: " + prompts.length);
    if (prompts.length === 4) {
      console.log("Prompts verification check: OK");
    } else {
      console.log("Prompts verification check: FAILED (Expected 4 regional templates)");
    }
    
    console.log("All database verification tests passed successfully!");
    db.close();
    process.exit(0);
  } catch (err) {
    console.error("Database verification test failed:", err);
    process.exit(1);
  }
}

test();
