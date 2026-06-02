import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";
import { toast } from "react-toastify";

const AddDose = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    dose: "",
  });

  const [error, setError] = useState({
    dose: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return { ...prev, [name]: value };
    });
    setError((prev) => {
      return { ...prev, [name]: "" };
    });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (inputData.dose === "") {
      setError((prev) => {
        return { ...prev, dose: "Dose is required" };
      });
    }

    if (inputData.dose !== "") {
      await post("dose-master", inputData)
        .then(() => {
          setInputData({
            dose: "",
          });
          toast.success("Dose Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if (error.response.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error("Something went wrong, Please try later!");
          }
        });
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Add Dose</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dose"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.dose}
              name="dose"
              error={error.dose !== "" ? true : false}
              helperText={error.dose}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton
                type="button"
                title="Cancel"
                onClick={handleClose}
                className="btnCancel"
              >
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddDose;
