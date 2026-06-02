import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import NoDataPlaceholder from "../../../../component/NoDataPlaceholder";
import ImportExport from "../../../../component/ImportExport";
import Loader from "component/Loader/Loader";
import { get, put, remove } from "api/api";
import Breadcrumb from 'component/Breadcrumb'
import DataTable from "component/DataTable";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EditBtn from "component/buttons/EditBtn";
import DeleteBtn from "component/buttons/DeleteBtn";
import AddMode from "./forms/AddMode";
import EditMode from "./forms/EditMode";
import { toast, ToastContainer } from "react-toastify";

const PaymentMode = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
//   const toast = useToast();
  const [type, setType] = useState("add");
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);



  // Use the custom hook

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType("add");
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const getData = async () => {
    setLoader(true);
      await get('payment-mode').then((response) => {
            let addsr = []
            response.paymentMode.forEach((val, index) => {
              addsr.push({ ...val, sr: index + 1 })
            })
            
        setShowData(addsr);
        setServerData(addsr);
        setLoader(false);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData.filter((item) => {
      return item.paymentMode.toLowerCase().includes(searchValue);
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType(!type);
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteEmployeeRole = async (id) => {
      await remove(`payment-mode/${id}`).then(() => {
        getData();
        toast.error(`${data.employeeRole} Employee Role deleted!!`);
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error("Something went wrong, Please try later!!");
      });
  };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};
      if (val["Payment Mode"] !== "") {
        d = {
          paymentMode: val["Payment Mode"],
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
        "Payment Mode": val.paymentMode?.replace(/,/g, " "),
      });
    });
    return datadd;
  };

  const columns=["SN", "Payment Mode", "Action"]
  const finalData = showData&&showData.map((item,ind)=>{
    return {
      SN: ind + 1,
      "Payment Mode": item.paymentMode,
      Action: (
        <div className="action_btn">
          <EditBtn
            onClick={() => handleEdit(item)}
            />
          <DeleteBtn
            onClick={() => openDeleteModalFun(item._id)}
            />
        </div>
      ),
    }
  })

  return (
    <>
    <Breadcrumb title='Payment Mode'>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
        Payment Mode
        </Typography>
      </Breadcrumb>
      <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:"1rem" }}>
          <Button variant="contained" className="global_btn" onClick={openRegistration}>
            + Add
          </Button>

         
          <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
          <input
            style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
            className="search_input"
            type="search"
            placeholder="Search..."
            onChange={filterData}
          />
          
        </div>
        </div>
        
        {loader ? (
          <Loader />
        ) : (
          <>
            {showData && showData.length === 0 ? (
              <NoDataPlaceholder />
            ) : (
              <DataTable columns={columns} data={finalData} />
            )}
           
          </>
        )}
        <Modal open={openRegistrationModal}>
          {type === "add" ? (
            <AddMode
              handleClose={closeRegistration}
              getData={getData}
            />
          ) : (
            <EditMode
              handleClose={closeRegistration}
              editData={editData}
              getData={getData}
            />
          )}
        </Modal>
        <Modal
          open={openDeleteModal}
          onClose={closeRegistration}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <h2 className="popupHead">
              Delete {data.paymentMode} payment Mode?
            </h2>
            <div style={{marginTop:"2rem"}}>
              <Button
                onClick={() => deleteEmployeeRole(data)}
              >
                delete
              </Button>
              <Button
                title="Cancel"
                onClick={() => closeRegistration()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        </CardContent>
      </Card>
      <ToastContainer/>
    </>
  );
};

export default PaymentMode;
