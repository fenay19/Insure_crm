/**
 * Check if the dashboard's getMonth() logic is combining different years
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.db_url);
  const db = mongoose.connection.db;
  const col = db.collection("policydetails");

  // target FY: 695f6d5ccfc697ea2e1f97fe
  const targetFyId = new mongoose.Types.ObjectId("695f6d5ccfc697ea2e1f97fe");
  
  const allPolicies = await col.find({ financialYear: targetFyId }).toArray();
  
  let jan2024 = 0;
  let jan2025 = 0;
  let janOther = 0;
  
  allPolicies.forEach(p => {
    const validDate = p.startDate || p.tpStartDate || p.odStartDate;
    if (!validDate) return;
    const date = new Date(validDate);
    
    // Simulate IST local time conversion as done by JS getMonth()
    // It's actually not needed here because the numbers were huge enough to see
    // But let's just do it correctly to match Dashboard
    if (date.getMonth() === 0) { // January
      if (date.getFullYear() === 2024) jan2024++;
      else if (date.getFullYear() === 2025) jan2025++;
      else janOther++;
    }
  });

  console.log(`=== January breakdown for FY 695f6d5ccfc697ea2e1f97fe ===`);
  console.log(`Jan 2024 counts: ${jan2024}`);
  console.log(`Jan 2025 counts: ${jan2025}`);
  console.log(`Jan Other counts: ${janOther}`);
  console.log(`Total Jan (Dashboard Bar Chart count): ${jan2024 + jan2025 + janOther}`);
  
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
