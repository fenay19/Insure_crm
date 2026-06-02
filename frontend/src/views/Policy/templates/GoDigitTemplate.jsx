import React from 'react';
import { fmtAmount, BROKER, AmikaHeader } from './invoiceUtils.jsx';

export const GoDigitTemplate = ({ inv }) => {
    if (!inv) return null;
    const cellStyle = { border: '1px solid #000', padding: '6px 10px', fontSize: '13px' };
    const headerCell = { ...cellStyle, fontWeight: 700, backgroundColor: '#f5f5f5' };

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", color: '#000', maxWidth: 720, margin: '0 auto' }}>
            <AmikaHeader />
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: 6, marginBottom: 0 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Tax Invoice</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, borderRight: '1px solid #000', width: '55%', verticalAlign: 'top' }}>
                            <div><strong>Billed To :</strong></div>
                            <div style={{ fontWeight: 700, fontSize: 14, margin: '4px 0' }}>{inv.companyName}</div>
                            {inv.billedTo?.gstNo && (
                                <>
                                    <div>GSTIN: {inv.billedTo.gstNo}</div>
                                    <div>PAN: {inv.billedTo.gstNo?.substring(2, 12) || ''}</div>
                                </>
                            )}
                        </td>
                        <td style={{ ...cellStyle, verticalAlign: 'top' }}>
                            <div>ORIGINAL FOR RECEIPT</div>
                            <div style={{ marginTop: 4 }}><strong>Invoice Number:</strong> {inv.invoiceNumber}</div>
                            <div><strong>Invoice Date :</strong> {inv.invoiceDate}</div>
                            <div style={{ marginTop: 4 }}>GSTN : {BROKER.gstn}</div>
                            <div>PAN : {BROKER.pan}</div>
                            <div>Currency : INR</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: -1 }}>
                <thead>
                    <tr>
                        <th style={{ ...headerCell, width: '8%', textAlign: 'center' }}>Sl. No.</th>
                        <th style={{ ...headerCell, width: '44%' }}>Name Of Services</th>
                        <th style={{ ...headerCell, width: '18%', textAlign: 'center' }}>HSN Code</th>
                        <th style={{ ...headerCell, width: '30%', textAlign: 'right' }}>Taxable Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, textAlign: 'center' }}>1</td>
                        <td style={cellStyle}>Brokerage for the Month Of {inv.monthName || ''}</td>
                        <td style={{ ...cellStyle, textAlign: 'center' }}>997161</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.taxableAmount)}</td>
                    </tr>
                    <tr><td style={cellStyle}>&nbsp;</td><td style={cellStyle}>&nbsp;</td><td style={cellStyle}>&nbsp;</td><td style={cellStyle}>&nbsp;</td></tr>
                    <tr><td style={cellStyle}></td><td style={{ ...cellStyle, fontWeight: 700 }}>Total Amount</td><td style={cellStyle}></td><td style={{ ...cellStyle, textAlign: 'right', fontWeight: 700 }}>{fmtAmount(inv.taxableAmount)}</td></tr>
                    <tr><td style={cellStyle}></td><td style={{ ...cellStyle, fontWeight: 700 }}>IGST @ 18%</td><td style={cellStyle}></td><td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.igst)}</td></tr>
                    <tr><td style={cellStyle}></td><td style={{ ...cellStyle, fontWeight: 700 }}>CGST @ 9%</td><td style={cellStyle}></td><td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.cgst)}</td></tr>
                    <tr><td style={cellStyle}></td><td style={{ ...cellStyle, fontWeight: 700 }}>SGST @ 9%</td><td style={cellStyle}></td><td style={{ ...cellStyle, textAlign: 'right' }}>{fmtAmount(inv.sgst)}</td></tr>
                    <tr style={{ borderTop: '2px solid #000' }}>
                        <td style={cellStyle}></td><td style={{ ...cellStyle, fontWeight: 700, fontSize: 14 }}>Total</td><td style={cellStyle}></td><td style={{ ...cellStyle, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>{fmtAmount(inv.grandTotal)}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{ border: '1px solid #000', borderTop: 'none', padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>
                Whether the tax is payable by recipient on reverse charge basis : No
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: -1 }}>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, width: '55%', verticalAlign: 'top', fontSize: 12 }}>
                            <div style={{ fontWeight: 700 }}>Bank Details of Consultant for Payment:</div>
                            <div style={{ fontWeight: 700, marginTop: 2 }}>Bank Name : {BROKER.bank}</div>
                            <div><strong>Account no. :</strong> {BROKER.accountNo}</div>
                            <div><strong>IFSC Code :</strong> {BROKER.ifsc}</div>
                            <div style={{ fontWeight: 700, marginTop: 2 }}>Branch &nbsp;&nbsp;: {BROKER.branch}</div>
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'top', fontSize: 13 }}>
                            <div style={{ fontWeight: 700, marginBottom: 30 }}>{BROKER.name}</div>
                            <div style={{ fontWeight: 700 }}>Authorized</div>
                            <div style={{ marginTop: 24, fontWeight: 700 }}>Authorised Signatory</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
