import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Modal,
  TextField,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  FormControlLabel,
  Checkbox,
  Typography,
  Card,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Cancel, Save, TouchApp } from "@mui/icons-material";
import { get, post, put } from "../../../../api/api";
import { toast, ToastContainer } from "react-toastify";
import DataTable from "component/DataTable";
import Loader from "component/Loader/Loader";
import EditBtn from "component/buttons/EditBtn";
import DeleteBtn from "component/buttons/DeleteBtn";
import ImportExport from "component/ImportExport";
import Breadcrumbs from "component/Breadcrumb";
import { Link } from "react-router-dom";
import NoDataPlaceholder from "component/NoDataPlaceholder";


const Billgroup = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openActiveModal, setOpenActivateModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  const [selectedBillgroup, setSelectedBillgroup] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [subLedger, setSubLedger] = useState([]);
  const headerFields = ["Bill Group Name", "Ledger", "Sub Ledger", "Description"];
  const downheaderFields = [
    "Bill Group Name",
    "Bill Group Code",
    "Ledger", 
    "Sub Ledger",
    "Description",
    "Status",
  ];
  const [loader, setLoader] = useState(true);
  const [billgroupData, setBillgroupData] = useState({
    billGroupName: "",
    billGroupCode: "",
    ledger: "",
    ledgerId: "",
    subLedger: "",
    subLedgerId: "",
    description: "",
    forAll: false,
    status: "active",
  });
  const [error, setError] = useState({
    billGroupName: "",
    billGroupCode: "",
    ledger: "",
    ledgerId: "",
    subLedger: "",
    subLedgerId: "",
  });

  const [page, setPage] = useState(0);


  const handleSave = (event) => {
    if (openRegistrationModal) {
      handleSubmit(event);
    }
    if (openEditModal) {
      handleEditSubmit(event);
    }
    if (openDeleteModal) {
      deleteBillgroup(data._id);
    }
    if (openActiveModal) {
      activateBillgroup(data._id);
    }
  };


  const handleCancel = () => {
    closeRegistration();
  };

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return (
        item.billGroupName.toLowerCase().includes(searchValue) ||
        item.billGroupCode.toLowerCase().includes(searchValue) ||
        item.ledger.toLowerCase().includes(searchValue) ||
        item.subLedger.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
      );
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
      setBillgroupData((prev) => {
        return { ...prev, [name]: type === "checkbox" ? checked : value };
      });
    
    setError((prev) => {
      return { ...prev, [name]: "" };
    });
  };

  const fetchBillgroup = async () => {
    setLoader(true);
    const response = await get('billgroup-master');
    if (response) {
      let addsr = [];
      response.data.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setFilterData(addsr);
      setLoader(false);
    }
  };

  const deleteBillgroup = async (id) => {
    try {
      const response = await put(
        `billgroup-master/delete/${id}`
      );
      if (response) {
        fetchBillgroup();
        toast.error(`${data.billGroupName} Bill Group deleted!!`);
        setOpenDeleteModal(false);
      } else {
        toast.error("Something went wrong, Please try later!!");
      }
    } catch (error) {
      toast.error("Something went wrong, Please try later!!");
    }
  };

  const activateBillgroup = async (id) => {
    const billGroupDataToSend = {
      ...data,
      status: data.status === "active" ? "inactive" : "active",
    };
     await put(`billgroup-master/${id}`, billGroupDataToSend,).then(() => {
        setOpenActivateModal(false);
        fetchBillgroup();
        toast.error(`${data.status === "active" ? "Inactivate" : "Activate"} ${data.billGroupName
            } Bill Group!!`);
        setBillgroupData({
          billGroupName: "",
          billGroupCode: "",
          ledger: "",
          description: "",
          forAll: false,
          status: "active",
        });
      })
      .catch((error) => {
        toast.error("Something went wrong, Please try later!!");
      });
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
  };

  const openEditModalFun = (bill) => {
    setSelectedBillgroup(bill);
    setBillgroupData({
      billGroupName: bill.billGroupName,
      billGroupCode: bill.billGroupCode,
      ledger: bill.ledger,
      ledgerId: bill.ledgerId,
      subLedger: bill.subLedger,
      subLedgerId: bill.subLedgerId,
      description: bill.description,
      forAll: bill.forAll,
      status: bill.status,
    });
    setOpenEditModal(true);
  };

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenActivateModal(false);
    setBillgroupData({
      billGroupName: "",
      billGroupCode: "",
      ledger: "",
      description: "",
      forAll: false,
      status: "active",
    });
    setError({
      billGroupName: "",
      billGroupCode: "",
      ledger: "",
      subLedger: "",
    });
  };

  const validation = () => {
    if (billgroupData.billGroupName === "") {
      setError((prev) => {
        return { ...prev, billGroupName: "Bill Group Name is required" };
      });
    }

    if (billgroupData.ledger === "") {
      setError((prev) => {
        return { ...prev, ledger: "Ledger is required" };
      });
    }

    if (billgroupData.subLedger === "") {
      setError((prev) => {
        return { ...prev, subLedger: "Sub Ledger is required" };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();

    if (
      billgroupData.billGroupName !== "" &&
      billgroupData.billGroupCode !== "" &&
      billgroupData.ledger !== "" &&
      billgroupData.subLedger !== ""
    ) {
      const addedData = { ...billgroupData, status: "active" };
       await post('billgroup-master', addedData).then(() => {
          setOpenRegistrationModal(false);
          fetchBillgroup();
          setBillgroupData({
            billGroupName: "",
            billGroupCode: "",
            ledger: "",
            description: "",
            forAll: false,
            status: "active",
          });
          toast.error("Bill Group Added!!");
        })
        .catch((error) => {
          toast.error("Something went wrong, Please try later!!");
        });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    validation();

    if (
      billgroupData.billGroupName !== "" &&
      billgroupData.billGroupCode !== "" &&
      billgroupData.ledger !== ""
    ) {
      const billgroupDataToSend = {
        ...selectedBillgroup,
        ...billgroupData,
      };

       await put(`billgroup-master/${selectedBillgroup._id}`,billgroupDataToSend,).then(() => {
          setOpenEditModal(false);
          fetchBillgroup();
          toast.success(`${billgroupData.billGroupName} Bill Group Updated!!`);
          setBillgroupData({
            billGroupName: "",
            billGroupCode: "",
            ledger: "",
            description: "",
            forAll: false,
            status: "active",
          });
        })
        .catch((error) => {
          toast.error("Something went wrong, Please try later!!");
        });
    }
  };

  const fetchLatestCode = async () => {
    try {
      const result = await get('billgroup-master');
      const codes = result.data.map((dept) => dept.billGroupCode);
      if (codes.length > 0) {
        const numericCodes = codes.map((code) => parseInt(code.match(/\d+$/), 10)).filter((num) => !isNaN(num));
        const maxCode = Math.max(...numericCodes);
        const newCode = String(maxCode + 1).padStart(6, '0');

        setBillgroupData((prev) => ({
          ...prev,
          billGroupCode: newCode
        }));
      } else {
        setBillgroupData((prev) => ({
          ...prev,
          billGroupCode: '000001'
        }));
      }
    } catch (err) {
      console.log('Error fetching code:', err);
    }
  };

  useEffect(()=>{
    fetchLatestCode()
  },[openRegistrationModal])

  const fetchLedgerData = async () => {
    try {
      const response = await get(`ledger`);
      setLedger(response.allLedger);
    } catch (error) {
      console.error("Error fetching sub ledger:", error);
    }
  };

  const fetchSubLedgerData = async () => {
    setLoader(true);
    try {
      const response = await get(`ledger/sub-ledger`);
      if (response) {
        const filteredData = response.allSubLedger.filter(
          (item) => item.ledger === billgroupData.ledger
        );
        setSubLedger(filteredData);
      } else {
        console.error("Failed to fetch sub-ledger data");
      }
    } catch (error) {
      console.error("Error fetching sub-ledger data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (billgroupData.ledger) {
      const selectedLedger = ledger.find(
        (item) => item.ledger === billgroupData.ledger
      );
      if (selectedLedger) {
        setBillgroupData((prevData) => ({
          ...prevData,
          ledgerId: selectedLedger._id,
        }));
      }
    }
    // eslint-disable-next-line
  }, [billgroupData.ledger, ledger]);

  useEffect(() => {
    if (billgroupData.ledgerId) {
      fetchSubLedgerData();
    }
    // eslint-disable-next-line
  }, [billgroupData.ledgerId]);

  useEffect(() => {
    if (billgroupData.subLedger) {
      const filterSubLedgerId = subLedger.find(
        (item) => item.subLedger === billgroupData.subLedger
      );
      if (filterSubLedgerId) {
        setBillgroupData((prev) => ({
          ...prev,
          subLedgerId: filterSubLedgerId._id,
        }));
      }
    }
    // eslint-disable-next-line
  }, [billgroupData.subLedger, subLedger]);

  useEffect(() => {
    fetchBillgroup();
    // eslint-disable-next-line
  }, []);

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};

      if (
        val["Bill Group Name"] !== "" &&
        val["Account Ledger"] !== "" &&
        val["Bill Group Name"] !== undefined &&
        val["Ledger"] !== undefined &&
        val["Sub Ledger"] !== undefined &&   
        val["Description"] !== undefined
      ) {
        const dCode =
          val["Bill Group Name"].substring(0, 3).toUpperCase() + "_01";
        d = {
          billGroupName: val["Bill Group Name"],
          billGroupCode: dCode,
          ledger: val["Ledger"],
          subLedger: val["Sub Ledger"],
          description: val["Description"],
          status: "active",
        };

        newData.push(d);
      }
    });
    return newData;
  };

  const exportDataHandler = () => {
    let datadd = [];
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        "Bill Group Name": val.billGroupName?.replace(/,/g, " "),
        "Bill Group Code": val.billGroupCode?.replace(/,/g, " "),
        "Ledger" : val.ledger?.replace(/,/g, " "),
        "Sub Ledger" : val.subLedger?.replace(/,/g, " "),
        Description: val.description?.replace(/,/g, " "),
        Status: val.status?.replace(/,/g, " "),
      });
    });
    return datadd;
  };

  const columns = ['SN', 'Bill Group Name', 'Bill Group Code', 'Ledger', 'Sub Ledger', 'Description', 'Actions'];
  const finalData = showData.map((item, ind) => ({
    SN: ind + 1,
    'Bill Group Name': item.billGroupName,
    'Bill Group Code': item.billGroupCode,
    Ledger: item.ledger,
    'Sub Ledger': item.subLedger,
    Description: item.description,
    Actions: (
      <div className="action_btn">
        <EditBtn onClick={() => openEditModalFun(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item)} />
      </div>
    )
  }));


  return (
    <>
       <Breadcrumbs title="Bill/service Group">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Bill/service Group
        </Typography>
      </Breadcrumbs>
      <Card sx={{padding:'13px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" className="global_btn" onClick={() => openRegistration('add')}>
            + Add
          </Button>

          <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
            <input
              style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
              className="search_input"
              type="search"
              placeholder="Search..."
              onChange={filterDataHandler}
            />
            <ImportExport
              update={fetchBillgroup}
              headerFields={headerFields}
              downheaderFields={downheaderFields}
              name="Bill Group"
              fileValidationHandler={fileValidationHandler}
              exportDataHandler={exportDataHandler}
              api="billgroup-master/import"
            />
          </div>

          <Modal
            open={openRegistrationModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Add Bill Group</h2>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} mt={1}>


                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={error.ledger !== ""}
                    >
                      <InputLabel>Ledger</InputLabel>
                      <Select
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 },
                          },
                        }}
                        name="ledger"
                        label="Ledger"
                        value={billgroupData.ledger}
                        onChange={handleInputChange}
                      >
                        {ledger.map((item) => (
                          <MenuItem value={item.ledger} key={item._id}>
                            {item.ledger}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{error.ledger}</FormHelperText>
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={error.subLedger !== ""}
                    >
                      <InputLabel>Sub Ledger</InputLabel>
                      <Select
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 },
                          },
                        }}
                        name="subLedger"
                        label="Sub Ledger"
                        value={billgroupData.subLedger}
                        onChange={handleInputChange}
                        disabled={!billgroupData.ledgerId} // Disable if no ledgerId is available
                      >
                        {subLedger.map((item) => (
                          <MenuItem value={item.subLedger} key={item._id}>
                            {item.subLedger}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{error.subLedger}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bill Group Name"
                      variant="outlined"
                      name="billGroupName"
                      value={billgroupData.billGroupName}
                      onChange={handleInputChange}
                      error={error.billGroupName !== "" ? true : false}
                      helperText={error.billGroupName}
                    />
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bill Group Code"
                      variant="outlined"
                      name="billGroupCode"
                      value={billgroupData.billGroupCode}
                      onChange={handleInputChange}
                      error={error.billGroupCode !== "" ? true : false}
                      helperText={error.billGroupCode}
                      disabled
                    />
                  </Grid>




                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      name="description"
                      value={billgroupData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="forAll"
                          checked={
                            billgroupData.forAll === "true" ||
                            billgroupData.forAll === true
                          }
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="For All Branch"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className="btnGroup">
                      <IconButton
                        type="submit"
                        title="Save"
                        className="btnPopup btnSave"
                      >
                        <Save />
                      </IconButton>
                      <IconButton
                        type="submit"
                        title="Cancel"
                        onClick={() => closeRegistration()}
                        className="btnPopup btnCancel"
                      >
                        <Cancel />
                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Modal>
        </div>
        {loader ? (
          <Loader/>
        ) : (
          <Paper>
            {showData.length <= 0 ? (
              <NoDataPlaceholder />
            ) : (
              <DataTable columns={columns} data={finalData} />
            )}
       
          </Paper>
        )}
        <Modal
          open={openEditModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <h2 className="popupHead">Update Bill Group</h2>
            <form onSubmit={handleEditSubmit}>
              <Grid container spacing={2} mt={1}>


                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error.ledger !== "" ? true : false}
                  >
                    <InputLabel>Ledger</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }, // Adjust maxHeight as needed
                        },
                      }}
                      name="ledger"
                      label="Ledger"
                      value={billgroupData.ledger}
                      onChange={handleInputChange}
                    >
                      {ledger.map((item, ind) => {
                        return (
                          <MenuItem value={item.ledger} key={ind}>
                            {item.ledger}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.ledger}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error.subLedger !== "" ? true : false}
                  >
                    <InputLabel>Sub Ledger</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }, // Adjust maxHeight as needed
                        },
                      }}
                      name="subLedger"
                      label="Sub Ledger"
                      value={billgroupData.subLedger}
                      onChange={handleInputChange}
                    >
                      {subLedger.map((item, ind) => {
                        return (
                          <MenuItem value={item.subLedger} key={ind}>
                            {item.subLedger}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.subLedger}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bill Group Name"
                    variant="outlined"
                    name="billGroupName"
                    value={billgroupData.billGroupName}
                    onChange={handleInputChange}
                    error={error.billGroupName !== "" ? true : false}
                    helperText={error.billGroupName}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bill Group Code"
                    variant="outlined"
                    name="billGroupCode"
                    value={billgroupData.billGroupCode}
                    onChange={handleInputChange}
                    error={error.billGroupCode !== "" ? true : false}
                    helperText={error.billGroupCode}
                    disabled
                  />
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    name="description"
                    value={billgroupData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="forAll"
                        checked={
                          billgroupData.forAll === "true" ||
                          billgroupData.forAll === true
                        }
                        onChange={handleInputChange}
                        color="primary"
                      />
                    }
                    label="For All Branch"
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="btnGroup">
                    <IconButton
                      type="submit"
                      title="Update"
                      className="btnPopup btnSave"
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      type="submit"
                      title="Cancel"
                      onClick={() => closeRegistration()}
                      className="btnPopup btnCancel"
                    >
                      <Cancel />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
        <Modal
          open={openActiveModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <h2 className="popupHead">
              {data.status === "active" ? "Inactivate" : "Activate"}{" "}
              {data.billGroupName} Bill Group?
            </h2>
            <div className="deleteBtnGroup">
              <IconButton
                title={data.status === "active" ? "Inactivate" : "Activate"}
                className={`btnPopup ${data.status === "active" ? "btnDelete" : "btnSave"
                  }`}
                onClick={() => activateBillgroup(data._id)}
              >
                <TouchApp />
              </IconButton>
              <IconButton
                title="Cancel"
                onClick={() => closeRegistration()}
                className="btnPopup btnCancel"
              >
                <Cancel />
              </IconButton>
            </div>
          </div>
        </Modal>
        <Modal
          open={openDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <h2 className="popupHead">
              Delete {data.billGroupName} Bill Group?
            </h2>
            <div style={{marginTop:"1rem"}}>
              <Button
                title="Delete"
                onClick={() => deleteBillgroup(data._id)}
              >
                Delete
              </Button>
              <Button
                type="submit"
                title="Cancel"
                onClick={() => closeRegistration()}
              >
                Cancel 
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
      <ToastContainer/>
    </>
  );
};

export default Billgroup;
