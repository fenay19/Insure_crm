import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";
import { toast } from "react-toastify";

const AddPrefix = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    prefix: "",
  });
  const [error, setError] = useState({
    prefix: "",
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

    if (inputData.prefix === "") {
      setError((prev) => {
        return {...prev, prefix: "Prefix is required"}
      })
    }
    if (inputData.prefix !== "") {
    await post('prefix',inputData)
        .then(() => {
          setInputData({
            prefix: "",
          });
          toast.success("Prefix Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.data.msg !== undefined) {
            
            toast.error(error.response.data.msg)
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Add Prefix</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prefix"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.prefix}
              name="prefix"
              error={error.prefix !== "" ? true : false}
              helperText={error.prefix}
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

export default AddPrefix;

