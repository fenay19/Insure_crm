import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post, put } from "api/api";
import { toast } from "react-toastify";

const EditGeneric = ({ handleClose, getData, editData}) => {
  const [inputData, setInputData] = useState({
    genericName: editData.genericName,
  });
  const [error, setError] = useState({
    genericName: "",
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

    if (inputData.employeeRole === "") {
      setError((prev) => {
        return {...prev, genericName: "generic Name is required"}
      })
    }
    if (inputData.genericName !== "") {
    await put(`generic-master/${editData._id}`,inputData)
        .then(() => {
          setInputData({
            genericName: "",
          });
          toast.success(`${editData.genericName} Updated!`)
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
          if(error.response.msg !== undefined) {
            // toast({
            //   title: "Error",
            //   description: error.response.data.msg,
            //   status: "error",
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
            toast.error(error.response.msg)
          } else {
              toast.error('Something went wrong, Please try later!!')
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">update Generic Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Generic Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.genericName}
              name="genericName"
              error={error.genericName !== "" ? true : false}
              helperText={error.genericName}
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

export default EditGeneric;

