import React from 'react';
import { fmtAmount, numberToWords, BROKER, AmikaHeader } from './invoiceUtils.jsx';

export const OrientalTemplate = ({ inv }) => {
    if (!inv) return null;
    
    const cellStyle = { border: '1px solid #000', padding: '6px 10px', fontSize: '13px' };
    
    // Calculate total amount to words
    const amountInWords = numberToWords(Math.round(inv.grandTotal));

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", color: '#000', maxWidth: 720, margin: '0 auto', fontSize: '13px' }}>
            <AmikaHeader />
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: 18, textDecoration: 'underline' }}>TAX INVOICE</h2>
            </div>
            
            {/* Invoice Info */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left', minWidth: '200px' }}>
                    <div style={{ fontWeight: 'bold' }}>Invoice No: {inv.invoiceNumber}</div>
                    <div style={{ fontWeight: 'bold' }}>Date: {inv.invoiceDate}</div>
                </div>
            </div>

            {/* To Section */}
            <div style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                <div>To,</div>
                <div style={{ fontWeight: 700, marginTop: '10px' }}>{inv.companyName}</div>
                {/* Normally address from DB, using placeholder structure from screenshot */}
                <div style={{ marginTop: '10px' }}>502, 4TH FLOOR 263/264,</div>
                <div style={{ marginTop: '10px' }}>BRIJ BHUMI COMPLEX NEAR TELEPHONE EXCHANGE SQUARE</div>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>NAGPUR- 440008</div>
                {inv.billedTo?.gstNo && <div style={{ fontWeight: 'bold' }}>GST No: {inv.billedTo.gstNo}</div>}
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ ...cellStyle, width: '60%', textAlign: 'center', fontWeight: 'bold' }}>DESCRIPTION</th>
                        <th style={{ ...cellStyle, width: '20%', textAlign: 'center', fontWeight: 'bold' }}>HSN CODE</th>
                        <th style={{ ...cellStyle, width: '20%', textAlign: 'center', fontWeight: 'bold' }}>AMOUNT (RS.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, verticalAlign: 'top', borderBottom: 'none' }}>
                            Commission/brokerage for the month {inv.monthName || ''}<br/><br/><br/>
                            Add : <strong>CGST @ 9 %</strong> on assessable value of service<br/><br/><br/>
                            Add: <strong>SGST/UTGST @ 9 %</strong> on assessable value of service<br/><br/><br/>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'middle', borderBottom: 'none' }}>
                            <strong>{BROKER.hsnCode}</strong>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'top', borderBottom: 'none' }}>
                            {fmtAmount(inv.taxableAmount)}<br/><br/><br/>
                            {fmtAmount(inv.cgst)}<br/><br/><br/>
                            {fmtAmount(inv.sgst)}<br/><br/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>TOTAL VALUE</td>
                        <td style={{ ...cellStyle, borderTop: '1px solid #000' }}></td>
                        <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>{fmtAmount(inv.grandTotal)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amounts & details */}
            <div style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                <div>Amount in Words ( <strong>Rs. {amountInWords} Paisa only.</strong>)</div>
                <div style={{ fontWeight: 'bold', marginTop: '10px' }}>PAN Number: {BROKER.pan}</div>
                <div style={{ fontWeight: 'bold', marginTop: '15px' }}>GST No: {BROKER.gstn}</div>
                <div style={{ fontWeight: 'bold', marginTop: '15px' }}>Certified that the details furnished above are true and correct</div>
            </div>

            {/* Bank details & Signatory */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold' }}>Bank details –</div>
                    <div>A/c No: 915020044439184</div>
                    <div>Bank Name & Branch: Axis Bank, C. A Road Nagpur-08</div>
                    <div>IFSC code: UTIB0000330</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingRight: '20px' }}>
                    <div style={{ fontWeight: 'bold' }}>Authorised Signatory's</div>
                </div>
            </div>
        </div>
    );
};
