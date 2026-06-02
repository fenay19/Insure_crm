import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post, put } from "api/api";

const EditRole = ({ handleClose, getData ,editData}) => {
  const [inputData, setInputData] = useState({
    employeeRole:editData.employeeRole,
  });
  const [error, setError] = useState({
    employeeRole: "",
  });
  // const toast = useToast();

  const handleSave = (event) => {
    handleSubmitData(event)
  };

  const handleCancel = () => {
    handleClose()
  };

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

    if (inputData.employeeRole === "") {
      setError((prev) => {
        return {...prev, employeeRole: "employee Role is required"}
      })
    }
    if (inputData.employeeRole !== "") {
    await put(`employee-role/${editData._id}`,inputData)
        .then(() => {
          setInputData({
            employeeRole: "",
          });
          // toast({
          //   title: "Prefix Added",
          //   status: "success",
          //   duration: 4000,
          //   isClosable: true,
          //   position: "bottom",
          // });
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.data.msg !== undefined) {
            // toast({
            //   title: "Error",
            //   description: error.response.data.msg,
            //   status: "error",
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
            alert(error.response.data.msg)
          } else {
            // toast({
            //   title: 'Something went wrong, Please try later!!',
            //   status: 'error',
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Edit Employee Role</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Empolyee Role"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.employeeRole}
              name="employeeRole"
              error={error.employeeRole !== "" ? true : false}
              helperText={error.employeeRole}
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

export default EditRole;

