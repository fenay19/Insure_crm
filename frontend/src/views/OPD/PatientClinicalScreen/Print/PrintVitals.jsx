import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const VitalData = ({ vitals }) => {
  if (!vitals || typeof vitals !== 'object') return null;

  // Step 1: Filter out metadata fields
  const unwantedKeys = [
    '_id',
    'departmentId',
    'patientId',
    'consultantId',
    '__v',
    'createdAt',
    'updatedAt',
  ];

  const vitalEntries = Object.entries(vitals).filter(([key]) => !unwantedKeys.includes(key));

  // Step 2: Flatten vital data
  const vitalArray = vitalEntries.reduce((acc, [, value]) => {
    if (Array.isArray(value)) {
      return acc.concat(value);
    }
    return acc;
  }, []);

  // Step 3: Format values properly
  const formatVitalValue = (vital) => {
    const name = vital.vitalName || '';
    if (name === 'Respiratory Rate (RR)' || name === 'Pulse (Radial)/Heart Rate') {
      return `${vital.selectedRangeValue ?? ''} ${vital.unit || ''}`;
    }
    if (vital.selectedParameters) {
      return Object.entries(vital.selectedParameters)
        .map(([paramKey, paramArray]) => {
          const values = paramArray.map((item) => item.value).join(', ');
          return `<b>${paramKey}:</b> ${values}`;
        })
        .join('<br/>');
    }

    if (vital.ranges) {
      return `<b>Systolic:</b> ${vital.ranges.systolic} mmHg</br> <b>Diastolic:</b> ${vital.ranges.diastolic} mmHg`;
    }

    if (vital.height) return `${vital.height} ${vital.unit || ''}`;
    if (vital.weight) return `${vital.weight} ${vital.unit || ''}`;
    if (vital.bmiValue) return `<b>${vital.bmiValue}</b> (${vital.bmiType})`;
    if (vital.value) return `${vital.value} ${vital.unit || ''}`;
    if (vital.range !== undefined) return `${vital.range} ${vital.unit || ''}`;

    return '';
  };

  return (
    <Box sx={{ mt: 2 }} className="notranslate">
      <div className="printHead">
        <h5>Vitals: </h5>
      </div>

      <Box sx={{ mx: 2 }}>
        <Table sx={{ border: '1px solid black', minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              {vitalArray.map((vital, i) => (
                <TableCell
                  key={`head-${i}`}
                  sx={{
                    border: '1px solid black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '11px',
                    backgroundColor: '#f3f3f3',
                  }}
                >
                  {vital.vitalName || 'Unknown'}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {vitalArray.map((vital, i) => (
                <TableCell
                  key={`body-${i}`}
                  sx={{ border: '1px solid black', textAlign: 'center', fontSize: '11px' }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatVitalValue(vital),
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default VitalData;
