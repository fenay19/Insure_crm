import React from 'react'
import { Button, TextField } from '@mui/material'
// import { useToast } from '@chakra-ui/react';
import { IconButton, MenuItem, Menu } from '@mui/material'
import Papa from 'papaparse'
import { Download, Upload } from '@mui/icons-material'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { post } from 'api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ImportExport = ({ update, headerFields, name, fileValidationHandler, exportDataHandler, downheaderFields, api, type }) => {
  // const toast = useToast()
  const [uploadErr, setUploadErr] = React.useState('')
  const [inputVal, setInputVal] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const uploadHandler = async e => {
    if (e.target.files[0] === undefined) {
      setUploadErr('')
    } else {
      setUploadErr('')
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          let fileData = await fileValidationHandler(results.data)

          if (fileData.length === 0) {
            setUploadErr('Invalid Data')
          } else {
            let er = false
            fileData.forEach(val => {
              Object.keys(val).forEach(v => {
                if (v === undefined) {
                  setUploadErr('Invalid Data')
                  er = true
                }
              })
            })
            if (!er) {
              setUploadErr('')
            }
          }
          setInputVal(fileData)
          console.log('fileData', fileData)
        }
      })
    }
  }

  const downloadHandler = format => {
    const exportData = exportDataHandler()

    const csvRows = []
    // Header row
    const headers = ['SN', ...downheaderFields]
    csvRows.push(headers.join(','))
    // Data rows
    exportData.forEach(item => {
      const values = headers?.map(field => item[field])
      csvRows.push(values.join(','))
    })

    if (format === 'pdf') {
      let csvContent = ''

      csvRows.forEach(val => {
        csvContent = csvContent + val + '\n'
      })

      // Convert CSV to PDF
      const pdfDoc = new jsPDF()

      // Split the CSV content into rows
      const rows = csvContent.split('\n')

      // Extract header and data
      const header = rows[0].split(',')
      const data = rows.slice(1)?.map(row => row.split(','))

      // Create a table in PDF
      pdfDoc.autoTable({
        head: [header],
        body: data,
        startY: 5,
        styles: { fontSize: 6 },
        margin: { top: 5, right: 1, bottom: 5, left: 1 },
        orientation: 'landscape'
      })

      // Save the PDF as a Blob
      const pdfBlob = pdfDoc.output('blob')

      // Create a download link
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(pdfBlob)
      downloadLink.download = `${name}.pdf`

      // Append the link to the body
      document.body.appendChild(downloadLink)

      // Trigger a click event to start the download
      downloadLink.click()

      // Remove the link from the body
      document.body.removeChild(downloadLink)
    } else if (format === 'csv') {
      const csvContent = csvRows.join('\n')

      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      // Create a download link and trigger a click to download the file
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${name}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error('Download is not supported in this browser.')
      }
    }
  }

  const downloadDummy = () => {
    const csvRows = []
    // Header row
    csvRows.push(headerFields.join(','))

    const csvContent = csvRows.join('\n')

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Create a download link and trigger a click to download the file
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Sample ${name}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      console.error('Download is not supported in this browser.')
    }
  }

  const uploadSubmitHandler = async (event) => {
    event.preventDefault();

    if (inputVal.length === 0) {
        setUploadErr('Select File');
        return;
    }

    setUploadErr('');
    let datatoSend = [];

    // Process input values into data format for the API
    inputVal.forEach((val) => {
        let dataImport = {};
        Object.entries(val).forEach(([key, value]) => {
            dataImport[key] = value;
        });
        datatoSend.push(dataImport);
    });

    try {
        const response = await post(`${api}`, datatoSend);

        // Check if response status indicates success
        if (response) {
            update(); // Update your UI or state
            event.target.csvfile.value = ''; // Reset the input file field
            setInputVal([]); // Clear the input values
            toast.success(`${name} Added!!`);
        } else {
            // Handle error response
            const errorData = await response;
            const errorMessage = errorData?.error || 'Please fill valid data in file';
            setUploadErr(errorMessage);
            toast.error(errorMessage);
        }
    } catch (error) {
        // Handle any other errors (e.g., network issues)
        setUploadErr(error.message || 'An error occurred');
        toast.error(error.message || 'An error occurred');
    }
};


  return (
    <>
      {type === 'pathalogy' ? (
        <div className='start_end_btn_group' style={{ marginTop: '5px' }}>
          <Button
            className='global_btn'
            onClick={() => {
              downloadHandler('csv')
            }}
          >
            Export
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: '', alignItems: 'end' }}>
          <Button
            // style={{backgroundColor:"#126078", color:"#fff"}}
            className='button-87'
            onClick={() => {
              downloadDummy()
            }}
          >
            Sample
          </Button>
          <Button onClick={handleClick} className='button-87' style={{ background: 'green' }}>
            Export
          </Button>
          <form style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }} onSubmit={uploadSubmitHandler}>
            <div>
              <div style={{ color: 'red', fontSize: '10px' }}>*Only Accept csv file</div>
              <TextField
                type='file'
                inputProps={{ accept: '.csv' }}
                onChange={uploadHandler}
                variant='standard'
                style={{ width: '200px', padding: '5px !important' }}
                error={uploadErr !== '' ? true : false}
                helperText={uploadErr}
                name='csvfile'
              />
            </div>
            <Button type='submit' className='button-87' style={{ fontSize: '10px' }}>
              Import
            </Button>
          </form>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            className='custom-menu'
          >
            <MenuItem
              onClick={() => {
                downloadHandler('pdf')
              }}
            >
              PDF
            </MenuItem>
            <MenuItem
              onClick={() => {
                downloadHandler('csv')
              }}
            >
              CSV
            </MenuItem>
            {/* Add more MenuItems as needed */}
          </Menu>
        </div>
      )}
    </>
  )
}

export default ImportExport
