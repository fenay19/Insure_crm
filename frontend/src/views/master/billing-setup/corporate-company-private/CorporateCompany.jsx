import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import NoDataPlaceholder from '../../../../component/NoDataPlaceholder';
import ImportExport from '../../../../component/ImportExport';
import Loader from 'component/Loader/Loader';
import { get, put } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { toast } from 'react-toastify';
import AddCompany from './forms/AddCompany';
import EditCompany from './forms/EditCompany';

const CorporateCompanyPrivate = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  //   const toast = useToast();
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const headerFields = ['Corporate Company Private Name'];
  const downheaderFields = ['Corporate Company Private Name'];

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const getData = async () => {
    setLoader(true);
    await get('insurance-company/co-operative-private').then((response) => {
      let addsr = [];
      response.allCooperativeCompany.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
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
    return  item.cooperativeCompanyName.toLowerCase().includes(searchValue);
    });
    let addsr = [];
    filteredData?.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType(!type);
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteData = async (id) => {
    await put(`insurance-company/co-operative-private/delete/${id}`)
      .then(() => {
        getData();
        toast.error(`${data.cooperativeCompanyName} Company Deleted`);
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData?.forEach((val) => {
      let d = {};
      if (val['Corporate Company Private Name'] !== undefined) {
        d = {
          cooperativeCompanyName: val['Corporate Company Private Name']
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
        'Corporate Company Private Name': val.cooperativeCompanyName
      });
    });
    return datadd;
  };

  const columns = ['SN', 'Corporate Company Private', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Corporate Company Private': item.cooperativeCompanyName,
        Action: (
          <div className="action_btn">
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });

  return (
    <>
      <Breadcrumb title="Corporate Company Private">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Corporate Company Private
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <ImportExport
                update={getData}
                headerFields={headerFields}
                downheaderFields={downheaderFields}
                name="corporate-company-private"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="insurance-company/co-operative-private/import"
              />
            </div>
          </div>

          {loader ? (
            <Loader />
          ) : (
            <>{showData && showData.length === 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</>
          )}
          <Modal open={openRegistrationModal}>
            {type === 'add' ? (
              <AddCompany close={closeRegistration} fetchData={getData} />
            ) : (
              <EditCompany close={closeRegistration} editData={editData} fetchData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.cooperativeCompanyName} company?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data._id)}>delete</Button>
                <Button title="Cancel" onClick={() => closeRegistration()}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
      </Card>
    </>
  );
};

export default CorporateCompanyPrivate;
