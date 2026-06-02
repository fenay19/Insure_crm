import React, { useState, useEffect, useRef } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Button, Chip,
    CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    Divider, IconButton
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import REACT_APP_API_URL from '../../api/api';
import axios from 'axios';

// Import shared utilities and templates
import { fmtCurrency, fmtAmount, BROKER, AmikaHeader } from './templates/invoiceUtils.jsx';
import { GoDigitTemplate } from './templates/GoDigitTemplate';
import { RelianceTemplate } from './templates/RelianceTemplate';
import { SbiTemplate } from './templates/SbiTemplate';
import { FutureTemplate } from './templates/FutureTemplate';
import { MagmaTemplate } from './templates/MagmaTemplate';
import { OrientalTemplate } from './templates/OrientalTemplate';

/* ═══════════════════════════ Default Improved Tax Invoice Template ═══════════════════════════ */
const DefaultTemplate = ({ inv }) => {
    if (!inv) return null;

    const cellStyle = { border: '1px solid #ddd', padding: '10px 14px', fontSize: '13px' };
    const headerCell = { ...cellStyle, fontWeight: 700, backgroundColor: '#f8f9fa', color: '#333' };

    return (
        <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#333', maxWidth: 720, margin: '0 auto' }}>
            <AmikaHeader />
            {/* ── Title ── */}
            <div style={{ textAlign: 'center', paddingBottom: 15, marginBottom: 20, borderBottom: '3px solid #1a237e' }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1a237e', letterSpacing: '1px', textTransform: 'uppercase' }}>Tax Invoice</h2>
            </div>

            {/* ── Header: Billed To (left) + Invoice Info (right) ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25, gap: 20 }}>
                {/* Billed To */}
                <div style={{ flex: 1, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: 8 }}>Billed To</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#1a237e', marginBottom: 5 }}>{inv.companyName}</div>
                    {inv.billedTo?.gstNo ? (
                        <div style={{ fontSize: 13, color: '#555', marginTop: 10 }}>
                            <div><strong>GSTIN:</strong> {inv.billedTo.gstNo}</div>
                            <div style={{ marginTop: 3 }}><strong>PAN:</strong> {inv.billedTo.gstNo?.substring(2, 12)}</div>
                        </div>
                    ) : null}
                </div>

                {/* Invoice Info */}
                <div style={{ flex: 1, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontSize: 13, color: '#555' }}><strong>Invoice No:</strong></div>
                        <div style={{ fontWeight: 700, color: '#1a237e' }}>{inv.invoiceNumber}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: '#555' }}><strong>Date:</strong></div>
                        <div style={{ fontWeight: 700 }}>{inv.invoiceDate}</div>
                    </div>
                    <div style={{ borderTop: '1px solid #ddd', margin: '10px 0' }}></div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        <div style={{ marginBottom: 3 }}><strong>Broker GSTIN:</strong> {BROKER.gstn}</div>
                        <div><strong>Broker PAN:</strong> {BROKER.pan}</div>
                    </div>
                </div>
            </div>

            {/* ── Line Items Table ── */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 25, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <thead>
                    <tr>
                        <th style={{ ...headerCell, width: '8%', textAlign: 'center' }}>#</th>
                        <th style={{ ...headerCell, width: '44%', textAlign: 'left' }}>Description of Service</th>
                        <th style={{ ...headerCell, width: '18%', textAlign: 'center' }}>HSN Code</th>
                        <th style={{ ...headerCell, width: '30%', textAlign: 'right' }}>Taxable Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Line item row */}
                    <tr>
                        <td style={{ ...cellStyle, textAlign: 'center' }}>1</td>
                        <td style={cellStyle}>Brokerage for the month of <strong>{inv.monthName || ''}</strong></td>
                        <td style={{ ...cellStyle, textAlign: 'center', color: '#666' }}>{BROKER.hsnCode}</td>
                        <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 600 }}>{fmtAmount(inv.taxableAmount)}</td>
                    </tr>

                    {/* Tax breakdown rows */}
                    <tr>
                        <td colSpan="2" style={{ ...cellStyle, borderRight: 'none' }}></td>
                        <td style={{ ...cellStyle, borderLeft: 'none', textAlign: 'right', color: '#666' }}>IGST (18%)</td>
                        <td style={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{fmtAmount(inv.igst)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{ ...cellStyle, borderRight: 'none' }}></td>
                        <td style={{ ...cellStyle, borderLeft: 'none', textAlign: 'right', color: '#666' }}>CGST (9%)</td>
                        <td style={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{fmtAmount(inv.cgst)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{ ...cellStyle, borderRight: 'none' }}></td>
                        <td style={{ ...cellStyle, borderLeft: 'none', textAlign: 'right', color: '#666' }}>SGST (9%)</td>
                        <td style={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{fmtAmount(inv.sgst)}</td>
                    </tr>

                    {/* Grand Total */}
                    <tr>
                        <td colSpan="2" style={{ ...cellStyle, borderRight: 'none' }}></td>
                        <td style={{ ...cellStyle, borderLeft: 'none', textAlign: 'right', fontWeight: 800, fontSize: 15, color: '#1a237e' }}>Grand Total</td>
                        <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 800, fontSize: 16, color: '#1a237e', backgroundColor: '#f0f4f8' }}>
                            {fmtCurrency(inv.grandTotal)}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── Footer Info ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 30, padding: 20, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee' }}>
                <div style={{ flex: 1.5 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a237e', marginBottom: 10 }}>Bank Details for Payment</div>
                    <table style={{ fontSize: 13, lineHeight: '1.6', color: '#555' }}>
                        <tbody>
                            <tr><td style={{ paddingRight: 10, fontWeight: 600 }}>Bank Name:</td><td>{BROKER.bank}</td></tr>
                            <tr><td style={{ paddingRight: 10, fontWeight: 600 }}>Account No:</td><td style={{ color: '#000', fontWeight: 700 }}>{BROKER.accountNo}</td></tr>
                            <tr><td style={{ paddingRight: 10, fontWeight: 600 }}>IFSC Code:</td><td style={{ color: '#000', fontWeight: 700 }}>{BROKER.ifsc}</td></tr>
                            <tr><td style={{ paddingRight: 10, fontWeight: 600, verticalAlign: 'top' }}>Branch:</td><td>{BROKER.branch}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>For {BROKER.shortName}</div>
                    <div style={{ marginTop: 60, borderTop: '1px solid #ccc', paddingTop: 8, fontSize: 12, color: '#666', width: '80%', margin: '60px auto 0 auto' }}>
                        Authorised Signatory
                    </div>
                </div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 20 }}>
                Whether the tax is payable by recipient on reverse charge basis : No
            </div>
        </div>
    );
};

