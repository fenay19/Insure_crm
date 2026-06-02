
import React from 'react';
import { MdDelete } from "react-icons/md";



const DeleteBtn = ({ onClick }) => (
  <MdDelete 
    onClick={onClick} 
    style={{ backgroundColor: "red", cursor: "pointer",fontSize: "1.5rem", padding:"4px",color: "white", borderRadius:"6px" }} 
  />
);

export default DeleteBtn;
