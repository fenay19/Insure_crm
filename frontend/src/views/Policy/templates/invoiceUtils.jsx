export const fmtCurrency = (n) => {
    if (n === null || n === undefined || n === '—') return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
};

export const fmtAmount = (n) => {
    if (n === null || n === undefined) return '-';
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
};

export const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;

    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    return str.trim() + ' Only';
};

export const BROKER = {
    name: 'JP Insurance Brokers Private Limited',
    shortName: 'JP INSURANCE BROKERS PVT LTD',
    address: 'Smartwork Business Centre, Nyati Unitree\nWest Wing, 1st Floor, Yerwada\nPune -411006\nMaharashtra',
    stateName: 'Maharashtra',
    stateCode: '27',
    gstn: '27AADCJ5573D1ZK',
    pan: 'AADCJ5573D',
    bank: 'KOTAK MAHINDRA BANK',
    accountNo: '9812254366',
    ifsc: 'KKBK0001829',
    branch: 'CHHAPRU NAGAR BRANCH, NAGPUR',
    hsnCode: '997161',
    serviceDesc: 'Other professional, technical and Business Services'
};

export const AmikaHeader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e0e0e0', paddingBottom: '15px' }}>
            {/* Logo Section */}
            <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '46px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: 900, color: '#27348b', letterSpacing: '-1.5px', lineHeight: '1' }}>amika</span>
                        <div style={{ marginLeft: '4px', marginTop: '6px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2h8v8h-3V6.1L8.1 15 6 12.9 14.9 4H12V2z" fill="#148acb"/>
                            </svg>
                        </div>
                    </div>
                    <span style={{ fontSize: '28px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: 400, color: '#555', letterSpacing: '1px', lineHeight: '1', marginTop: '-4px' }}>softwares</span>
                </div>
            </div>

            {/* Address Section */}
            <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#333', textAlign: 'right', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                <div><strong>Address:-</strong> Nagpur nagpur Maharashtra</div>
                <div>440027</div>
                <div><strong>Website:-</strong> www.amikasoftwares.com</div>
                <div><strong>Contact:-</strong> 7722075447, 8767307387</div>
                <div><strong>Mail:-</strong> info@amikasoftwares.com</div>
                <div><strong>GST No:-</strong> 27ACDFA2095E1ZM</div>
            </div>
        </div>
    );
};