/* ═══════════════════════════ Invoice Template Router ═══════════════════════════ */
const DynamicInvoiceContent = ({ inv }) => {
    if (!inv) return null;

    const companyName = inv.companyName?.toLowerCase() || '';

    // Route to exact templates based on company name
    if (companyName.includes('go digit') || companyName.includes('godigit')) {
        return <GoDigitTemplate inv={inv} />;
    }
    if (companyName.includes('reliance')) {
        return <RelianceTemplate inv={inv} />;
    }
    if (companyName.includes('sbi general')) {
        return <SbiTemplate inv={inv} />;
    }
    if (companyName.includes('future generali')) {
        return <FutureTemplate inv={inv} />;
    }
    if (companyName.includes('magma')) {
        return <MagmaTemplate inv={inv} />;
    }
    if (companyName.includes('oriental')) {
        return <OrientalTemplate inv={inv} />;
    }

    // Fallback to the improved general template
    return <DefaultTemplate inv={inv} />;
};

const BilledPolicies = () => {
    const [companies, setCompanies] = useState([]);
    const [totalBilled, setTotalBilled] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Invoice dialog state
    const [invoiceData, setInvoiceData] = useState(null);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [generating, setGenerating] = useState('');
    const invoiceRef = useRef(null);

    useEffect(() => { fetchBilled(); }, []);

    const fetchBilled = async () => {
        setLoading(true);
        setError('');
        try {
            const companyId = localStorage.getItem('companyId');
            const res = await axios.get(`${REACT_APP_API_URL}unbilledReconciliation/billed`, { params: { companyId } });
            if (res.data.success) {
                setCompanies(res.data.data);
                setTotalBilled(res.data.totalBilledPolicies || 0);
            } else setError('Failed to load billed policies.');
        } catch (err) {
            console.error(err);
            setError('Error loading billed policies.');
        } finally { setLoading(false); }
    };

    const handleGenerateInvoice = async (companyName) => {
        setGenerating(companyName);
        try {
            const res = await axios.post(`${REACT_APP_API_URL}unbilledReconciliation/generate-invoice`, { companyName });
            if (res.data.success) {
                setInvoiceData(res.data.invoice);
                setInvoiceOpen(true);
            }
        } catch (err) {
            console.error(err);
            alert('Error generating invoice.');
        } finally { setGenerating(''); }
    };

    const handlePrint = () => {
        const content = invoiceRef.current;
        if (!content || !invoiceData) return;
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>Tax Invoice - ${invoiceData.companyName}</title>
            <style>
                @media print { @page { margin: 15mm; } }
                body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; }
            </style></head><body>
            ${content.innerHTML}
            </body></html>
        `);
        win.document.close();
        setTimeout(() => win.print(), 300);
    };

    return (
        <>
            <Breadcrumb title="Billed Policies">
                <Typography component={Link} to="/" variant="subtitle2" color="inherit">Policy Management</Typography>
                <Typography variant="subtitle2" color="primary">Billed Policies</Typography>
            </Breadcrumb>

            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                            px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <CheckCircleIcon sx={{ color: '#fff', fontSize: 28 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Billed Policies</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {totalBilled} policies across {companies.length} companies
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                            {loading ? (
                                <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : companies.length === 0 ? (
                                <Alert severity="info">No billed policies yet. Mark policies as billed from the Unbilled Brokerage page.</Alert>
                            ) : (
                                <Grid container spacing={2}>
                                    {companies.map((c, idx) => (
                                        <Grid item xs={12} sm={6} md={4} key={idx}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2, p: 2.5,
                                                    border: '1px solid #e0e0e0',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { boxShadow: 4, borderColor: '#2e7d32' }
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                                    <BusinessIcon sx={{ color: '#1a237e', fontSize: 22 }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a237e' }}>
                                                        {c.companyName}
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ mb: 1.5 }} />
                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                    <Typography variant="body2" color="text.secondary">Total Policies</Typography>
                                                    <Chip label={c.totalPolicies} size="small" color="primary" sx={{ fontWeight: 700 }} />
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={2}>
                                                    <Typography variant="body2" color="text.secondary">Total Brokerage</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                                        {fmtCurrency(c.totalBrokerage)}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<ReceiptLongIcon />}
                                                    onClick={() => handleGenerateInvoice(c.companyName)}
                                                    disabled={generating === c.companyName}
                                                    sx={{
                                                        backgroundColor: '#1a237e',
                                                        '&:hover': { backgroundColor: '#283593' },
                                                        textTransform: 'none', fontWeight: 600
                                                    }}
                                                >
                                                    {generating === c.companyName ? 'Generating...' : 'Generate Invoice'}
                                                </Button>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ═══ Tax Invoice Dialog ═══ */}
            <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a237e', color: '#fff' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ReceiptLongIcon /> Tax Invoice
                    </Box>
                    <IconButton onClick={() => setInvoiceOpen(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 4, pb: 2, backgroundColor: '#fff' }}>
                    <div ref={invoiceRef}>
                        <DynamicInvoiceContent inv={invoiceData} />
                    </div>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setInvoiceOpen(false)} color="inherit">Close</Button>
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
                        sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#283593' }, textTransform: 'none', fontWeight: 600 }}>
                        Export as PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BilledPolicies;
