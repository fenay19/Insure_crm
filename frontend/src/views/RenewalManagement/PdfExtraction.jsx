import React, { useState, useRef } from 'react';
import {
    Grid,
    Button,
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Chip,
    Divider,
    Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import REACT_APP_API_URL from '../../api/api';
import axios from 'axios';

// ─── Helper: parse extracted text → policy field object ──────────────────────
function parsePolicyText(text) {
    const clean = (s) => (s ? s.trim().replace(/\s+/g, ' ') : '');

    const find = (patterns) => {
        for (const pattern of patterns) {
            const m = text.match(pattern);
            if (m && m[1]) return clean(m[1]);
        }
        return '';
    };

    const parseDate = (raw) => {
        if (!raw) return '';
        // DD/MM/YYYY or DD-MM-YYYY
        let m = raw.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
        if (m) {
            const [, d, mo, y] = m;
            return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        // DD MMM 'YY or DD MMM YYYY (e.g., 04 Feb '26, 31/03/2015)
        m = raw.match(/(\d{1,2})\s*([A-Za-z]{3})\s*\'?(\d{2,4})/);
        if (m) {
            const [, d, mon, y] = m;
            const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
            const mo = months[mon.toLowerCase()] || '01';
            const year = y.length === 2 ? `20${y}` : y;
            return `${year}-${mo}-${d.padStart(2, '0')}`;
        }
        return '';
    };

    const findDate = (patterns) => parseDate(find(patterns));
    const findNum = (patterns) => find(patterns).replace(/,/g, '');

    // ─── Helper: infer policy duration from two YYYY-MM-DD date strings ──
    const inferDuration = (start, end) => {
        if (!start || !end) return '';
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        if (diffDays >= 350 && diffDays <= 380) return 'YEARLY';
        if (diffDays >= 85 && diffDays <= 95) return 'QUARTERLY';
        if (diffDays >= 28 && diffDays <= 32) return 'MONTHLY';
        return 'DAYS';
    };

    const extracted = {
        policyNumber: find([
            /(?:Policy\s*No(?:\s*&|and)\s*Certificate\s*No|Policy\s*(?:No|Number|#))[.\s:]*([A-Z0-9\/\-\s]+?)(?:\n|Insured)/i,
            /(?:Policy|Pol\.?)\s*No\.?\s*[:\-]?\s*([A-Z0-9\/\-]+)/i
        ]),
        cutomerName: find([
            /(?:Insured\s*Name|Name\s*of\s*(?:the\s*)?Insured|Proposer|Policy\s*Holder)[:\s]+((?:Mr\.|Mrs\.|Ms\.)?\s*[A-Za-z\s\.]+?)(?:\n|,|Mobile|Email|Address|DOB)/i,
            /(?:Name)[:\s]+([A-Za-z\s\.]{3,50})(?:\n|,)/i
        ]),
        mobile: find([
            /(?:Mobile|Phone|Contact|Mob\.?)[:\s]+(\d{10})/i,
            /(?<!\d)(\d{10})(?!\d)/
        ]),
        email: find([
            /(?:Email|E-mail)[:\s]+([\w._%+\-]+@[\w.\-]+\.[A-Z]{2,})/i,
            /([\w._%+\-]+@[\w.\-]+\.[A-Z]{2,})/i
        ]),
        gstNo: find([
            /(?:GST\s*(?:No|Number|IN)?|GSTIN)[:\s]+([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})/i,
            /([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})/
        ]),
        // ─── Department detection ────────────────────────────────────────
        department: find([
            /(?:Department|Class\s*of\s*Insurance|Insurance\s*Type|Type\s*of\s*Policy|Product\s*Name)[:\s]*(Motor|Engineering|Fire|Health|Marine|Liability|Misc(?:ellaneous)?|Finance)/i,
            /\b(Motor)\b.*?(?:Policy|Insurance|Vehicle|Premium)/i,
            /(?:Private\s*Car|Two\s*Wheeler|Commercial\s*Vehicle|GCV|PCV|Motor\s*(?:OD|TP)).*?\b(Motor)\b/i
        ]) || (() => {
            // Fallback: detect motor from context clues
            const motorKeywords = /(?:Private\s*Car|Two\s*Wheeler|Commercial\s*Vehicle|GCV|PCV|Motor\s*OD|Motor\s*TP|Own\s*Damage|Third\s*Party|Vehicle\s*Insurance|IDV|Registration\s*No)/i;
            if (motorKeywords.test(text)) return 'Motor';
            const healthKeywords = /(?:Health\s*Insurance|Mediclaim|Hospitalisation|Medical\s*Insurance)/i;
            if (healthKeywords.test(text)) return 'Health';
            const fireKeywords = /(?:Fire\s*Insurance|Fire\s*Policy|Standard\s*Fire)/i;
            if (fireKeywords.test(text)) return 'Fire';
            const marineKeywords = /(?:Marine\s*(?:Cargo|Insurance|Policy)|Inland\s*Transit)/i;
            if (marineKeywords.test(text)) return 'Marine';
            const engineeringKeywords = /(?:Engineering\s*Insurance|(?:CAR|EAR|CPM)\s*Policy)/i;
            if (engineeringKeywords.test(text)) return 'Engineering';
            return '';
        })(),
        // ─── Product detection ───────────────────────────────────────────
        productName: find([
            /(?:Product\s*(?:Name)?|Plan\s*(?:Name)?|Cover\s*Type)[:\s]+([\w\s\-\/]+?)(?:\n|,|Policy)/i,
            /(?:Type\s*of\s*(?:Vehicle|Cover|Policy))[:\s]+([\w\s\-\/]+?)(?:\n|,)/i,
            /\b(Private\s*Car|Two\s*Wheeler|Commercial\s*Vehicle|GCV|PCV|Goods\s*Carrying\s*Vehicle|Passenger\s*Carrying\s*Vehicle|Motor\s*Cycle)\b/i
        ]),
        sumInsured: findNum([
            /(?:Total\s*IDV|Sum\s*Insured|SI)[^\d]*([\d,]+(?:\.\d{1,2})?)/i,
            /(?:Insured\s*Value)[:\s]+([\d,]+)/i
        ]),
        netPremium: findNum([
            /(?:Net\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i,
            /(?:Basic\s*Premium|Total\s*Own\s*Damage\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i
        ]),
        totalAmount: findNum([
            /(?:Premium\s*amount|Total\s*(?:Premium|Amount)|Gross\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i
        ]),
        startDate: findDate([
            /(?:Period\s*of\s*Insurance\s*OD\s*cover\s*period|Risk\s*Commencement|Policy\s*(?:Start|From|Inception)\s*Date|Valid\s*from)[\s\S]*?(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:From|Start)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        endDate: findDate([
            /(?:Valid\s*Till|Expiry|Valid\s*Upto|To)\s*[:\-]?\s*(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:End|Expiry)\s*(?:Date)?\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        // ─── TP (Third Party) fields ─────────────────────────────────────
        tpPremium: findNum([
            /(?:TP\s*Premium|Third\s*Party\s*Premium|Liability\s*Premium|Total\s*Liability\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i,
            /(?:Act\s*(?:Only\s*)?Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i
        ]),
        tpStartDate: findDate([
            /(?:TP\s*(?:Cover\s*)?(?:Period\s*)?(?:From|Start)|Liability\s*(?:Cover\s*)?(?:From|Start)|Third\s*Party\s*(?:Cover\s*)?From)\s*[:\-]?\s*(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:TP\s*(?:Cover\s*)?(?:Period\s*)?(?:From|Start)|Liability\s*(?:Cover\s*)?(?:From|Start))\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        tpEndDate: findDate([
            /(?:TP\s*(?:Cover\s*)?(?:Period\s*)?(?:To|End|Upto)|Liability\s*(?:Cover\s*)?(?:To|End|Upto)|Third\s*Party\s*(?:Cover\s*)?(?:To|End))\s*[:\-]?\s*(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:TP\s*(?:Cover\s*)?(?:Period\s*)?(?:To|End|Upto)|Liability\s*(?:Cover\s*)?(?:To|End))\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        // ─── OD (Own Damage) fields ──────────────────────────────────────
        odPremium: findNum([
            /(?:OD\s*Premium|Own\s*Damage\s*Premium|Total\s*(?:Own\s*Damage|OD)\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i,
            /(?:Basic\s*OD\s*Premium)[^\d]*([\d,]+(?:\.\d{1,2})?)/i
        ]),
        odStartDate: findDate([
            /(?:OD\s*(?:Cover\s*)?(?:Period\s*)?(?:From|Start)|Own\s*Damage\s*(?:Cover\s*)?From)\s*[:\-]?\s*(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:OD\s*(?:Cover\s*)?(?:Period\s*)?(?:From|Start))\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        odEndDate: findDate([
            /(?:OD\s*(?:Cover\s*)?(?:Period\s*)?(?:To|End|Upto)|Own\s*Damage\s*(?:Cover\s*)?(?:To|End))\s*[:\-]?\s*(\d{1,2}[\s\/\-\.]+[A-Za-z]+[\s\/\-\.\'\d]+)/i,
            /(?:OD\s*(?:Cover\s*)?(?:Period\s*)?(?:To|End|Upto))\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i
        ]),
        vehicleNumber: find([
            /(?:Registration\s*no|Registration\s*Number|Vehicle\s*(?:No|Number)|Reg\.?\s*No\.?)[:\s]+([A-Z0-9\s\-]+?)(?:\n|,)/i
        ]),
        engineNumber: find([
            /(?:Engine\s*Number(?:\/Battery\s*Number)?|Engine\s*(?:No|Number))[:\s]+([A-Z0-9\/]+)/i
        ]),
        chassisNumber: find([
            /(?:Chassis\s*number|Chassis\s*(?:No|Number)|VIN)[:\s]+([A-Z0-9]+)/i
        ]),
        vehicleMake: find([
            /(?:Make\/Model|Make(?:\s*&\s*Model)?|Manufacturer)[:\s]+([A-Za-z\s]+?)(?:\/|\n|,|Model)/i
        ]),
        vehicleModel: find([
            /(?:Make\/Model)[:\s]+[A-Za-z\s]+\/([A-Za-z0-9\s\-]+?)(?:\n|,|Year|Fuel|CC|Engine)/i,
            /(?:Model)[:\s]+([A-Za-z0-9\s\-]+?)(?:\n|,|Year|Fuel|CC|Engine)/i
        ]),
        fuelType: find([
            /(?:Fuel\s*Type)[:\s]+([A-Za-z]+)/i
        ]),
        yearOfManufacturing: find([
            /(?:Mfg\.?\s*Year|Year\s*of\s*(?:Manufacture|Mfg|Manufacturing|Make))[:\s]+(\d{4})/i
        ]),
        bodyType: find([
            /(?:Body\s*Type)[:\s]+([A-Za-z\s]+?)(?:\n|,)/i
        ]),
        insCompany: find([
            /(?:Insurance\s*Company|Insurer(?:'s)?\s*Name|Company\s*Name|Issued\s*By)[:\s]+([A-Za-z\s\.\&]+(?:Insurance|General|Assurance|Company|Ltd|Limited))/i,
            /(?:SBI\s*General|Go\s*Digit|Reliance\s*General|Oriental\s*Insurance|Future\s*Generali|Magma\s*HDI|TATA\s*AIG|ICICI\s*Lombard|HDFC\s*ERGO|Bajaj\s*Allianz|Cholamandalam|United\s*India|New\s*India|National\s*Insurance|Kotak\s*Mahindra|Royal\s*Sundaram|Shriram\s*General|Universal\s*Sompo)/i
        ]),
        tpBrokerageRate: findNum([
            /(?:TP\s*Brokerage\s*Rate|Third\s*Party\s*Brokerage\s*Rate|TP\s*Commission\s*Rate)[\s\S]*?([\d]+(?:\.\d{1,2})?)\s*%/i,
            /(?:Brokerage\s*Rate\s*TP)[\s\S]*?([\d]+(?:\.\d{1,2})?)/i
        ]),
        odBrokerageRate: findNum([
            /(?:OD\s*Brokerage\s*Rate|Own\s*Damage\s*Brokerage\s*Rate|OD\s*Commission\s*Rate)[\s\S]*?([\d]+(?:\.\d{1,2})?)\s*%/i,
            /(?:Brokerage\s*Rate\s*OD)[\s\S]*?([\d]+(?:\.\d{1,2})?)/i
        ])
    };

    // ─── Derive TP / OD duration from dates ──────────────────────────────
    if (extracted.tpStartDate && extracted.tpEndDate) {
        extracted.tpPolicyDuration = inferDuration(extracted.tpStartDate, extracted.tpEndDate);
    }
    if (extracted.odStartDate && extracted.odEndDate) {
        extracted.odPolicyDuration = inferDuration(extracted.odStartDate, extracted.odEndDate);
    }

    // If renewalDate not found, fallback to endDate
    if (!extracted.renewalDate && extracted.endDate) {
        extracted.renewalDate = extracted.endDate;
    }

    // Remove empty fields
    return Object.fromEntries(Object.entries(extracted).filter(([, v]) => v && v.length > 0));
}

// ─── Human-readable field labels ────────────────────────────────────────────
const FIELD_LABELS = {
    policyNumber: 'Policy Number',
    cutomerName: 'Customer Name',
    mobile: 'Mobile',
    email: 'Email',
    gstNo: 'GST No',
    department: 'Department',
    productName: 'Product',
    sumInsured: 'Sum Insured (IDV)',
    netPremium: 'Net Premium',
    totalAmount: 'Total Amount',
    startDate: 'Start Date',
    endDate: 'End Date',
    renewalDate: 'Renewal Date',
    tpPremium: 'TP Premium',
    tpStartDate: 'TP Start Date',
    tpEndDate: 'TP End Date',
    tpPolicyDuration: 'TP Policy Duration',
    odPremium: 'OD Premium',
    odStartDate: 'OD Start Date',
    odEndDate: 'OD End Date',
    odPolicyDuration: 'OD Policy Duration',
    vehicleNumber: 'Vehicle Number',
    engineNumber: 'Engine Number',
    chassisNumber: 'Chassis Number',
    vehicleMake: 'Vehicle Make',
    vehicleModel: 'Vehicle Model',
    fuelType: 'Fuel Type',
    yearOfManufacturing: 'Year of Manufacturing',
    bodyType: 'Body Type',
    insCompany: 'Insurance Company',
    tpBrokerageRate: 'TP Brokerage Rate (%)',
    odBrokerageRate: 'OD Brokerage Rate (%)'
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PdfExtraction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    const source = location.state?.source || 'policyList';

    const [pdfFile, setPdfFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(false);
    const [existingPolicyId, setExistingPolicyId] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [rawText, setRawText] = useState('');
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFile = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setPdfFile(file);
        setError('');
        setExtractedData(null);
        setRawText('');
        setParsing(true);

        try {
            // Upload to backend for extraction
            const formData = new FormData();
            formData.append('pdf', file);

            const res = await axios.post(`${REACT_APP_API_URL}pdf/extract-pdf`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success && res.data.text) {
                const text = res.data.text;
                setRawText(text);
                const parsed = parsePolicyText(text);

                if (Object.keys(parsed).length === 0) {
                    setError('No recognizable policy fields found in the PDF. The system could extract the text but could not identify specific fields.');
                } else {
                    setExtractedData(parsed);
                    
                    // ── Context-Aware Renewal Logic ──
                    if (source === 'renewalPage' && parsed.policyNumber) {
                        setCheckingExisting(true);
                        try {
                            // Note: URL encoding the policy number in case it contains slashes or spaces
                            const lookupRes = await axios.get(`${REACT_APP_API_URL}policyDetail/by-policy-number/${encodeURIComponent(parsed.policyNumber)}`);
                            if (lookupRes.data.status === "true" && lookupRes.data.data?._id) {
                                setExistingPolicyId(lookupRes.data.data._id);
                            } else {
                                setExistingPolicyId(null);
                                setError(`No existing history found for Policy Number: ${parsed.policyNumber}. Proceeding as a New Policy.`);
                            }
                        } catch (lookupErr) {
                            console.log('Policy lookup failed/not found:', lookupErr);
                            setExistingPolicyId(null);
                            setError(`Could not find an existing record for Policy Number: ${parsed.policyNumber}. You will be redirected to create a New Policy.`);
                        } finally {
                            setCheckingExisting(false);
                        }
                    }
                }
            } else {
                setError('Backend could not extract text from this PDF.');
            }
        } catch (err) {
            console.error('PDF extraction error:', err);
            setError('Failed to extract text from the PDF. Please ensure the backend server is running.');
        } finally {
            setParsing(false);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleGoToAddPolicy = () => {
        // Source renewalPage check or finding a match by policy number
        const targetId = existingPolicyId || (source === 'renewalPage' ? location.state?.originalPolicyId : null);

        if (targetId) {
            navigate(`/renewPolicy/${targetId}`, { state: { prefill: extractedData } });
        } else {
            navigate('/policy/AddPolicy', { state: { prefill: extractedData } });
        }
    };

    const extractedCount = extractedData ? Object.keys(extractedData).length : 0;

    return (
        <>
            <Breadcrumb title="PDF Extraction">
                <Typography component={Link} to="/" variant="subtitle2" color="inherit">
                    Renewal Management
                </Typography>
                <Typography variant="subtitle2" color="primary">
                    PDF Extraction
                </Typography>
            </Breadcrumb>

            <Grid container spacing={gridSpacing}>

                {/* ── Upload Section ── */}
                <Grid item xs={12}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoFixHighIcon color="primary" />
                                Policy PDF Extractor {source === 'renewalPage' ? '(Renewal Mode)' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                {source === 'renewalPage' 
                                    ? 'Upload a renewal PDF. The system will extract the policy number, attempt to find your existing record, and pre-fill the renewal form.'
                                    : 'Upload an insurance policy PDF. The system will extract key details and pre-fill the Add Policy form for you.'
                                }
                            </Typography>

                            {/* Drag & Drop Zone */}
                            <Box
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    border: `2px dashed ${dragOver ? '#1976d2' : '#b0bec5'}`,
                                    borderRadius: 3,
                                    p: 6,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: dragOver ? '#e3f2fd' : '#fafafa',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#1976d2',
                                        backgroundColor: '#f0f7ff'
                                    }
                                }}
                            >
                                <UploadFileIcon sx={{ fontSize: 56, color: dragOver ? '#1976d2' : '#90a4ae', mb: 1 }} />
                                <Typography variant="h6" color={dragOver ? 'primary' : 'text.secondary'}>
                                    {pdfFile ? pdfFile.name : 'Drag & drop a PDF here, or click to browse'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Supports all PDF files (max 10MB)
                                </Typography>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleFileInput}
                                />
                            </Box>

                            {pdfFile && (
                                <Box mt={2} display="flex" alignItems="center" gap={1}>
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={pdfFile.name}
                                        color="success"
                                        variant="outlined"
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => { setPdfFile(null); setExtractedData(null); setRawText(''); setError(''); }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            )}

                            {error && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* ── Loading State ── */}
                {(parsing || checkingExisting) && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                <CircularProgress size={40} sx={{ mb: 2 }} />
                                <Typography variant="h6">
                                    {parsing ? 'Extracting policy data from PDF...' : 'Checking for existing policy...'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {parsing ? 'Uploading to server and parsing text' : 'Cross-referencing Policy Number'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* ── Extracted Data Table ── */}
                {extractedData && !parsing && !checkingExisting && (
                    <Grid item xs={12}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            Extracted Fields
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {extractedCount} field{extractedCount !== 1 ? 's' : ''} extracted from &ldquo;{pdfFile?.name}&rdquo;
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color={source === 'renewalPage' && existingPolicyId ? "success" : "primary"}
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleGoToAddPolicy}
                                        sx={{ fontWeight: 700, textTransform: 'none', px: 3 }}
                                    >
                                        { (source === 'renewalPage' || existingPolicyId) ? 'Proceed to Renew →' : 'Go to Add Policy →'}
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 700, width: '40%' }}>Field</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Extracted Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(extractedData).map(([key, value]) => (
                                                <TableRow key={key} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                                                            {FIELD_LABELS[key] || key}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={value}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            sx={{ fontFamily: 'monospace', maxWidth: '100%' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <strong>Note:</strong> Department and Product will be auto-matched if detected. Other dropdown fields (Insurance Company, Broker, etc.) must be selected manually on the next page.
                                </Alert>

                                <Box mt={3} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        color={source === 'renewalPage' && existingPolicyId ? "success" : "primary"}
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleGoToAddPolicy}
                                        sx={{ fontWeight: 700, textTransform: 'none', px: 4 }}
                                    >
                                        { (source === 'renewalPage' || existingPolicyId) 
                                            ? 'Open Renewal Form with Pre-filled Data →' 
                                            : 'Open Add Policy with Pre-filled Data →'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

            </Grid>
        </>
    );
};

export default PdfExtraction;
