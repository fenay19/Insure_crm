import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { convertToWords } from 'utils/currentDate';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { resetPrintDataForAdvanceOPDReceipt, setCloseBillingModal, setInitialStates } from 'reduxSlices/opdBillingStates';
import { get, remove } from 'api/api';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const AdvanceReciept = ({ closeModal, invoiceData, fetchInvoices }) => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const [company, setCompany] = useState({});
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  const reactToPrint = useReactToPrint({ contentRef });
  const { pathname } = useLocation();
  const img = localStorage.getItem('img');
  const navigate = useNavigate();
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(null);
  const [receiptList, setReceiptList] = useState(invoiceData?.history || []);

  const toggleHeader = () => setIsHeaderOpen(!isHeaderOpen);

  const handlePrint = () => reactToPrint();

  const handleSave = () => {
    toast.success('Saved Successfully');
    dispatch(setCloseBillingModal());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
    dispatch(setInitialStates());
    closeModal();
  };

  const handleDelete = async (index, rec) => {
    try {
      const historyId = rec._id;
      const invoiceId = invoiceData._id;

      const response = await remove(`invoiceRegistration/${invoiceId}/history/${historyId}`);

      console.log(response);

      if (response.success) {
        toast.success('Receipt deleted successfully');
        // Optionally update your local state
        setInvoiceData((prev) => ({
          ...prev,
          history: prev.history.filter((item) => item._id !== historyId)
        }));
      } else {
        toast.error(response.message || 'Failed to delete receipt');
      }

      fetchInvoices();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting receipt');
    }
  };

  useEffect(() => {
    async function fetchCompany() {
      try {
        const rawRefId = localStorage.getItem('refId');
        const refId = rawRefId?.replace(/^"|"$/g, '').trim();
        const response = await get('clientRegistration');

        if ((response.status === true || response.status === 'true') && Array.isArray(response.data)) {
          const companyData = response.data.find((c) => c._id === refId);
          if (companyData) setCompany(companyData);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    }

    fetchCompany();
  }, []);

  return (
    <Box>
      {/* ------------- RECEIPT LIST VIEW ------------- */}

      {showAll && (
        <>
          <Button onClick={() => setShowAll(false)} size="small" sx={{ ml: 6, my: 1, border: '1px solid #126078', color: '#126078' }}>
            Back to List
          </Button>

          <Button
            onClick={toggleHeader}
            color="primary"
            size="small"
            sx={{
              mb: 0,
              mx: 6,
              my: 1,
              border: '1px solid',
              borderColor: 'primary.main'
            }}
          >
            {isHeaderOpen ? 'Hide Header' : 'Show Header'}
          </Button>

          <div ref={contentRef}>
            {receiptList.map((rec, index) => (
              <div
                key={index}
                style={{
                  padding: '1.5rem 4rem',
                  borderRadius: '0px',
                  marginBottom: '3rem',
                  border: '1px dashed #ccc'
                }}
              >
                {isHeaderOpen && (
                  <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center', paddingY: 2 }}>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <img src={img} alt="Hospital Logo" style={{ maxHeight: '80px', objectFit: 'contain', marginBottom: '8px' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '1rem' }}>
                          {hospitalData?.hospitalName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                        <strong>Address :</strong> {company?.officeAddress}, {company?.city}, {company?.state} - {company?.pincode}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                        <strong>Contact:</strong> {company?.officialPhoneNo} | <strong>Email:</strong> {company?.officialMailId}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                        <strong>Website:</strong> {company?.website}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    RECEIPT
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ backgroundColor: '#126078', paddingX: 1.5, paddingY: 0.5, borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                        <strong>Receipt No :</strong> {invoiceData?.RecieptNo || 'N/A'}-{index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ backgroundColor: '#126078', paddingX: 1.5, paddingY: 0.5, borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                        <strong>Receipt Date :</strong> {invoiceData?.date?.slice(0, 10) || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

                <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', gap: '4px', color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}
                    >
                      <strong>Client Name:</strong> {invoiceData?.clientName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <strong>Product/Service:</strong> {invoiceData?.products.map((item) => item.product).join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                      <strong>GST:</strong> {invoiceData?.clientGst || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <strong>Email:</strong> {invoiceData?.clientEmail || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                      <strong>Address:</strong> {invoiceData?.clientAddress || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

                <TableContainer sx={{ marginBottom: '1.5rem' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#126078', height: '36px' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '8px' }}>Products</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '8px' }}>Paid Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ padding: '8px' }}>{invoiceData?.products.map((item) => item.product).join(', ')}</TableCell>
                        <TableCell sx={{ padding: '8px' }}>Rs {rec?.paidAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>
                          <Typography fontWeight={'bold'}>In Words: {convertToWords(rec?.paidAmount)}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </div>

          <Box sx={{ marginTop: '2rem', padding: '30px' }}>
            <Button
              variant="contained"
              sx={{ fontSize: '16px', fontWeight: 'bold', boxShadow: 2, backgroundColor: '#126078', color: 'white' }}
              onClick={handlePrint}
            >
              Print All Receipts
            </Button>
          </Box>
        </>
      )}

      {selectedReceiptIndex === null ? (
        <>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Advance Payment Receipts
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#126078' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Receipt No</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paid Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receiptList?.length > 0 ? (
                  receiptList.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${invoiceData?.RecieptNo || 'N/A'}-${index + 1}`}</TableCell>
                      <TableCell>{invoiceData?.date?.slice(0, 10) || 'N/A'}</TableCell>
                      <TableCell>₹{rec?.paidAmount}</TableCell>
                      <TableCell>
                        <IconButton color="primary" size="small" onClick={() => setSelectedReceiptIndex(index)} sx={{ mr: 1 }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDelete(index, rec)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Receipts Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: '2rem', padding: '30px', textAlign: 'center' }}>
            <Button variant="contained" sx={{ mr: 2, background: '#126078', color: 'white' }} onClick={() => setShowAll(true)}>
              Print All Receipts
            </Button>

            <Button variant="contained" sx={{ background: '#126078', color: 'white' }} onClick={closeModal}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          {/* ------------- SINGLE RECEIPT VIEW (Original Design) ------------- */}
          <Button
            onClick={() => setSelectedReceiptIndex(null)}
            size="small"
            sx={{ ml: 6, my: 1, border: '1px solid #126078', color: '#126078' }}
          >
            Back to List
          </Button>

          <Button
            onClick={toggleHeader}
            color="primary"
            size="small"
            sx={{
              mb: 0,
              mx: 6,
              my: 1,
              border: '1px solid',
              borderColor: 'primary.main'
            }}
          >
            {isHeaderOpen ? 'Hide Header' : 'Show Header'}
          </Button>

          <div ref={contentRef}>
            <div
              style={{
                padding: '1.5rem 4rem',
                borderRadius: '0px',
                marginBottom: '3rem',
                border: '1px dashed #ccc'
              }}
            >
              {isHeaderOpen && (
                <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center', paddingY: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <img src={img} alt="Hospital Logo" style={{ maxHeight: '80px', objectFit: 'contain', marginBottom: '8px' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '1rem' }}>
                        {hospitalData?.hospitalName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={8} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                      <strong>Address :</strong> {company?.officeAddress}, {company?.city}, {company?.state} - {company?.pincode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                      <strong>Contact:</strong> {company?.officialPhoneNo} | <strong>Email:</strong> {company?.officialMailId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                      <strong>Website:</strong> {company?.website}
                    </Typography>
                  </Grid>
                </Grid>
              )}

              <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  RECEIPT
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ backgroundColor: '#126078', paddingX: 1.5, paddingY: 0.5, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                      <strong>Receipt No :</strong> {invoiceData?.RecieptNo || 'N/A'}-{selectedReceiptIndex + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#126078', paddingX: 1.5, paddingY: 0.5, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                      <strong>Receipt Date :</strong> {invoiceData?.date?.slice(0, 10) || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ display: 'flex', gap: '4px', color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <strong>Client Name:</strong> {invoiceData?.clientName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <strong>Product/Service:</strong> {invoiceData?.products.map((item) => item.product).join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                    <strong>GST:</strong> {invoiceData?.clientGst || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <strong>Email:</strong> {invoiceData?.clientEmail || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                    <strong>Address:</strong> {invoiceData?.clientAddress || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <hr style={{ borderColor: '#ddd', margin: '1rem 0' }} />

              <TableContainer sx={{ marginBottom: '1.5rem' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#126078', height: '36px' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '8px' }}>Products</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '8px' }}>Paid Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ padding: '8px' }}>{invoiceData?.products.map((item) => item.product).join(', ')}</TableCell>
                      <TableCell sx={{ padding: '8px' }}>Rs {receiptList[selectedReceiptIndex]?.paidAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>
                        <Typography fontWeight={'bold'}>
                          In Words: {convertToWords(receiptList[selectedReceiptIndex]?.paidAmount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <Box sx={{ marginTop: '2rem', padding: '30px' }}>
            <Button
              variant="contained"
              sx={{ fontSize: '16px', fontWeight: 'bold', boxShadow: 2, backgroundColor: '#126078', color: 'white' }}
              onClick={handlePrint}
            >
              Print This Receipt
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdvanceReciept;
