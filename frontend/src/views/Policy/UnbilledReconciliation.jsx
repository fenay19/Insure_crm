import React, { useState, useEffect, useRef } from 'react';
import {
    Grid, Card, CardContent, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, TableContainer, Paper, Box, Button, Chip,
    CircularProgress, Alert, Divider, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import REACT_APP_API_URL from '../../api/api';
import axios from 'axios';

const StatusChip = ({ status }) => {
    const config = {
        Matched: { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
        'Already Billed': { color: 'info', icon: <CheckCircleIcon fontSize="small" /> },
        'Not Found': { color: 'error', icon: <ErrorIcon fontSize="small" /> },
        Duplicate: { color: 'warning', icon: <ContentCopyIcon fontSize="small" /> },
    };
    const c = config[status] || { color: 'default', icon: null };
    return <Chip icon={c.icon} label={status} color={c.color} size="small" variant="filled" sx={{ fontWeight: 600 }} />;
};

const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const headerSx = { backgroundColor: '#1a237e' };

const UnbilledReconciliation = () => {
    const [policies, setPolicies] = useState([]);
    const [loadingPolicies, setLoadingPolicies] = useState(true);
    const [policyError, setPolicyError] = useState('');
    const [nullDateCount, setNullDateCount] = useState(0);

    const currentDate = new Date();
    const [filterMonth, setFilterMonth] = useState(currentDate.getMonth() + 1);
    const [filterYear, setFilterYear] = useState(currentDate.getFullYear());

    const [pdfFile, setPdfFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [billing, setBilling] = useState(false);
    const fileRef = useRef(null);

    const MONTHS = [
        { value: '', label: 'All Months' },
        { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
        { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
        { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
        { value: 'noDate', label: '📅 No Date' },
    ];
    const currentYear = currentDate.getFullYear();
    const YEARS = [{ value: '', label: 'All Years' }];
    for (let y = currentYear + 1; y >= currentYear - 5; y--) YEARS.push({ value: y, label: String(y) });

    // ── Fetch unbilled policies ──
    // Accepts explicit month/year to bypass stale-closure issues when called after state changes
    const fetchPolicies = async (monthOverride, yearOverride) => {
        setLoadingPolicies(true);
        setPolicyError('');
        try {
            const companyId = localStorage.getItem('companyId');
            const params = { companyId };
            const m = monthOverride !== undefined ? monthOverride : filterMonth;
            const y = yearOverride !== undefined ? yearOverride : filterYear;

            if (m === 'noDate') {
                params.noDate = 'true';          // backend: null/missing startDate only
            } else {
                if (m) params.month = m;
                if (y) params.year = y;
            }

            const res = await axios.get(`${REACT_APP_API_URL}unbilledReconciliation`, { params });
            if (res.data.success) {
                setPolicies(res.data.data);
                if (res.data.nullDateCount !== undefined) setNullDateCount(res.data.nullDateCount);
                return res.data.data;
            } else {
                setPolicyError('Failed to load policies.');
            }
        } catch (err) {
            console.error(err);
            setPolicyError('Error loading policies.');
        } finally {
            setLoadingPolicies(false);
        }
        return [];
    };

    useEffect(() => { fetchPolicies(filterMonth, filterYear); }, [filterMonth, filterYear]);

    // ── Upload handler ──
    const handleUpload = async (file) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
        if (!file || !allowedTypes.includes(file.type)) {
            setUploadError('Please upload a PDF or Excel file.');
            return;
        }
        setPdfFile(file); setUploadError(''); setResults([]); setSummary(null); setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${REACT_APP_API_URL}unbilledReconciliation/reconcile`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setResults(res.data.results || []);
                setSummary(res.data.summary || null);
                if (res.data.results?.length === 0) setUploadError(res.data.message || 'No data found.');
            } else setUploadError('Failed to process file.');
        } catch (err) {
            console.error(err);
            setUploadError('Error processing file.');
        } finally { setUploading(false); }
    };

    const handleFileInput = (e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); };
    const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]); };
    const resetUpload = () => { setPdfFile(null); setResults([]); setSummary(null); setUploadError(''); };

    // ── Mark as Billed ──
    const matchedIds = [...new Set(
        results.filter((r) => r.matchStatus === 'Matched' && r.dbPolicyId).map((r) => String(r.dbPolicyId))
    )];

    const handleMarkBilled = async () => {
        if (matchedIds.length === 0) return;
        setBilling(true);
        try {
            const res = await axios.post(`${REACT_APP_API_URL}unbilledReconciliation/mark-billed`, { policyIds: matchedIds });
            if (res.data.success) {
                const billedCount = res.data.modifiedCount;

                // 1. Immediately remove billed policies from state
                const billedSet = new Set(matchedIds);
                setPolicies((prev) => prev.filter((p) => !billedSet.has(String(p._id))));

                // 2. Clear the upload/results panel
                resetUpload();

                // 3. Re-fetch from backend with explicit params to avoid stale-closure issue
                await fetchPolicies(filterMonth, filterYear);

                alert(`✅ ${billedCount} policies marked as billed and removed from Unbilled list!`);
            } else {
                alert('Failed to mark policies as billed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Error marking policies as billed.');
        } finally { setBilling(false); }
    };

    return (
        <>
            <Breadcrumb title="Unbilled Brokerage Reconciliation">
                <Typography component={Link} to="/" variant="subtitle2" color="inherit">Policy Management</Typography>
                <Typography variant="subtitle2" color="primary">Unbilled Brokerage</Typography>
            </Breadcrumb>

            <Grid container spacing={gridSpacing}>
                {/* ═══ LEFT — Unbilled Policies ═══ */}
                <Grid item xs={12} md={6}>
                    <Card elevation={4} sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <StorageIcon sx={{ color: '#fff', fontSize: 28 }} />
                            <Box>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Unbilled Policies</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{policies.length} policies</Typography>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                            <Box display="flex" gap={2} p={2} pb={1} flexWrap="wrap" alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel>Month</InputLabel>
                                    <Select value={filterMonth} label="Month" onChange={(e) => setFilterMonth(e.target.value)}>
                                        {MONTHS.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 110 }}>
                                    <InputLabel>Year</InputLabel>
                                    <Select value={filterYear} label="Year" onChange={(e) => setFilterYear(e.target.value)}>
                                        {YEARS.map((y) => <MenuItem key={y.value} value={y.value}>{y.label}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Chip label={`${policies.length} results`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                                {nullDateCount > 0 && filterMonth !== 'noDate' && (
                                    <Chip
                                        label={`⚠ ${nullDateCount} with no date`}
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                        sx={{ fontWeight: 600, cursor: 'pointer' }}
                                        onClick={() => { setFilterMonth('noDate'); setFilterYear(''); }}
                                        title="Click to view policies with no start date"
                                    />
                                )}
                            </Box>
                            {loadingPolicies ? (
                                <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
                            ) : policyError ? (
                                <Alert severity="error" sx={{ m: 2 }}>{policyError}</Alert>
                            ) : policies.length === 0 ? (
                                <Alert severity="info" sx={{ m: 2 }}>No unbilled policies found.</Alert>
                            ) : (
                                <TableContainer sx={{ maxHeight: 550 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow sx={headerSx}>
                                                <TableCell>#</TableCell>
                                                <TableCell>Company Name</TableCell>
                                                <TableCell>Policy Number</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>End Date</TableCell>
                                                <TableCell>Brokerage&nbsp;Amt</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {policies.map((p, i) => (
                                                <TableRow key={p._id || i} hover sx={{ '&:nth-of-type(even)': { backgroundColor: '#f5f7ff' } }}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>{p.companyName}</TableCell>
                                                    <TableCell><Chip label={p.policyNumber} size="small" variant="outlined" color="primary" sx={{ fontFamily: 'monospace' }} /></TableCell>
                                                    <TableCell>{fmtDate(p.startDate)}</TableCell>
                                                    <TableCell>{fmtDate(p.endDate)}</TableCell>
                                                    <TableCell>{p.brokerageAmount}</TableCell>
                                                    <TableCell><Chip label="Unbilled" size="small" color="warning" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* ═══ RIGHT — File Upload & Matching ═══ */}
                <Grid item xs={12} md={6}>
                    <Card elevation={4} sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <DescriptionIcon sx={{ color: '#fff', fontSize: 28 }} />
                            <Box>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>File Extractor & Matching</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Upload brokerage statement (PDF or Excel)</Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            {/* Upload Zone */}
                            <Box
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                sx={{
                                    border: `2px dashed ${dragOver ? '#00695c' : '#b0bec5'}`, borderRadius: 3, p: 4,
                                    textAlign: 'center', cursor: 'pointer',
                                    backgroundColor: dragOver ? '#e0f2f1' : '#fafafa', transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#00695c', backgroundColor: '#e8f5e9' }
                                }}
                            >
                                <UploadFileIcon sx={{ fontSize: 48, color: dragOver ? '#00695c' : '#90a4ae', mb: 1 }} />
                                <Typography variant="h6" color={dragOver ? '#00695c' : 'text.secondary'}>
                                    {pdfFile ? pdfFile.name : 'Drag & drop a file, or click to browse'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">PDF, Excel (.xlsx, .xls), CSV — max 20MB</Typography>
                                <input ref={fileRef} type="file" accept="application/pdf,.xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileInput} />
                            </Box>

                            {pdfFile && (
                                <Box mt={2} display="flex" alignItems="center" gap={1}>
                                    <Chip icon={<CheckCircleIcon />} label={pdfFile.name} color="success" variant="outlined" />
                                    <Button size="small" variant="outlined" color="error" onClick={resetUpload}>Remove</Button>
                                </Box>
                            )}

                            {uploadError && <Alert severity="warning" sx={{ mt: 2 }}>{uploadError}</Alert>}

                            {uploading && (
                                <Box textAlign="center" py={4}>
                                    <CircularProgress size={36} sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">Extracting & matching...</Typography>
                                </Box>
                            )}

                            {/* Summary */}
                            {summary && !uploading && (
                                <Box mt={3}>
                                    <Box display="flex" gap={2} flexWrap="wrap" mb={2} alignItems="center">
                                        <Chip
                                            icon={<CompareArrowsIcon />}
                                            label={`Total (Unique): ${summary.total}`}
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Chip
                                            icon={<ContentCopyIcon />}
                                            label={`Duplicate: ${summary.duplicates ?? 0}`}
                                            color="warning"
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Chip icon={<CheckCircleIcon />} label={`Matched: ${summary.matched}`} color="success" variant="filled" sx={{ fontWeight: 600 }} />
                                        {summary.alreadyBilled > 0 && (
                                            <Chip icon={<CheckCircleIcon />} label={`Already Billed: ${summary.alreadyBilled}`} color="info" variant="filled" sx={{ fontWeight: 600 }} />
                                        )}
                                        <Chip icon={<ErrorIcon />} label={`Not Found: ${summary.notFound}`} color="error" variant="filled" sx={{ fontWeight: 600 }} />
                                    </Box>
                                    {summary.duplicates > 0 && (
                                        <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                                            <strong>{summary.duplicates}</strong> duplicate policy number{summary.duplicates > 1 ? 's' : ''} found in the uploaded file and excluded from billing. Total unique policies: <strong>{summary.total}</strong>.
                                        </Alert>
                                    )}
                                    <Divider sx={{ mb: 2 }} />
                                </Box>
                            )}

                            {/* Results Table */}
                            {results.length > 0 && !uploading && (
                                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380, mt: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow sx={headerSx}>
                                                <TableCell>#</TableCell>
                                                <TableCell>Company Name</TableCell>
                                                <TableCell>Policy Number</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>End Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {results.map((r, i) => (
                                                <TableRow
                                                    key={i} hover
                                                    sx={{
                                                        '&:nth-of-type(even)': { backgroundColor: '#f1f8e9' },
                                                        ...(r.matchStatus === 'Not Found' && { backgroundColor: '#ffebee !important' })
                                                    }}
                                                >
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>{r.companyName}</TableCell>
                                                    <TableCell><Chip label={r.policyNumber} size="small" variant="outlined" color="primary" sx={{ fontFamily: 'monospace' }} /></TableCell>
                                                    <TableCell>{r.startDate || '—'}</TableCell>
                                                    <TableCell>{r.endDate || '—'}</TableCell>
                                                    <TableCell><StatusChip status={r.matchStatus} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Mark as Billed Button */}
                            {matchedIds.length > 0 && !uploading && (
                                <Box mt={3} textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        startIcon={<GavelIcon />}
                                        onClick={handleMarkBilled}
                                        disabled={billing}
                                        sx={{ px: 5, py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                                    >
                                        {billing ? 'Marking...' : `Mark ${matchedIds.length} Policies as Billed`}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default UnbilledReconciliation;
