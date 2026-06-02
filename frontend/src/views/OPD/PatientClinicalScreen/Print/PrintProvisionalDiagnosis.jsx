import { Box } from '@mui/material'
import { get } from 'api/api'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const PrintProvisionalDiagnosis = ({ patientProvisionalDiagnosis }) => {
  const [provisonalDiagnosisData, setProvisionalDiagnosisData] = useState({})
  const selectedPatient = useSelector(state => state.patient.selectedPatient)

  const getProvisionalDiagnosis = async (req, res) => {
    try {
      const response = await get(`patient-provisional-diagnosis/diagnosis/${selectedPatient?.consultantId}/${selectedPatient?._id}`)

      if (response.success) {
        setProvisionalDiagnosisData(response.provisionalDiagnosis)
      } else {
        console.error('Failed to fetch provisional diagnosis:', response.message || 'No data returned')
      }
    } catch (error) {
      console.error('Error fetching provisional diagnosis:', error)
    }
  }

  useEffect(() => {
    if (selectedPatient?.consultantId && selectedPatient?._id) {
      getProvisionalDiagnosis()
    }
  }, [selectedPatient?._id, selectedPatient?.consultantId])

  console.log('provisional', provisonalDiagnosisData)

  return (
    <Box className='notranslate' sx={{ marginTop: '10px' }}>
      <div className='printHead'>
        <h5>Provisional Diagnosis:</h5>
      </div>
      <div className='printContent' style={{ marginLeft: '10px' }}>

       
        {provisonalDiagnosisData?.diagnosis?.map((v, inx) => {
          return (
            <li key={inx}>
              <span>
                {v.diagnosis}
                {v.code !== '' && <> ({v.code})</>}
              </span>
            </li>
          )
        })}
      </div>
    </Box>
  )
}

export default PrintProvisionalDiagnosis
