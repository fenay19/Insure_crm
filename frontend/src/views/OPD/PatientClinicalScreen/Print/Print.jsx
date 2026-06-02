import React, { useRef } from 'react';
import './Print.css';
import { Box, Button } from '@mui/material';
import REACT_APP_API_URL, { get } from 'api/api';
import PrintChiefComplaint from './PrintChiefComplaint';
import PrintHistory from './PrintHistory';
import PrintExamination from './PrintExamination';
import PrintProvisionalDiagnosis from './PrintProvisionalDiagnosis';
import PrintMedicalPrescription from './PrintMedicalPrescription';
import PrintVitals from './PrintVitals';
import { useEffect, useState } from 'react';
import PrintPatientDetail from './PrintPatientDetail';
import { LocalPrintshop, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';
import { retrieveToken } from 'api/api';
import PrintOrders from './PrintOrders';
import PrintFinalDiagnosis from './PrintFinalDiagnosis';
import PrintHistoryPresentIllness from './PrintHistoryPresentIllness';
import PrintFollowUp from './PrintFollowUp';
import { useSelector } from 'react-redux';
import PrintGlassPrescription from './GlassPrescription';
import { useReactToPrint } from 'react-to-print';
import VisionRemarkAdvice from './VisionRemark';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLazyGetPatientCrossConsultationQuery } from 'services/endpoints/Orders/crossConsultation';

