// Check what the 45 billed policies look like - do they have startDate?
require('dotenv').config();
const mongoose = require('mongoose');
const PolicyDetails = require('./src/models/PolicyManagement/PolicyDetails.model');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DB_URL || process.env.DATABASE_URL;
mongoose.connect(mongoUri).then(async () => {
  console.log('Connected.\n');

  // All billed policies
  const billed = await PolicyDetails.find({ billingStatus: 'billed' }).lean();
  console.log(`Total billed: ${billed.length}`);
  console.log('\n--- Billed policies detail ---');
  billed.forEach((p, i) => {
    console.log(`${i+1}. policyNumber=${p.policyNumber} | startDate=${p.startDate} | billedAt=${p.billedAt} | companyId=${p.companyId}`);
  });

  // Check policies with null startDate and their billing status
  const nullStartBilled = await PolicyDetails.countDocuments({ startDate: null, billingStatus: 'billed' });
  const nullStartUnbilled = await PolicyDetails.countDocuments({ startDate: null, billingStatus: { $ne: 'billed' } });
  console.log(`\nPolicies with null startDate:`);
  console.log(`  billed: ${nullStartBilled}`);
  console.log(`  unbilled: ${nullStartUnbilled}`);

  await mongoose.disconnect();
}).catch(err => { console.error(err.message); process.exit(1); });
