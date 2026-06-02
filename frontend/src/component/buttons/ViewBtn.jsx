import { Visibility } from '@mui/icons-material';
import React from 'react';

const ViewBtn = ({ onClick }) => {
  return (
    <Visibility
      onClick={onClick}
      style={{ backgroundColor: 'blue', cursor: 'pointer', fontSize: '1.5rem', padding: '4px', color: 'white', borderRadius: '6px',       marginRight: '10px', marginLeft : '10px'
      }}
    />
  );
};

export default ViewBtn;
