const calculateInvoiceTotals = (products, invoiceCategory, taxType = '') => {
  let subTotal = 0;
  let totalGstAmount = 0;

  const updatedProducts = products.map((product) => {
    const { quantity, rate, gstPercentage = 0 } = product;
    const qty = parseFloat(quantity) || 0;
    const rt = parseFloat(rate) || 0;
    const gst = invoiceCategory === 'gst' ? parseFloat(gstPercentage) || 0 : 0;

    const baseAmount = qty * rt;
    const gstAmount = invoiceCategory === 'gst' ? (baseAmount * gst) / 100 : 0;
    const productAmount = baseAmount + gstAmount;

    subTotal += baseAmount;
    totalGstAmount += gstAmount;

    return {
      ...product,
      productAmount: productAmount.toFixed(2),
      gstPercentage: invoiceCategory === 'gst' ? gst : undefined
    };
  });

  return {
    updatedProducts,
    subTotal: subTotal.toFixed(2),
    totalGstAmount: totalGstAmount.toFixed(2)
  };
};

module.exports = { calculateInvoiceTotals };
// This function calculates the totals for an invoice based on the products, invoice category, and tax type.
// It returns an object containing the updated products with their amounts and the subtotal and total GST amount.
// It handles both GST and non-GST invoices, applying the appropriate calculations based on the invoice category.
// The products are expected to have quantity, rate, and optionally gstPercentage fields.
// The function ensures that the amounts are formatted to two decimal places for consistency in financial calculations.
//   discountAmount: { type: Number, default: 0 },