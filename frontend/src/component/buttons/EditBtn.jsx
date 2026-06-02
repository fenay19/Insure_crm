import React from 'react';
import { MdEditSquare } from 'react-icons/md';

const EditBtn = ({ onClick, style }) => (
  <MdEditSquare
    onClick={onClick}
    style={{
      backgroundColor: 'green',
      cursor: 'pointer',
      fontSize: '1.5rem',
      padding: '4px',
      color: 'white',
      borderRadius: '6px',
      marginRight: '10px',
      ...style
    }}
  />
);

export default EditBtn;
