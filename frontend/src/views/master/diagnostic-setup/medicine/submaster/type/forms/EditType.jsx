import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import {put } from "api/api";
import { toast } from "react-toastify";

const EditType = ({ handleClose, getData,editData }) => {
  const [inputData, setInputData] = useState({
    typeName:editData.typeName,
  });
  const [error, setError] = useState({
    typeName: "",
  });
  // const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
        return {...prev, [name]: value}
      }
    );
    setError((prev) => {
        return {...prev, [name]: ""}
      }
    );
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (inputData.typeName === "") {
      setError((prev) => {
        return {...prev, typeName: "Type Name is required"}
      })
    }
    if (inputData.typeName !== "") {
    await put(`type-master/${editData._id}`,inputData)
        .then(() => {
          setInputData({
            typeName: "",
          });
          toast.success(`${editData.typeName} Updated type `);
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.msg !== undefined) {
            toast.error(error.response.msg)
          } else {
           toast.error('Something went wrong, Please try later!!')
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">upadte Type Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Type Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.typeName}
              name="typeName"
              error={error.typeName !== "" ? true : false}
              helperText={error.typeName}
            />

          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton type="submit" title="Cancel" onClick={handleClose} className="btnCancel">
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditType;

