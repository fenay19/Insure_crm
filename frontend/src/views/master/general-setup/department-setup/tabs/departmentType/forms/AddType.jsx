import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";

const AddType = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    departmentTypeName: "",
  });
  const [error, setError] = useState({
    departmentTypeName: "",
  });


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

    if (inputData.departmentTypeName === "") {
      setError((prev) => {
        return {...prev, departmentTypeName: "Prefix is required"}
      })
    }
    if (inputData.departmentTypeName !== "") {
    await post('department-type',inputData)
        .then(() => {
          setInputData({
            departmentTypeName: "",
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
      <h2 className="popupHead">Add Department type</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department Type"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.departmentTypeName}
              name="departmentTypeName"
              error={error.departmentTypeName !== "" ? true : false}
              helperText={error.departmentTypeName}
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

export default AddType;

