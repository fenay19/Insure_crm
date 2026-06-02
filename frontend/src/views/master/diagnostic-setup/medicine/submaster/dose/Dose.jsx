import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import NoDataPlaceholder from '../../../../../../component/NoDataPlaceholder';
import Loader from 'component/Loader/Loader';
import { get, put } from 'api/api';
import DataTable from 'component/DataTable';
import { Button } from '@mui/material';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import AddDose from './forms/AddDose';
import EditDose from './forms/EditDose';
import { toast, ToastContainer } from 'react-toastify';
import ImportExport from 'component/ImportExport';

const Dose = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const headerFields = ['Dose'];

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
    await get('dose-master').then((response) => {
      setShowData(response.data);
      setServerData(response.data);
      setLoader(false);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const filterData = (e) => {
    const searchValue = e.target?.value?.toLowerCase();
    const filteredData = serverData.filter((item) => {
      return item?.typeName?.toLowerCase().includes(searchValue);
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

  const deleteData = async (id) => {
    await put(`dose-master/delete/${id}`)
      .then(() => {
        getData();
        toast.error(`Dose deleted!!`);
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

 

  const fileValidationHandler = (fileData) => {
    try {
      if (!Array.isArray(fileData)) {
        console.error('Invalid file data format:', fileData);
        return [];
      }

      const newData = [];

      fileData.forEach((val) => {
        if (typeof val !== 'object' || val === null) {
          console.error('Invalid row format:', val);
          return;
        }

        let d = {};

        if (headerFields?.every((i) => i?.trim() !== '')) {
          d = {
            dose: val['Dose'] || 'Unknown' // Avoid undefined values
          };
          newData.push(d);
        }
      });

      return newData;
    } catch (error) {
      console.error('Error in fileValidationHandler:', error);
      return [];
    }
  };

  const exportDataHandler = () => {
    let data = [];
    showData?.forEach((val, ind) => {
      data.push({
        SN: ind + 1,
        Dose: val?.dose
      });
    });
    return data;
  };

  const columns = ['SN', 'Dose', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        Dose: item.dose,
        Action: (
          <div className="action_btn">
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
          </div>
        )
      };
    });

  return (
    <>
      <>
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
                downheaderFields={headerFields}
                name="Dose Master"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="dose-master/import"
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
              <AddDose handleClose={closeRegistration} getData={getData} />
            ) : (
              <EditDose handleClose={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.typeName} Dose ?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data)}>delete</Button>
                <Button title="Cancel" onClick={() => closeRegistration()}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
          <ToastContainer />
        </>
      </>
    </>
  );
};

export default Dose;
