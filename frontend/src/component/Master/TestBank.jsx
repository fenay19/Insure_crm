import React, { useState, useEffect } from "react";
import axiosInstance from "api/api";

const TestBank = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get('/bank-details');
        setBankDetails(response.data);
      } catch (error) {
        console.error("Error fetching bank details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Bank Details</h2>
      <pre>{JSON.stringify(bankDetails, null, 2)}</pre>
    </div>
  );
};

export default TestBank;