import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { get, post, put } from "api/api";
import { toast } from "react-toastify";
import { Cancel, Save } from "@mui/icons-material";

const EditServiceRate = ({close,fetchData,editData}) => {
  const [inputData, setInputData] = useState({
    serviceGroup: "",
    serviceGroupId: "",
    serviceName: "",
    serviceNameId: "",
    department: "",
    departmentId: "",
    cash: "",
    CGHSnabh: "",
    CGHSnnoNabh: "",
    tpa: "",
    insurance: "",
    other: "",
  });

  const [billGroupData, setBillGroupData] = useState([]);
  const [serviceNameData, setServiceNameData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchBillgroup(),
          fetchServiceName(),
          fetchDepartmentData(),
        ]);
      } catch (err) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchBillgroup = async () => {
    try {
      const response = await get("billgroup-master");
      setBillGroupData(response.data || []);
    } catch (err) {
      toast.error("Error fetching bill group");
    }
  };

  const fetchServiceName = async () => {
    try {
      const response = await get("service-details-master");
      setServiceNameData(response.service || []);
    } catch (err) {
      toast.error("Error fetching service name");
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await get("department-setup");
      setDepartmentData(response.data || []);
    } catch (err) {
      toast.error("Error fetching department data");
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!inputData.serviceGroup) newErrors.serviceGroup = "Service Group is required";
    if (!inputData.serviceName) newErrors.serviceName = "Service Name is required";
    if (!inputData.department) newErrors.department = "Department is required";
    if (!inputData.cash) newErrors.cash = "Cash is required";
    if (!inputData.CGHSnabh) newErrors.CGHSnabh = "CGHS NABH is required";
    if (!inputData.CGHSnnoNabh) newErrors.CGHSnnoNabh = "CGHS No NABH is required";
    if (!inputData.tpa) newErrors.tpa = "TPA is required";
    if (!inputData.insurance) newErrors.insurance = "Insurance is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await put(`service-rate/${editData._id}`, inputData);
        toast.success(response.msg || "Service rate updated successfully");
        setInputData({
          serviceGroup: "",
          serviceGroupId: "",
          serviceName: "",
          serviceNameId: "",
          department: "",
          departmentId: "",
          cash: "",
          CGHSnabh: "",
          CGHSnnoNabh: "",
          tpa: "",
          insurance: "",
          other: "",
        });
        close();
        fetchData();
      } catch (error) {
        toast.error("Failed to create service rate");
        console.error("Error creating service rate:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceGroup") {
      const serviceGroup = billGroupData.find((data) => data._id === value);
      setInputData((prev) => ({
        ...prev,
        serviceGroup: serviceGroup?.billGroupName || "",
        serviceGroupId: serviceGroup?._id || "",
      }));
    } else if (name === "serviceName") {
      const serviceName = serviceNameData.find((data) => data._id === value);
      setInputData((prev) => ({
        ...prev,
        serviceName: serviceName?.detailServiceName || "",
        serviceNameId: serviceName?._id || "",
      }));
    } else if (name === "department") {
      const department = departmentData.find((data) => data._id === value);
      setInputData((prev) => ({
        ...prev,
        department: department?.departmentName || "",
        departmentId: department?._id || "",
      }));
    } else {
      setInputData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (editData) {
      setInputData({
        serviceGroup: editData.serviceGroup || "",
        serviceGroupId: editData.serviceGroupId || "",
        serviceName: editData.serviceName || "",
        serviceNameId: editData.serviceNameId || "",
        department: editData.department || "",
        departmentId: editData.departmentId || "",
        cash: editData.cash || "",
        CGHSnabh: editData.CGHSnabh || "",
        CGHSnnoNabh: editData.CGHSnnoNabh || "",
        tpa: editData.tpa || "",
        insurance: editData.insurance || "",
        other: editData.other || "",
      });
    }
  }, [editData]);

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "1rem" }}>Update Service Rate</h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Service Group"
                name="serviceGroup"
                value={inputData.serviceGroupId}
                onChange={handleChange}
                fullWidth
                error={!!errors.serviceGroup}
                helperText={errors.serviceGroup}
              >
                {billGroupData.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.billGroupName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Service Name"
                name="serviceName"
                value={inputData.serviceNameId}
                onChange={handleChange}
                fullWidth
                error={!!errors.serviceName}
                helperText={errors.serviceName}
              >
                {serviceNameData.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.detailServiceName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Department"
                name="department"
                value={inputData.departmentId}
                onChange={handleChange}
                fullWidth
                error={!!errors.department}
                helperText={errors.department}
              >
                {departmentData.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Cash"
                name="cash"
                type="number"
                value={inputData.cash}
                onChange={handleChange}
                fullWidth
                error={!!errors.cash}
                helperText={errors.cash}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="CGHS NABH"
                name="CGHSnabh"
                type="number"
                value={inputData.CGHSnabh}
                onChange={handleChange}
                fullWidth
                error={!!errors.CGHSnabh}
                helperText={errors.CGHSnabh}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="CGHS NON NABH"
                name="CGHSnnoNabh"
                type="number"
                value={inputData.CGHSnnoNabh}
                onChange={handleChange}
                fullWidth
                error={!!errors.CGHSnnoNabh}
                helperText={errors.CGHSnnoNabh}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="TPA"
                name="tpa"
                type="number"
                value={inputData.tpa}
                onChange={handleChange}
                fullWidth
                error={!!errors.tpa}
                helperText={errors.tpa}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Insurance"
                name="insurance"
                type="number"
                value={inputData.insurance}
                onChange={handleChange}
                fullWidth
                error={!!errors.insurance}
                helperText={errors.insurance}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Other"
                name="other"
                type="number"
                value={inputData.other}
                onChange={handleChange}
                fullWidth
                error={!!errors.other}
                helperText={errors.other}
              />
            </Grid>

            <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton title="Save" className="btnPopup btnSave" type="submit">
                <Save/>
              </IconButton>
              <IconButton title="Cancel" className="btnPopup btnCancel" onClick={close}>
                <Cancel />
              </IconButton>
            </div>
          </Grid>
          </Grid>
        )}
      </form>
    </div>
  );
};

export default EditServiceRate;
