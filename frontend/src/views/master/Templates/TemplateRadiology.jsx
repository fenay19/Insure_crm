import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'
import TemplateSection from './TemplateSection'
import TemplateReport from './TemplateReport';

import ReactQuillOriginal, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);


const TemplateRadiology = () => {
  const [value, setValue] = useState(0);
  const [sections, setSections] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
 
  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <TemplateSection sections={sections}/>
        case 1:
        return <TemplateReport setSectionsInParent={setSections}/>
    }
  }
  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Radiology
        </Typography>
      </Breadcrumb>
      <Box sx={{ width: '100%'}}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Section Master'/>
          <Tab label='Report'/>
        </Tabs>
        <Divider />
      </Box>
      <Box sx={{ mt: 0 }}>{renderMasterContent()}</Box>
    </>
  )
}

export default TemplateRadiology
