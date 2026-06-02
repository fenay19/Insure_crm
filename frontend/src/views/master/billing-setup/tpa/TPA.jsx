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
import AddTPA from './forms/AddTPA';
import EditTPA from './forms/EditTPA';

const TPA = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const headerFields = ['TPA Company Name'];
  const downheaderFields = ['TPA Company Name'];

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
    await get('insurance-company/tpa').then((response) => {
      let addsr = [];
      response.allTpaCompany.forEach((val, index) => {
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
      item.tpaCompanyName.toLowerCase().includes(searchValue);
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
    await put(`insurance-company/tpa/delete/${id}`)
      .then(() => {
        getData();
        toast.error(`${data.tpaCompanyName} Company Deleted`);
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
      if (val['TPA Company Name'] !== undefined) {
        d = {
          tpaCompanyName: val['TPA Company Name']
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
        'TPA Company Name': val.tpaCompanyName
      });
    });
    return datadd;
  };

  const columns = ['SN', 'TPA Company Name', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'TPA Company Name': item.tpaCompanyName,
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
      <Breadcrumb title="TPA Company">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          TPA Company
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
                name="TPA"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="insurance-company/tpa/import"
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
              <AddTPA close={closeRegistration} getData={getData} />
            ) : (
              <EditTPA close={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.tpaCompanyName} company delete?</h2>
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

export default TPA;
