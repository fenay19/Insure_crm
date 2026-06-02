import React from 'react'
import { IoIosAddCircle } from "react-icons/io";


const AddBtn = ({onClick}) => {
  return (
        <IoIosAddCircle 
          onClick={onClick} 
          style={{ backgroundColor: "green", cursor: "pointer",fontSize: "1.5rem", padding:"4px",color: "white", borderRadius:"6px" }} 
        />
  )
}

export default AddBtn
