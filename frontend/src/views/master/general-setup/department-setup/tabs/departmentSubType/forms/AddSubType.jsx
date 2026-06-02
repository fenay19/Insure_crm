import React, { useEffect, useState } from "react";
import { IconButton, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { post, get } from "api/api";

const AddSubType = ({ handleClose, getData }) => {
  const [departTypeData, setDepartTypeData] = useState([]);

  const [inputData, setInputData] = useState({
    departmentSubTypeName: "",
    departmentTypeId: "",
    // departmentTypeName:"",
  });

  const [error, setError] = useState({
    departmentSubTypeName: "",
    departmentTypeId: "",
    // departmentTypeName:"",
  });

  const fetchData = async () => {
    try {
      const result = await get("department-type");
      setDepartTypeData(result.data);
    } catch (err) {
      console.error("Error fetching department types:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    // Validate fields
    let isValid = true;
    const errors = {};

    if (!inputData.departmentSubTypeName) {
      errors.departmentSubTypeName = "Department sub-type is required";
      isValid = false;
    }

    if (!inputData.departmentTypeId) {
      errors.departmentTypeId = "Department type is required";
      isValid = false;
    }

    setError(errors);
    if (!isValid) return;

    try {
      await post("department-sub-type", inputData);
      setInputData({
        departmentSubTypeName: "",
        departmentTypeId: "",
      });
      alert("Department Sub-Type Added Successfully");
      handleClose();
      getData();
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("Something went wrong, Please try later!!");
      }
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Add Department Sub-Type</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="departmentTypeLabel">Department Type</InputLabel>
              <Select
                labelId="departmentTypeLabel"
                label="Department Type"
                variant="outlined"
                onChange={handleInputChange}
                value={inputData.departmentTypeId}
                name="departmentTypeId"
              >
                {departTypeData.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.departmentTypeName}
                  </MenuItem>
                ))}
              </Select>
              {error.departmentTypeId && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>{error.departmentTypeId}</span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department Sub-Type Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.departmentSubTypeName}
              name="departmentSubTypeName"
              error={!!error.departmentSubTypeName}
              helperText={error.departmentSubTypeName}
            />
          </Grid>

          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton
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

export default AddSubType;
