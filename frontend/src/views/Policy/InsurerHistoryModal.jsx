import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PolicyIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { get } from '../../api/api';

const InsurerHistoryModal = ({ open, onClose, insurerName }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && insurerName) {
      fetchInsurerHistory();
    }
    return () => {
      setData(null);
      setExpandedCards({});
      setError('');
    };
  }, [open, insurerName]);

  const fetchInsurerHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await get(`policyDetail/insurer-history?insurerName=${encodeURIComponent(insurerName)}`);
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'No data found for this insurer');
        setData(null);
      }
    } catch (err) {
      console.error('Error fetching insurer history:', err);
      setError('Failed to load insurer history');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '₹0.00';
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Color palette for FY cards
  const cardColors = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', text: '#fff' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* ───── Header ───── */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2.5,
          px: 3
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            Insurer History
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
            {insurerName || '—'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress size={48} />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              {error}
            </Typography>
          </Box>
        )}

        {/* Data Loaded */}
        {!loading && data && (
          <>
            {/* Summary Strip */}
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                p: 2,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e0e5ec 0%, #f5f7fa 100%)',
                border: '1px solid #e0e0e0'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Policies
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                  {data.totalPolicies}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Financial Years
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                  {data.financialYears?.length || 0}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Premium
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f3460' }}>
                  {formatCurrency(data.financialYears?.reduce((sum, fy) => sum + (fy.totalPremium || 0), 0))}
                </Typography>
              </Box>
            </Paper>

            {/* FY Cards */}
            {data.financialYears?.length > 0 ? (
              data.financialYears.map((fy, index) => {
                const color = cardColors[index % cardColors.length];
                const isExpanded = !!expandedCards[index];

                return (
                  <Card
                    key={fy.financialYearId || index}
                    elevation={isExpanded ? 6 : 2}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { elevation: 4, transform: 'translateY(-1px)' }
                    }}
                  >
                    {/* ── Card Header (clickable) ── */}
                    <CardActionArea onClick={() => toggleCard(index)} sx={{ p: 0 }}>
                      <Box
                        sx={{
                          background: color.bg,
                          color: color.text,
                          px: 3,
                          py: 2.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CalendarTodayIcon sx={{ fontSize: 28 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              FY {fy.fyLabel}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Click to {isExpanded ? 'collapse' : 'view'} details
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip
                              icon={<PolicyIcon sx={{ color: `${color.text} !important`, fontSize: 18 }} />}
                              label={`${fy.count} ${fy.count === 1 ? 'Policy' : 'Policies'}`}
                              sx={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                color: color.text,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                '& .MuiChip-icon': { color: color.text }
                              }}
                            />
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                              Net Premium
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {formatCurrency(fy.totalPremium)}
                            </Typography>
                          </Box>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Box>
                      </Box>
                    </CardActionArea>

                    {/* ── Card Body (collapsible) ── */}
                    <Collapse in={isExpanded} timeout={400}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ overflowX: 'auto' }}>
                          <Table size="small" sx={{ minWidth: 900 }}>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f0f2f5' }}>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>SN</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>Customer Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>Policy Number</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>Start Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>End Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }} align="right">
                                  Net Premium
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }} align="right">
                                  Total Amount
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {fy.policies.map((policy, pIndex) => (
                                <TableRow
                                  key={policy._id || pIndex}
                                  hover
                                  sx={{
                                    '&:nth-of-type(even)': { backgroundColor: '#fafbfc' },
                                    '&:hover': { backgroundColor: '#e8f0fe' }
                                  }}
                                >
                                  <TableCell sx={{ fontSize: '0.8rem' }}>{pIndex + 1}</TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem', maxWidth: 200, wordBreak: 'break-word' }}>
                                    {policy.cutomerName || '—'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                    {policy.policyNumber || '—'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem' }}>{policy.insDepartment || '—'}</TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem' }}>
                                    {formatDate(policy.startDate || policy.tpStartDate || policy.odStartDate)}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem' }}>
                                    {formatDate(policy.endDate || policy.tpEndDate || policy.odEndDate)}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }} align="right">
                                    {formatCurrency(policy.netPremium)}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }} align="right">
                                    {formatCurrency(policy.totalAmount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {/* FY Total Row */}
                              <TableRow sx={{ backgroundColor: '#e8eaf6' }}>
                                <TableCell colSpan={6} sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                  <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                  FY {fy.fyLabel} Total
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }} align="right">
                                  {formatCurrency(fy.totalPremium)}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }} align="right">
                                  {formatCurrency(fy.totalAmount)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </CardContent>
                    </Collapse>
                  </Card>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No policy history found for this insurer
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* ───── Footer ───── */}
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
        <Button variant="contained" onClick={onClose} sx={{ borderRadius: 2, px: 4 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InsurerHistoryModal;
