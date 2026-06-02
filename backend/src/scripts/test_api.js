/**
 * Script to test what the Dashboard endpoint returns via HTTP
 */
const axios = require("axios");

async function testEndpoint() {
  try {
    // 695f6d5ccfc697ea2e1f97fe is the FY 2024-2025
    const res = await axios.get("http://localhost:5050/api/policyDetail", {
      params: {
        financialYear: "695f6d5ccfc697ea2e1f97fe"
      }
    });
    
    const policies = res.data.data;
    console.log(`Endpoint returned ${policies.length} records in this FY.`);
    
    let janCount = 0;
    policies.forEach(item => {
      const validDate = item.startDate || item.tpStartDate || item.odStartDate;
      if (!validDate) return;
      const date = new Date(validDate);
      if (date.getMonth() === 0) {
        janCount++;
      }
    });
    
    console.log(`Dashboard would count ${janCount} for January.`);
  } catch (err) {
    if (err.response) {
      console.error(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
    } else {
      console.error("Error calling endpoint:", err.message);
    }
  }
}

testEndpoint();
