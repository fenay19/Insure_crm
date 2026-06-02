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
import { toast, ToastContainer } from 'react-toastify';
import AddLedger from './forms/AddLedger';
import EditLedger from './forms/EditLedger';

const Ledger = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  //   const toast = useToast();
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const headerFields = ['Ledger Type', 'Ledger'];
  const downheaderFields = ['Ledger Type', 'Ledger'];

  const openDeleteModalFun = (data) => {
    setData(data);
    console.log('data', data);
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
    await get('ledger').then((response) => {
      let addsr = [];
      response.allLedger.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setServerData(addsr);
      setLoader(false);
    }).catch(err =>
      toast.error('Something went wrong, Please try later!!')
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData.filter((item) => {
      return item.ledger.toLowerCase().includes(searchValue);
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
    await put(`ledger/delete/${id}`)
      .then(() => {
        getData();
        toast.error('Ledger deleted');
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};
      if (val['Ledger Type'] !== '' && val['Ledger'] !== '') {
        d = {
          ledgerType: val['Ledger Type'],
          ledger: val['Ledger']
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
        'Ledger Type': val.ledgerType?.replace(/,/g, ''),
        Ledger: val.ledger?.replace(/,/g, '')
      });
    });
    return datadd;
  };

  const columns = ['SN', 'Ledger Type', 'Ledger', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Ledger Type': item.ledgerType,
        Ledger: item.ledger,
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
      <Breadcrumb title="Ledger">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Ledger
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
                name="Ledger"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="ledger/import"
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
              <AddLedger close={closeRegistration} getData={getData} />
            ) : (
              <EditLedger close={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.ledger} ledger?</h2>
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
      <ToastContainer/>
    </>
  );
};

export default Ledger;
