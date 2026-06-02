import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import NoDataPlaceholder from '../../../../../../component/NoDataPlaceholder';
import Loader from 'component/Loader/Loader';
import { get, put } from 'api/api';
import DataTable from 'component/DataTable';
import { Button } from '@mui/material';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditCategory from './forms/EditCategory';
import AddCategory from './forms/AddCategory';
import ImportExport from 'component/ImportExport';

const CategoryMaster = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const headerFields = ['Category Name'];

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
    await get('category-master').then((response) => {
      let addsr = [];
      response.data.forEach((val, index) => {
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
      return item.categoryName.toLowerCase().includes(searchValue);
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
    await put(`category-master/delete/${id}`)
      .then(() => {
        getData();
        // toast({
        //   title: `${data.employeeRole} Employee Role deleted!!`,
        //   status: "success",
        //   duration: 4000,
        //   isClosable: true,
        //   position: "bottom",
        // });
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        // toast({
        //   title: "Something went wrong, Please try later!!",
        //   status: "error",
        //   duration: 4000,
        //   isClosable: true,
        //   position: "bottom",
        // });
      });
  };

  // IMPORT EXPORT
  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData?.forEach((val) => {
      let d = {};

      if (!headerFields?.some((i) => i?.trim() === '')) {
        d = {
          categoryName: val['Category Name']
        };
        newData.push(d);
      }
    });
    return newData;
  };

  const exportDataHandler = () => {
    let data = [];
    showData?.forEach((val, ind) => {
      data.push({
        SN: ind + 1,
        'Category Name': val?.categoryName
      });
    });
    return data;
  };

  const columns = ['SN', 'Category Name', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Category Name': item.categoryName,
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
                name="Category Master"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="category-master/import"
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
              <AddCategory handleClose={closeRegistration} getData={getData} />
            ) : (
              <EditCategory handleClose={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.categoryName} category Name?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data)}>delete</Button>
                <Button title="Cancel" onClick={() => closeRegistration()}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </>
      </>
    </>
  );
};

export default CategoryMaster;