const Print = ({ printType }) => {
  const token = retrieveToken();
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loginRole, setLoginRole] = useState(localStorage.getItem('loginRole'));
  const [doctorDetail, setDoctorDetail] = useState(JSON.parse(localStorage.getItem('loginData')));
  const [consultPrintOption, setConsultPrintOption] = useState(JSON.parse(localStorage.getItem('drConsultPrint')));
  const [patientData, setPatientData] = useState(JSON.parse(localStorage.getItem('patientConsult')));
  const [drMenu, setDrMenu] = useState(JSON.parse(localStorage.getItem('drConsult')));
  const [hospitalDetail, setHospitalDetail] = useState(JSON.parse(localStorage.getItem('hospiData')));
  const patient = useSelector((state) => state.patient.selectedPatient);
  const [investigation, setInvestigation] = useState({
    pathology: [],
    radiology: [],
    otherDiagnostic: []
  });
  const baseUrl = REACT_APP_API_URL?.replace('/api/', '');

  const [patientChiefComplaint, setPatientChiefComplaint] = useState([]);
  const [patientProvisionalDiagnosis, setPatientProvisionalDiagnosis] = useState([]);
  const [patientFinalDiagnosis, setPatientFinalDiagnosis] = useState([]);
  const [procedure, setProcedure] = useState([]);
  const [instruction, setInstruction] = useState([]);
  const [labRadiology, setLabRadiology] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [patientExamination, setPatientExamination] = useState({});
  const [history, setHistory] = useState({});
  const [medicalPrescription, setMedicalPrescription] = useState([]);
  const [followUp, setFollowUp] = useState([]);
  const [presentIllness, setPresentIllness] = useState([]);
  const [glassPrescription, setGlassPrescripition] = useState([]);
  const [remarkData, setRemarkData] = useState([]);
  const contentRef = useRef(null);
   const [triggerGetPatientCrossConsultation, { data: patiantCrossConsultant }] = useLazyGetPatientCrossConsultationQuery();
  const reactToPrint = useReactToPrint({ contentRef });

  useEffect(() => {
    setError(false);
    axios
      .get(`${REACT_APP_API_URL}opd/all-patient-details-to-print/${patientData?._id}/${patientData?.consultantId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        const lastData = response?.data?.patientData?.[response?.data?.patientData?.length - 1];
        setPatientChiefComplaint(
          lastData?.chiefComplaint?.length > 0 ? lastData?.chiefComplaint?.[lastData?.chiefComplaint?.length - 1]?.chiefComplaint : []
        );
        setPresentIllness(
          lastData?.presentIllness?.length > 0 ? lastData?.presentIllness?.[lastData?.presentIllness?.length - 1]?.presentIllness : []
        );
        setFollowUp(lastData?.followUp?.length > 0 ? lastData?.followUp?.[lastData?.followUp?.length - 1] : []);
        setPatientProvisionalDiagnosis(
          lastData?.provisionalDiagnosis?.length > 0
            ? lastData?.provisionalDiagnosis?.[lastData?.provisionalDiagnosis?.length - 1]?.diagnosis
            : []
        );
        setPatientFinalDiagnosis(
          lastData?.finalDiagnosis?.length > 0 ? lastData?.finalDiagnosis?.[lastData?.finalDiagnosis?.length - 1]?.diagnosis : []
        );
        setProcedure(lastData?.procedure?.length > 0 ? lastData?.procedure?.[lastData?.procedure?.length - 1] : []);
        setInstruction(lastData?.instruction?.length > 0 ? lastData?.instruction?.[lastData?.instruction?.length - 1]?.instruction : []);
        setLabRadiology(
          lastData?.labRadiology?.length > 0 ? lastData?.labRadiology?.[lastData?.labRadiology?.length - 1]?.labRadiology : []
        );
        setVitals(lastData?.vitals?.length > 0 ? lastData?.vitals?.[lastData?.vitals?.length - 1]?.vitals : []);
        setPatientExamination(lastData?.examination?.length > 0 ? lastData?.examination?.[lastData?.examination?.length - 1] : []);
        setHistory(lastData?.history?.length > 0 ? lastData?.history?.[lastData?.history?.length - 1] : []);

        setLoader(false);
      })
      .catch((error) => {
        setError(true);
        setLoader(false);
      });

    document.getElementById('bodyId').style.zoom = '1';

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          destinationLanguage: 'hi',
          layout: window.google.translate.TranslateElement?.InlineLayout?.SIMPLE
        },
        'google_translate_element'
      );
    };

    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.type = 'text/javascript';
    googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(googleTranslateScript);

    return () => {
      document.head.removeChild(googleTranslateScript);
    };
  }, []);
  

  useEffect(() => {
    (async () => {
      try {
        triggerGetPatientCrossConsultation(patient?.patientId?._id)
        const [medicalPrescriptionData, glassPrescriptionData, remarkData, vital] = await Promise.allSettled([
          get(`patient-medical-prescription/${patient?.patientId?._id}`),
          get(`patient-glass-prescription/${patient?.patientId?._id}`),
          get(`patient-glass-prescription/remark/${patient?.patientId?._id}`),
          get(`form-setup/vital-master/get/${patient?.patientId?._id}`)
        ]);
        // Optional: handle success/failure cases
        if (medicalPrescriptionData.status === 'fulfilled') {
          const res = medicalPrescriptionData?.value?.data ?? [];
          setMedicalPrescription(res);
        } else {
          console.error('Error fetching medical prescription:', medicalPrescriptionData.reason);
        }
        if (vital.status === 'fulfilled') {
          const res = vital?.value?.data ?? [];
          setVitals(res);
        } else {
          console.error('Error fetching medical prescription:', medicalPrescriptionData.reason);
        }

        if (glassPrescriptionData.status === 'fulfilled') {
          const res = glassPrescriptionData?.value?.data ?? [];
          setGlassPrescripition(res);
        } else {
          console.error('Error fetching glass prescription:', glassPrescriptionData.reason);
        }
        if (remarkData.status === 'fulfilled') {
          const res = remarkData?.value?.data ?? [];
          if (patient) {
            setRemarkData(res);
          } else {
            setRemarkData([]);
          }
        } else {
          console.error('Error fetching glass prescription:', glassPrescriptionData.reason);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    })();
  }, [patient]);

  useEffect(() => {
    if (!patient?.patientId?._id) return;

    const patientId = patient.patientId._id;

    const endpoints = [
      `patient-pathology/${patientId}`,
      `patient-radiology/${patientId}`,
      `patient-diagnostics/${patientId}`,
      `patient-procedure/${patientId}`,
      `patient-instruction/${patientId}`
    ];

    const fetchAllData = async () => {
      try {
        const [pathologyRes, radiologyRes, diagnosticsRes, procedureRes, instructionRes] = await Promise.all(
          endpoints.map((url) => get(url))
        );

        setInvestigation({
          pathology: pathologyRes?.data ?? [],
          radiology: radiologyRes?.data ?? [],
          otherDiagnostic: diagnosticsRes?.data ?? []
        });

        setProcedure(procedureRes?.data);
        setInstruction(instructionRes?.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchAllData();
  }, [patient]);

  const handlePrint = () => {
    reactToPrint();
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('getOPDPrint');

    html2canvas(input, {
      scale: 3, // High resolution rendering
      useCORS: true // Allow image loading from external sources if needed
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Get canvas dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF with same dimensions in px
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'l' : 'p',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('Patient_EMR_Crisp.pdf');
    });
  };

  const mergedInvestigations = [
    ...(investigation?.pathology?.pathology || []),
    ...(investigation?.radiology?.radiology || []),
    ...(investigation?.otherDiagnostic?.diagnostics || [])
  ];

  const mergedInstructions = instruction.flatMap((item) => item?.instruction || []);

  return (
    <>
      {loader ? (
        <div>loading</div>
      ) : (
        <div>
          <div className="languagePrint">
            <div id="google_translate_element"></div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <Button onClick={handlePrint} variant="contained" color="primary">
                <LocalPrintshop />
                Print
              </Button>

              <Button onClick={handleDownloadPDF} variant="contained" color="secondary">
                <PictureAsPdf />
                PDF
              </Button>
            </div>
          </div>

          <div
            ref={contentRef}
            style={{ padding: '20px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#000' }}
            id="getOPDPrint"
          >
            {/* ✅ Header Section */}
            {consultPrintOption?.includes('With Header') && hospitalDetail?.headerImage?.data && (
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <img
                  src={`${REACT_APP_API_URL?.replace('/api/', '')}/images/${hospitalDetail?.headerImage?.data}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    marginBottom: '4px'
                  }}
                  alt="Hospital Header"
                />
                <hr style={{ border: '1px solid #333', margin: '4px 0' }} />
              </Box>
            )}

            {/* ✅ Patient Details */}
            <PrintPatientDetail />

            {/* ✅ Conditional Print Content */}
            {error ? (
              <div>
                {printType === 'medical prescription' ? (
                  <>
                    {medicalPrescription?.length > 0 && <PrintMedicalPrescription medicalPrescription={medicalPrescription} />}
                    {glassPrescription?.length > 0 && <PrintGlassPrescription glassPrescription={glassPrescription} />}
                    {remarkData?.length > 0 && (
                      <VisionRemarkAdvice visionAdvice={remarkData?.[0]?.visionAdvice} visionRemark={remarkData?.[0]?.visionRemark} />
                    )}
                  </>
                ) : (
                  <>
                    <PrintChiefComplaint patientChiefComplaint={patientChiefComplaint} />
                    {/* <PrintHistoryPresentIllness presentIllness={presentIllness} /> */}
                    <PrintHistory history={history} />
                    <PrintExamination patientExamination={patientExamination} />
                    <PrintMedicalPrescription medicalPrescription={medicalPrescription} />
                    <PrintProvisionalDiagnosis patientProvisionalDiagnosis={patientProvisionalDiagnosis} />
                    <PrintFinalDiagnosis patientFinalDiagnosis={patientFinalDiagnosis} />
                    <PrintFollowUp followUp={followUp} />
                    <PrintOrders investigation={mergedInvestigations} procedure={procedure} crossConsultant={patiantCrossConsultant} instruction={mergedInstructions}  />
                   
                    <PrintVitals vitals={vitals} />

                  </>
                )}
              </div>
            ) : (
              <h3 style={{ color: 'red', marginTop: '20px' }}>Something went wrong. Please try again later...</h3>
            )}

            {/* ✅ Doctor Sign-off Footer */}
            <Box sx={{ textAlign: 'right', mt: 4 }}>
              {doctorDetail?.documents?.sign && (
                <img src={doctorDetail?.documents?.sign} alt="Doctor's Signature" style={{ height: '50px', marginBottom: '4px' }} />
              )}
              <p>
                {doctorDetail?.basicDetails?.prefix}. {doctorDetail?.basicDetails?.firstName} {doctorDetail?.basicDetails?.lastName}
              </p>
              <p>
                {doctorDetail?.basicDetails?.department}, {doctorDetail?.basicDetails?.designation}
              </p>
              <p>
                {`${new Date().toLocaleDateString('en-GB')}`} -{' '}
                {`${new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}`}
              </p>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default Print;
