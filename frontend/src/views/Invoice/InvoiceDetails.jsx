import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { get } from 'api/api';
import mirailogo from '../../assets/images/mirai.png';
import { IoIosPhonePortrait } from 'react-icons/io';
import { IoMail } from 'react-icons/io5';
import { SiSimilarweb } from 'react-icons/si';
import mirai from '../../assets/images/mirai.png';

const InvoiceDetails = ({ closeModal, invoiceData }) => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const { PrintDataForAdvanceOPDReceipt } = useSelector((state) => state.opdBillingStates);
  const { hospitalData } = useSelector((state) => state.hospitalData);

  const dispatch = useDispatch();

  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });
  const { pathname } = useLocation();

  // const [totals, setTotals] = useState({});

  const navigate = useNavigate();

  const [company, setCompany] = useState({});

  //   useEffect(() => {
  //    async function fetchCompany() {
  //   try {
  //     const refId = localStorage.getItem('refId')?.trim();
  //     console.log('Fetched refId:', refId);

  //     const response = await get('clientRegistration');
  //     console.log('Response data:', response.data);

  //     if ((response.status === true || response.status === 'true') && Array.isArray(response.data)) {
  //       const companyData = response.data.find((c) => c._id?.toString().trim() === refId);
  //       console.log('Matched companyData:', companyData);

  //       if (companyData) {
  //         setCompany(companyData);
  //       } else {
  //         console.warn('Company data not found for refId:', refId);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Error fetching company:', err);
  //   }
  // }

  //     fetchCompany();
  //   }, []);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const rawRefId = localStorage.getItem('refId');
        const refId = rawRefId?.replace(/^"|"$/g, '').trim(); // fix here

        // console.log('Sanitized refId:', refId);

        const response = await get('clientRegistration');
        // console.log('API Response:', response.data);

        if ((response.status === true || response.status === 'true') && Array.isArray(response.data)) {
          const companyData = response.data.find((c) => c._id === refId);
          // console.log('Matched companyData:', companyData);

          if (companyData) {
            setCompany(companyData);
          } else {
            console.warn('Company not found for refId:', refId);
          }
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    }

    fetchCompany();
  }, []);

  const handlePrint = () => {
    reactToPrint();
    setTimeout(() => {
      dispatch(setCloseBillingModal());
    }, 1000);
    // if (pathname !== '/confirm-patientForm') {
    //   navigate('/confirm-patientForm');
    // }
    dispatch(setInitialStates());
  };

  function handleSave() {
    toast.success('Saved Successfully');
    dispatch(setCloseBillingModal());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
    dispatch(setInitialStates());

    // navigate('/confirm-patientForm');
  }

  // for adding header  and toggling it
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const toggleHeader = () => {
    setIsHeaderOpen(!isHeaderOpen);
  };

  const paymentDetails = invoiceData?.paymentDetails || {};

  const containerStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '2rem',
    fontSize: '0.875rem',
    fontFamily: 'sans-serif',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  };

  const logoStyle = {
    width: '250px',
    height: 'auto'
  };

  const rightHeaderStyle = {
    textAlign: 'right',
    lineHeight: '1.25rem',
    fontSize: '0.875rem',
    color: '#000',
    marginLeft: '5rem'
  };

  const iconTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontWeight: 'bold',
    color: '#000'
  };

  const linkStyle = {
    color: '#000',
    textDecoration: 'none'
  };

  const gstStyle = {
    fontWeight: 'bold',
    marginRight: '12.5rem'
  };

  const titleStyle = {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#126078',
    marginBottom: '1rem',
    fontSize: '3rem',
    marginRight: '5rem'
  };

  const grid3ColsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    rowGap: '1.25',
    columnGap: '2rem',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  };

  const tableStyle = {
    width: '100%',
    borderTop: '3px solid #126078',
    borderBottom: '1px solid #126078',
    textAlign: 'center',
    marginBottom: '1rem',
    borderCollapse: 'collapse',
    fontSize: '0.875rem'
  };

  const tableHeadStyle = {
    backgroundColor: '#126078',
    fontWeight: 'bold',
    borderBottom: '3px solid #126078',
    color: '#fff'
  };

  const thStyle = {
    padding: '0.25rem',
    borderBottom: '3px solid #126078'
  };

  const containerStyle1 = {
    width: '100%',
    //   borderBottom: '5px solid #1e40af',
    textAlign: 'center',
    //   marginBottom: '1rem',

    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem'
  };

  const labelTextStyle = {
    fontWeight: 'bold',
    fontSize: '0.75rem'
    //   color: '#1e40af',
  };

  const amountWordsStyle = {
    // borderBottom: '3px solid #1e40af',
    marginBottom: '1rem',
    color: '#126078',
    fontWeight: '1000',
    //   marginTop: '0.5rem',
    paddingTop: '0.5rem',
    fontSize: '0.8rem',
    display: 'flex',
    flexDirection: 'column'
  };

  const bottomFlexStyle = {
    borderTop: '1px solid #d1d5db',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.25rem',
    marginBottom: '0.5rem',
    marginTop: '2rem',
    fontSize: '0.75rem'
  };

  const termsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto'
  };

  const termsHeaderStyle = {
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '600',
    fontSize: '1.125rem',
    borderBottom: '1px solid #d1d5db'
  };

  const termsBodyStyle = {
    padding: '1.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    textAlign: 'left',
    width: '100%',
    paddingLeft: '1.5rem'
    // paddingRight: '3rem'
  };

  const bankDetailsContainerStyle = {
    marginTop: '3rem'
  };

  const bankDetailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem'
  };

  const bankInfoStyle = {
    color: '#111827',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#f3f4f6'
  };

  const printButtonStyle = {
    backgroundColor: '#16a34a',
    color: '#fff',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '2rem'
  };

  const printButtonHoverStyle = {
    backgroundColor: '#15803d'
  };
  const pdfButtonStyle = {
    backgroundColor: '#126078',
    color: '#fff',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '2rem'
  };

  const pdfButtonHoverStyle = {
    backgroundColor: '#3b82f6'
  };

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;

    // normalize slashes
    const normalized = logoPath.replace(/\\/g, '/');

    // replace public/images with uploads
    const urlPath = normalized.replace('public/images', 'uploads');

    // prepend backend root URL, not /api/
    // console.log(`http://localhost:5050/api/${urlPath}`);

    return `${REACT_APP_API_URL}${urlPath}`;
  };

  const savedImg = localStorage.getItem('img');

  console.log(invoiceData);

  return (
    <>
      <Box>
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
        <div
          ref={contentRef}
          style={{
            padding: '0.5rem 4rem',
            borderRadius: '0px'
          }}
        >
          <div style={containerStyle}>
            {isHeaderOpen && (
              <div style={headerStyle}>
                <div>
                  {/* <img src={logoPreview instanceof File ? URL.createObjectURL(logoPreview) : getLogoUrl(form.companyLogo)} alt="Logo" style={logoStyle} /> */}
                  <img src={savedImg} alt="Logo" style={logoStyle} />
                </div>
                <div style={rightHeaderStyle}>
                  <p style={iconTextStyle}>
                    <strong style={{ color: '#000' }}>Address:- </strong>
                    <p style={{ ...linkStyle, color: '#555', fontWeight: 'normal', display: 'flex' }}>
                      {company.officeAddress || 'N/A'} {company.city || 'N/A'} {company.state || 'N/A'} {company.pincode || 'N/A'}
                    </p>
                  </p>
                  <p style={iconTextStyle}>
                    <strong style={{ color: '#000' }}>Website:- </strong>
                    <a href={company?.website || '#'} style={{ ...linkStyle, color: '#555', fontWeight: 'normal' }}>
                      {company.website || 'N/A'}
                    </a>
                  </p>

                  <p style={iconTextStyle}>
                    <strong style={{ color: '#000' }}>Contact:- </strong>
                    <span style={{ color: '#555', fontWeight: 'normal' }}>
                      {[company.officialPhoneNo, company.altPhoneNo].filter(Boolean).join(', ') || 'N/A'}
                    </span>
                  </p>

                  <p style={iconTextStyle}>
                    <strong style={{ color: '#000' }}>Mail:- </strong>
                    <span style={{ color: '#555', fontWeight: 'normal' }}>{company.officialMailId || 'N/A'}</span>
                  </p>

                  <p style={iconTextStyle}>
                    <strong style={{ color: '#000' }}>GST No:- </strong>
                    <span style={{ color: '#555', fontWeight: 'normal' }}>{company.gstNo || 'N/A'}</span>
                  </p>
                </div>
              </div>
            )}

            <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
                {invoiceData?.gstType == 'non-gst' ? 'INVOICE' : 'TAX INVOICE'}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                    <strong>Invoice Date :</strong> {invoiceData?.date ? invoiceData.date.slice(0, 10) : 'N/A'}
                  </Typography>
                </Box>
                &nbsp; &nbsp; &nbsp;
                <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                    <strong>Invoice No :</strong> {invoiceData?.invoiceNumber || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

            {/* <h1 style={titleStyle}>INVOICE</h1> */}
            {/* <div style={grid3ColsStyle}> */}
            <div>
              <div>
                <p>
                  <strong>Name:</strong> {invoiceData.clientName || '-'}
                </p>
                <p>
                  <strong>GST:</strong> {invoiceData.clientGst || '-'}
                </p>
                <p>
                  <strong>Email:</strong> {invoiceData.clientEmail || '-'}
                </p>
                <p>
                  <strong>Address:</strong> {invoiceData.clientAddress || '-'} , {invoiceData.clientCity || '-'} ,
                  {invoiceData.clientPincode || '-'} , {invoiceData.clientState || '-'} , {invoiceData.clientCountry || '-'}
                </p>
              </div>
            </div>

            <table style={tableStyle}>
              <thead style={tableHeadStyle}>
                <tr>
                  <th style={thStyle}>No.</th>
                  <th style={thStyle}>PRODUCT / SERVICE NAME</th>

                  <th style={thStyle}>QTY</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>UNIT PRICE</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.products && invoiceData.products.length > 0 ? (
                  invoiceData.products.map((p, i) => (
                    <tr key={p.id || i} style={{ borderBottom: '3px solid #1e40af' }}>
                      <td style={{ padding: '0.25rem' }}>{i + 1}</td>
                      <td style={{ padding: '0.25rem' }}>
                        {p.product || '-'} ( {p.description || '-'} ){' '}
                      </td>

                      <td style={{ padding: '0.25rem' }}>{p.quantity || '-'}</td>
                      <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹{(p.rate || 0).toFixed(2)}</td>
                      <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹{(p.productAmount || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '0.25rem' }}>
                      No products added.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={containerStyle1}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <div style={labelTextStyle}>TOTAL AFTER DISCOUNT&nbsp;:</div>
                  <div>₹ {(invoiceData.totalAmount || 0).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <div style={labelTextStyle}>SUB TOTAL&nbsp;:</div>

                  <div>₹ {(invoiceData.subTotal || 0).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.9rem' }}>
                  <div style={labelTextStyle}>DISCOUNT ({invoiceData.discount || 0}%)&nbsp;:</div>
                  <div>₹ {(invoiceData.discountAmount || 0).toFixed(2)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                {/* GST Type Check */}
                {invoiceData.gstType === 'igst' ? (
                  <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                    <div style={labelTextStyle}>IGST ({invoiceData.igstPercent || 0}%)&nbsp;:</div>
                    <div>₹ {(invoiceData.igstAmount || 0).toFixed(2)}</div>
                  </div>
                ) : invoiceData.gstType === 'gst' ? (
                  <>
                    <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                      <div style={labelTextStyle}>CGST ({invoiceData.cgstIgstPercentage || 0}%)&nbsp;:</div>
                      <div>₹ {(invoiceData.cgstIgstAmount || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                      <div style={labelTextStyle}>SGST ({invoiceData.sgstPercentage || 0}%)&nbsp;:</div>
                      <div>₹ {(invoiceData.sgstAmount || 0).toFixed(2)}</div>
                    </div>
                  </>
                ) : null}

                {/* Grand Total */}
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  <div style={labelTextStyle}>GRAND TOTAL&nbsp;:</div>
                  <div>₹ {(invoiceData.roundUp || invoiceData.totalAmount || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={amountWordsStyle}>
                <p>Amount in Words &nbsp;:</p>
                <p>
                  {convertToWords(invoiceData.roundUp || invoiceData.totalAmount || 0)} {invoiceData.currency || 'INR'}{' '}
                  {invoiceData.currency === 'INR' ? 'Rupees' : ''}
                  &nbsp;&nbsp;&nbsp;{invoiceData.currency === 'INR' ? 'Only' : ''}
                </p>
              </div>
              {/* <Box sx={{ marginTop: '0.5rem', width: '35%' }}>
                {' '}
                <Table size="small" sx={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                   <TableHead>
                    <TableRow sx={{ height: '28px' }}>
                      {' '}
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Payment Mode
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Transaction ID
                      </TableCell>
                    </TableRow>
                  </TableHead> 
                  <TableBody>
                    <TableRow sx={{ height: '25px' }}>
                      {' '}
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {paymentDetails.paymentMode || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {paymentDetails?.transactionId || 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box> */}
            </div>

            <div>
              <div style={bottomFlexStyle}>
                <p style={{ margin: '0 auto' }}>THIS IS A SYSTEM GENERATED INVOICE</p>
              </div>

              <div style={termsContainerStyle}>
                <div style={termsHeaderStyle}>Terms & Conditions</div>
                <div style={termsBodyStyle}>
                  <ol>
                    <li>Full payment is due within 8 days from the date of invoice unless otherwise agreed in writing.</li>
                    <li>A late fee of 1.5% per month may be applied to overdue invoices.</li>
                    <li>Payment can be made via Bank Transfer / UPI / Online Payment Portal, etc. Bank details are mentioned below.</li>
                    <li>
                      Any disputes related to this invoice must be reported within 7 days of the invoice date. Failure to do so will be
                      deemed as acceptance.
                    </li>
                    <li>
                      No cancellations or refunds are allowed once services are rendered or goods are delivered, unless agreed in writing.
                    </li>
                    <li> Any legal disputes shall be subject to the jurisdiction of courts in Nagpur, Maharashtra</li>
                  </ol>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#2563eb',
                  marginBottom: '1rem'
                }}
              >
                Bank Details
              </h2>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #000'
                }}
              >
                <tbody>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Name on Bank Account</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.accountName || '-'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Bank Account Number</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.accountNumber || '-'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Bank Name</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.bankName || '-'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Branch Name</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.branchName || '-'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>IFSC Code</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.IFSCcode || '-'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>PAN Card Number</th>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>
                      {invoiceData.selectedBankId.PanNo || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5rem', textAlign: 'center' }}>
              <button
                style={printButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                onClick={handlePrint}
              >
                Print Invoice
              </button>

              <button
                style={pdfButtonStyle}
                title="Will open browser print dialog — choose 'Save as PDF'"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
                onClick={handleSave}
              >
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default InvoiceDetails;
