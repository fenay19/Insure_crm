import React from 'react';
import { fmtAmount, numberToWords, BROKER, AmikaHeader } from './invoiceUtils.jsx';

export const RelianceTemplate = ({ inv }) => {
    if (!inv) return null;
    
    const cellStyle = { border: '1px solid #000', padding: '6px 10px', fontSize: '13px' };
    
    // Calculate total amount to words
    const amountInWords = numberToWords(Math.round(inv.grandTotal));

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", color: '#000', maxWidth: 720, margin: '0 auto', fontSize: '13px' }}>
            <AmikaHeader />
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div></div>
                <div style={{ textAlign: 'right' }}>
                    <div>MAHARASHTRA</div>
                    <div>STATE CODE : {BROKER.stateCode}</div>
                    <div>ORIGINAL</div>
                </div>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, fontSize: 18, textDecoration: 'underline' }}>TAX INVOICE</h2>
                <div style={{ textAlign: 'left', minWidth: '200px' }}>
                    <div><strong>Invoice No :</strong> {inv.invoiceNumber}</div>
                    <div><strong>Dated :</strong> {inv.invoiceDate}</div>
                </div>
            </div>

            {/* To Section */}
            <div style={{ marginBottom: '20px' }}>
                <div><strong>To,</strong></div>
                <div style={{ fontWeight: 700 }}>{inv.companyName}</div>
                {/* Note: In a real app we'd get full address from DB. We'll use the available info. */}
                <div>Maharashtra</div>
                {inv.billedTo?.gstNo && <div>GST No: {inv.billedTo.gstNo}</div>}
                <div>Place of Supply: Maharashtra-27</div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ ...cellStyle, width: '75%', textAlign: 'center', fontWeight: 'bold' }}>DESCRIPTION</th>
                        <th style={{ ...cellStyle, width: '25%', textAlign: 'center', fontWeight: 'bold' }}>AMOUNT (Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={cellStyle}>
                            Brokerage for the month of {inv.monthName || ''}<br/>
                            ( {BROKER.serviceDesc} )
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'right', verticalAlign: 'top' }}>
                            {fmtAmount(inv.taxableAmount)}
                        </td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>
                            Add : CGST @ 9% on Assessable value of service<br/>
                            Add : SGST/UTGST @ 9% on Assessable value of service<br/>
                            OR<br/>
                            Add : IGST @ ....% on Assessable value of service
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'right', verticalAlign: 'top' }}>
                            {fmtAmount(inv.cgst)}<br/>
                            {fmtAmount(inv.sgst)}<br/><br/>
                            {fmtAmount(inv.igst) === '0' ? '-' : fmtAmount(inv.igst)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, fontWeight: 'bold' }}>Total Value</td>
                        <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}>{fmtAmount(inv.grandTotal)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={cellStyle}>
                            <strong>Amount in Words (Rs.) :</strong> {amountInWords}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Bottom details */}
            <div style={{ lineHeight: '1.6' }}>
                <div><strong>PAN Number :</strong> {BROKER.pan}</div>
                <div><strong>GST No :</strong> {BROKER.gstn}</div>
                <div><strong>Harmonised System Nomenclature Code (HSN):</strong> {BROKER.hsnCode}</div>
                <div><strong>Description of Services:</strong> {BROKER.serviceDesc}</div>
                <div><strong>Whether the tax is payable on reverse charge basis:</strong> No</div>
                
                <div style={{ marginTop: '15px' }}>Certified that the details furnished above are true and correct</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Bank Details –</div>
                        <div>A/c No-{BROKER.accountNo}</div>
                        <div>Bank Name & Branch: {BROKER.bank}, {BROKER.branch}</div>
                        <div>IFSC code: {BROKER.ifsc}</div>
                    </div>
                    <div style={{ textAlign: 'center', alignSelf: 'flex-end', minWidth: '250px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '40px' }}>For {BROKER.shortName}</div>
                        <div>Authorised Signatory’s Name, Signature & Stamp</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
