import React from 'react';
import { fmtAmount, numberToWords, BROKER, AmikaHeader } from './invoiceUtils.jsx';

export const MagmaTemplate = ({ inv }) => {
    if (!inv) return null;
    
    const cellStyle = { border: '1px solid #000', padding: '6px 10px', fontSize: '13px' };
    
    // Calculate total amount to words
    const amountInWords = numberToWords(Math.round(inv.grandTotal));

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", color: '#000', maxWidth: 720, margin: '0 auto', fontSize: '13px' }}>
            <AmikaHeader />
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>TAX INVOICE</h2>
            </div>
            
            {/* Invoice Info */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <div style={{ textAlign: 'left', minWidth: '200px' }}>
                    <div>Invoice No: {inv.invoiceNumber}</div>
                    <div>Date: {inv.invoiceDate}</div>
                    <div>Month:</div>
                </div>
            </div>

            {/* To Section */}
            <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                <div>To,</div>
                <div>{inv.companyName}</div>
                {/* Placeholder address based on screenshot */}
                <div>2nd floor, Ambar, 22/B, Tilak Nagar, Nawab Area,</div>
                <div>Nr. Times Square, Opp. Lotus Building, Nagpur-440010</div>
                <div>State- Maharashtra (27)</div>
            </div>

            {/* GST Details */}
            <div style={{ marginBottom: '10px', lineHeight: '1.6' }}>
                {inv.billedTo?.gstNo && <div>GST No: {inv.billedTo.gstNo}</div>}
                <div>Place of Supply: Maharashtra (27)</div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '15px' }}>
                <thead>
                    <tr>
                        <th style={{ ...cellStyle, width: '75%', textAlign: 'center', fontWeight: 'bold' }}>Description</th>
                        <th style={{ ...cellStyle, width: '25%', textAlign: 'center', fontWeight: 'bold' }}>Amount (Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, verticalAlign: 'top', borderBottom: '1px dashed #ccc' }}>
                            <div style={{ marginBottom: '10px' }}>
                                Brokerage / Distribution Fees in relation to General Insurance Business for the month of {inv.monthName || ''}
                            </div>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'top', borderBottom: '1px dashed #ccc' }}>
                            {fmtAmount(inv.taxableAmount)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, verticalAlign: 'top', borderTop: 'none', borderBottom: '1px dashed #ccc' }}>
                            <div>Add: CGST @9% on Assessable value of service</div>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'top', borderTop: 'none', borderBottom: '1px dashed #ccc' }}>
                            {fmtAmount(inv.cgst)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, verticalAlign: 'top', borderTop: 'none', borderBottom: '1px dashed #ccc' }}>
                            <div>Add: SGST/UTGST @9% on Assessable value of service</div>
                            <div style={{ margin: '5px 0' }}>Or</div>
                            <div>Add: IGST @18% on Assessable value of service</div>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'top', borderTop: 'none', borderBottom: '1px dashed #ccc' }}>
                            {fmtAmount(inv.sgst)}<br/><br/>
                            {fmtAmount(inv.igst)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, fontWeight: 'bold' }}>Total Value</td>
                        <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>{fmtAmount(inv.grandTotal)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ ...cellStyle, fontWeight: 'bold' }}>
                            Amount in words: {amountInWords}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Amounts & details */}
            <div style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                <div style={{ marginTop: '10px' }}>PAN No – {BROKER.pan}</div>
                <div style={{ marginTop: '10px' }}>GST No – {BROKER.gstn}</div>
                <div style={{ marginTop: '15px' }}>Description of Service: Insurance Service</div>
                <div>Service Code (HSN/SAC): {BROKER.hsnCode}</div>
            </div>

            {/* Bank details & Signatory */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Bank details –</div>
                    <div style={{ fontWeight: 'bold' }}>A/c No: {BROKER.accountNo}</div>
                    <div style={{ fontWeight: 'bold' }}>Bank Name & Branch: {BROKER.bank}, C. A Road Nagpur-08</div>
                    <div style={{ fontWeight: 'bold' }}>IFSC Code: {BROKER.ifsc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingRight: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div>Authorised Signatory's Name,</div>
                        <div>Signature & Stamp</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
