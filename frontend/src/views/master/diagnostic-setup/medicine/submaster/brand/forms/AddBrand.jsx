import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";
import { toast } from "react-toastify";

const AddBrand = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    brandName: "",
  });

  const [error, setError] = useState({
    brandName: "",
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

    if (inputData.brandName === "") {
      setError((prev) => {
        return { ...prev, brandName: "Brand Name is required" };
      });
    }

    if (inputData.brandName !== "") {
      await post("brand-master", inputData)
        .then(() => {
          setInputData({
            brandName: "",
          });
          toast.success("Brand Name Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if (error.response?.data?.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error("Something went wrong, Please try later!");
          }
        });
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Add Brand Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Brand Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.brandName}
              name="brandName"
              error={error.brandName !== "" ? true : false}
              helperText={error.brandName}
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

export default AddBrand;
