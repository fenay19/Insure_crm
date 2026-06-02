import React from 'react';
import { IconButton, Box } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';


const FieldControls = ({ onAdd, onRemove, showAddButton }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <IconButton onClick={onRemove} color="error" size="small">
      <MdDelete size={18} />
    </IconButton>
    {showAddButton && (
      <IconButton onClick={onAdd} color="primary" size="small">
        <FaPlus size={18} />
      </IconButton>
    )}
  </Box>
);

export default FieldControls;
