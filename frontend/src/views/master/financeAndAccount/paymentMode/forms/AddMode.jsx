import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";
import { toast } from "react-toastify";

const AddMode = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    paymentMode: "",
  });
  const [error, setError] = useState({
    paymentMode: "",
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

    if (inputData.employeeRole === "") {
      setError((prev) => {
        return {...prev, paymentMode: "payment Mode is required"}
      })
    }
    if (inputData.employeeRole !== "") {
    await post('payment-mode',inputData)
        .then(() => {
          setInputData({
            paymentMode: "",
          });
          toast.success("Prefix Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.msg !== undefined) {
           toast.error(error.response.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Add Payment Mode</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="payment Mode"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.paymentMode}
              name="paymentMode"
              error={error.paymentMode !== "" ? true : false}
              helperText={error.paymentMode}
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

export default AddMode;

