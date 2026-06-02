import React from 'react';
import { fmtAmount, numberToWords, BROKER, AmikaHeader } from './invoiceUtils.jsx';

export const FutureTemplate = ({ inv }) => {
    if (!inv) return null;
    
    const cellStyle = { border: '1px solid #000', padding: '6px 10px', fontSize: '13px' };
    
    // Calculate total amount to words
    const amountInWords = numberToWords(Math.round(inv.grandTotal));

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", color: '#000', maxWidth: 720, margin: '0 auto', fontSize: '13px' }}>
            <AmikaHeader />
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>Tax Invoice</h2>
            </div>
            
            {/* Header info table (invisible borders) */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', paddingBottom: '3px' }}>State Name</td>
                        <td style={{ width: '80%', paddingBottom: '3px' }}>: {BROKER.stateName}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>State Code</td>
                        <td style={{ paddingBottom: '3px' }}>: {BROKER.stateCode}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>GSTIN</td>
                        <td style={{ paddingBottom: '3px' }}>: {BROKER.gstn}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>PAN Number</td>
                        <td style={{ paddingBottom: '3px' }}>: {BROKER.pan}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ borderBottom: '1px solid #000', margin: '15px 0' }}></div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '20%', paddingBottom: '3px' }}>Invoice Date</td>
                        <td style={{ width: '80%', paddingBottom: '3px' }}>: {inv.invoiceDate}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>Invoice No.</td>
                        <td style={{ paddingBottom: '3px' }}>: {inv.invoiceNumber}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>Place of Supply</td>
                        <td style={{ paddingBottom: '3px' }}>: Maharashtra-27</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>HSN Code</td>
                        <td style={{ paddingBottom: '3px' }}>: {BROKER.hsnCode}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: '3px' }}>Reverse Charge</td>
                        <td style={{ paddingBottom: '3px' }}>: NO</td>
                    </tr>
                </tbody>
            </table>

            {/* To Section */}
            <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                <div>The Manager,</div>
                <div style={{ fontWeight: 700 }}>{inv.companyName}</div>
                <div>Unit No. 801 & 802 Tower C</div>
                <div>247 Embassy Park LBS Marg</div>
                <div>Vikhroli (West) Mumbai - 400 083</div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '20%', paddingBottom: '3px' }}>State</td>
                            <td style={{ width: '80%', paddingBottom: '3px' }}>: Maharashtra</td>
                        </tr>
                        <tr>
                            <td style={{ paddingBottom: '3px' }}>State Code</td>
                            <td style={{ paddingBottom: '3px' }}>: 27</td>
                        </tr>
                        <tr>
                            <td style={{ paddingBottom: '3px' }}>GSTIN</td>
                            <td style={{ paddingBottom: '3px' }}>: {inv.billedTo?.gstNo || ''}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '15px' }}>
                <thead>
                    <tr>
                        <th style={{ ...cellStyle, width: '70%', textAlign: 'left', fontWeight: 'bold' }}>Particular</th>
                        <th style={{ ...cellStyle, width: '30%', textAlign: 'left', fontWeight: 'bold' }}>Amount (In Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, height: '40px', verticalAlign: 'top' }}>
                            Brokerage Charges for the month of {inv.monthName || ''}
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'right', verticalAlign: 'top' }}>
                            {fmtAmount(inv.taxableAmount)}
                        </td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Add : CGST @ 9%</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.cgst)}</td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Add : SGST @ 9%</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.sgst)}</td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Add : IGST @18%</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.igst) === '0' ? '-' : fmtAmount(inv.igst)}</td>
                    </tr>
                    <tr>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Total</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.grandTotal)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amounts & details */}
            <div style={{ lineHeight: '1.8', marginBottom: '30px', border: '1px solid transparent' /* align with table */}}>
                <div style={{ padding: '6px 10px'}}>Total Rupees (In words Rs.{amountInWords}.)</div>
            </div>

            {/* Signatory */}
            <div style={{ lineHeight: '1.6', marginTop: '20px', padding: '0 10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>For</div>
                <div style={{ fontWeight: 'bold', marginBottom: '50px' }}>{BROKER.shortName}</div>
                <div style={{ fontWeight: 'bold' }}>Authorized Signatories</div>
            </div>
        </div>
    );
};
