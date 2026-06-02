import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrintChiefComplaint = () => {
  const [chiefComplaintsData, setChiefComplaintsData] = useState({});
  const [painChiefComplaint, setPainChiefComplaint] = useState({});

  const patientData = useSelector((state) => state?.patient?.selectedPatient);

  const getPatientChiefComplaints = async () => {
    try {
      const chiefComplaintUrl = `patient-chief-complaint/chiefComplainByConsultantAndPatient/${patientData?.consultantId}/${patientData?._id}`;
      const painComplaintUrl = `pain-patient-chief-complaint/${patientData?.patientId?._id}`;

      // Make both API calls in parallel
      const [chiefResponse, painResponse] = await Promise.all([get(chiefComplaintUrl), get(painComplaintUrl)]);

      console.log('Paint', painResponse);
      // Handle the chief complaint response
      if (chiefResponse?.chiefComplaints || painResponse?.data) {
        setChiefComplaintsData(chiefResponse?.chiefComplaints);
        setPainChiefComplaint(painResponse?.data?.[0]?.chiefComplaint);
      } else {
        console.warn('No chief complaints found for the given patient and consultant');
        setChiefComplaintsData([]);
        setPainChiefComplaint([]);
      }

      // You can use painResponse here as needed, e.g., log or store in state
    } catch (error) {
      console.error('Error fetching chief complaints:', error);
      setChiefComplaintsData([]);
      alert('Failed to fetch chief complaints. Please try again later.');
    }
  };
  console.log('Pain complaint response:', painChiefComplaint);

  useEffect(() => {
    if (patientData?.consultantId && patientData?._id) {
      getPatientChiefComplaints();
    }
  }, [patientData]);

  return (
    <Box className="printDataSection printDataSectionMargin notranslate" style={{ flexDirection: 'column' }}>
      <div className="printHead !important">
        <h5>Chief Complaints: </h5>
      </div>

      <TableContainer style={{ marginTop: '1rem' }}>
        <Table style={{ width: '100%' }}>
          <TableHead
            style={{
              backgroundColor: '#ffff',
              color: '#000',
              fontWeight: '600',
              borderBottom: '1px solid #ccc',
              textTransform: 'uppercase'
            }}
          >
            <TableRow>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                <span id="tableHeader">Chief Complaint</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                {/* Since */}
                <span id="tableHeader">Since</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                {/* Treatment */}
                <span id="tableHeader">Treatment</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                <span id="tableHeader">Symptoms</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                <span id="tableHeader">Location</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                <span id="tableHeader">Description</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: 'white',
                  color: '#000',
                  border: '1px solid #ddd',
                  fontSize: '10px'
                }}
              >
                <span id="tableHeader">Notes</span>
              </TableCell>
            </TableRow>
          </TableHead>

          {chiefComplaintsData?.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell style={{ border: '1px solid #ddd' }}>-- </TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>--</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {(chiefComplaintsData?.[0]?.chiefComplaint || [])?.map((v, ind) => (
                <TableRow key={ind}>
                  <TableCell style={{ border: '1px solid #ddd' }}>
                    <b style={{ fontSize: '9px' }}>{v?.chiefComplaint}</b>
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    {v?.since?.length > 0
                      ? v?.since?.map((vv, inx) => (
                          <span key={inx} style={{ fontSize: '9px' }}>
                            {vv?.data}
                            {inx !== v?.since?.length - 1 && ', '}
                          </span>
                        ))
                      : '-'}
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    {v?.treatment?.length > 0
                      ? v?.treatment?.map((vv, inx) => (
                          <span key={inx} style={{ fontSize: '9px' }}>
                            {vv?.data}
                            {inx !== v?.treatment?.length - 1 && ', '}
                          </span>
                        ))
                      : '-'}
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    {v?.symptoms?.length > 0
                      ? v?.symptoms?.map((vv, inx) => (
                          <span key={inx} style={{ fontSize: '9px' }}>
                            {vv?.with}
                            {inx !== v?.symptoms?.length - 1 && ', '}
                          </span>
                        ))
                      : '-'}
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    {v?.Location?.length > 0
                      ? v?.Location?.map((vv, inx) => (
                          <span key={inx} style={{ fontSize: '9px' }}>
                            {vv?.data}
                            {inx !== v?.Location?.length - 1 && ', '}
                          </span>
                        ))
                      : '-'}
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    {v?.description?.length > 0
                      ? v?.description?.map((vv, inx) => (
                          <span key={inx} style={{ fontSize: '9px' }}>
                            {vv?.data}
                            {inx !== v?.description?.length - 1 && ', '}
                          </span>
                        ))
                      : '-'}
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ddd' }}>
                    <span style={{ fontSize: '9px' }}>{v?.notes !== '' ? v?.notes : '-'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {Array.isArray(painChiefComplaint) && painChiefComplaint.length > 0 && (
  <>
    <div className="printHead !important" style={{ marginTop: '2rem' }}>
      <h5>Pain Chief Complaint:</h5>
    </div>

    <TableContainer style={{ marginTop: '1rem' }}>
      <Table style={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell style={cellStyle}>Chief Complaint</TableCell>
            <TableCell style={cellStyle}>Pain Type</TableCell>
            <TableCell style={cellStyle}>Pain Score</TableCell>
            <TableCell style={cellStyle}>Duration</TableCell>
            <TableCell style={cellStyle}>Nature of Pain</TableCell>
            <TableCell style={cellStyle}>Location</TableCell>
            <TableCell style={cellStyle}>Aggravating Factors</TableCell>
            <TableCell style={cellStyle}>Relieving Factors</TableCell>
            <TableCell style={cellStyle}>Quality</TableCell>
            <TableCell style={cellStyle}>Notes</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {painChiefComplaint.map((item, index) => (
            <TableRow key={index}>
              <TableCell style={cellStyle}>{item?.chiefComplaint || '-'}</TableCell>
              <TableCell style={cellStyle}>{item?.painType || '-'}</TableCell>
              <TableCell style={cellStyle}>{item?.painScore ?? '-'}</TableCell>

              <TableCell style={cellStyle}>
                {item?.duration?.length > 0
                  ? item.duration.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.duration.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>
                {item?.natureOfPain?.length > 0
                  ? item.natureOfPain.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.natureOfPain.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>
                {item?.Location?.length > 0
                  ? item.Location.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.Location.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>
                {item?.aggravatingFactors?.length > 0
                  ? item.aggravatingFactors.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.aggravatingFactors.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>
                {item?.relievingFactors?.length > 0
                  ? item.relievingFactors.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.relievingFactors.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>
                {item?.quality?.length > 0
                  ? item.quality.map((v, i) => (
                      <span key={i} style={textStyle}>
                        {v?.data}
                        {i !== item.quality.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
              </TableCell>

              <TableCell style={cellStyle}>{item?.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
)}

    </Box>
  );
};

const cellStyle = {
  fontWeight: 600,
  background: 'white',
  color: '#000',
  border: '1px solid #ddd',
  fontSize: '10px'
};

const textStyle = {
  fontSize: '9px'
};

export default PrintChiefComplaint;
