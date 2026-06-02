import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { get, post, remove } from 'api/api';
import { toast } from 'react-toastify';
import AddMedicine from './forms/AddMedicine';
import EditMedicine from './forms/EditMedicine';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import Loader from 'component/Loader/Loader';
import DataTable from 'component/DataTable';
import 'react-toastify/dist/ReactToastify.css';
import ImportExport from 'component/ImportExport';
import { AiFillEye } from 'react-icons/ai';

const MedicineMaster = () => {
  const [medicineData, setMedicineData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionData, setInstructionData] = useState({});

  const handleInstructionModalOpen = (item) => {
    setInstructionData(item);
    setInstructionModalOpen(true);
  };

  const handleInstructionModalClose = () => {
    setInstructionModalOpen(false);
  };

  const openDeleteModalFun = (item) => {
    setData(item);
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

  const handleEdit = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  // Fetch Medicines Data
  const fetchData = async () => {
    setLoader(true);
    try {
      const response = await get('medicines');
      const addsr = response.allMedicines.map((val, index) => ({
        ...val,
        sr: index + 1
      }));
      setMedicineData(addsr);
      setFilterData(addsr);
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Medicines Data
  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return (
        (item.genericName && item.genericName.toLowerCase().includes(searchValue)) ||
        (item.type && item.type.toLowerCase().includes(searchValue)) ||
        (item.category && item.category.toLowerCase().includes(searchValue)) ||
        (item.brandName && item.brandName.toLowerCase().includes(searchValue)) ||
        (item.dose && item.dose.toLowerCase().includes(searchValue)) ||
        (item.route && item.route.toLowerCase().includes(searchValue))
      );
    });

    console.log('filteredData', filteredData);

    const addsr = filteredData.map((val, index) => ({
      ...val,
      sr: index + 1
    }));
    setMedicineData(addsr);
  };

  // Delete Medicine
  const deleteMedicine = async (id) => {
    try {
      const ids = [id];
      const response = await remove('medicines', ids);
      if (response) {
        fetchData();
        toast.success(`${data.genericName} Medicine Deleted`);
        setOpenDeleteModal(false);
      } else {
        toast.error('Failed to delete medicine');
      }
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  // File Validation
  const fileValidationHandler = (fileData) => {
    return fileData.map((val) => ({
      genericName: val['Generic Name/Formula/Composition'],
      brandName: val['Brand Name'],
      type: val['Type/Form'],
      category: val['Category'],
      route: val['Route'],
      dose: val['Dose'],
      flag: val['Flag']?.toLowerCase() === 'true',
      instruction: val['Instruction'] || 'NA',
      relatedDrug: val['Related Drug'] || 'NA'
    }));
  };

  const exportDataHandler = () => {
    let datadd = [];
    medicineData?.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Generic Name/Formula/Composition': val.genericName,
        'Brand Name': val.brandName,
        'Type/Form': val.type,
        Category: val.category,
        Route: val.route,
        Dose: val.dose,
        Flag: val.flag.toString(),
        Instruction: val.instruction,
        'Related Drug': val.relatedDrug
      });
    });
    return datadd;
  };

  // const handleImport = async () => {
  //   if (inputVal.length === 0) {
  //     setUploadErr('No valid data to import');
  //     return;
  //   }
  //   try {
  //     const response = await post('medicines/import', { medicines: inputVal });
  //     if (response.ok) {
  //       fetchData();
  //       setInputVal([]);
  //       toast.success('Medicine Uploaded Successfully!!');
  //     } else {
  //       toast.error('Failed to import data');
  //     }
  //   } catch (error) {
  //     toast.error('Something went wrong, Please try later!!');
  //   }
  // };

  const headerFields = [
    'Generic Name/Formula/Composition',
    'Brand Name',
    'Type/Form',
    'Category',
    'Route',
    'Dose',
    'Flag',
    'Instruction',
    'Related Drug'
  ];
  const downheaderFields = [
    'Generic Name/Formula/Composition',
    'Brand Name',
    'Type/Form',
    'Category',
    'Route',
    'Dose',
    'Flag',
    'Instruction',
    'Related Drug'
  ];

  const columns = [
    'SR',
    'Generic Name/Formula/Composition',
    'Brand Name',
    'Type/Form',
    'Category',
    'Route',
    'Dose',
    'Flag',
    'Instruction/Related Drug',
    'Action'
  ];

  const showData = medicineData.map((item) => ({
    SR: item.sr,
    'Generic Name/Formula/Composition': item.genericName,
    'Brand Name': item.brandName,
    'Type/Form': item.type,
    Category: item.category,
    Route: item.route,
    Dose: item.dose,
    Flag: <p style={{ color: item.flag ? 'green' : 'red' }}>{item.flag ? 'True' : 'False'}</p>,
    'Instruction/Related Drug': (
      <IconButton onClick={() => handleInstructionModalOpen(item)} sx={{ width: '100%' }}>
        <AiFillEye />
      </IconButton>
    ),

    Action: (
      <div className="action_btn">
        <EditBtn onClick={() => handleEdit(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item)} />
      </div>
    )
  }));

  console.log('SHOW DATA', showData);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Button variant="contained" onClick={openRegistration}>
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
            update={fetchData}
            headerFields={headerFields}
            downheaderFields={downheaderFields}
            name="Medicine"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="medicines/import"
          />
        </div>
      </div>
      <Modal open={openRegistrationModal} onClose={closeRegistration}>
        {type === 'add' ? (
          <AddMedicine close={closeRegistration} fetchData={fetchData} />
        ) : (
          <EditMedicine editData={editData} close={closeRegistration} fetchData={fetchData} />
        )}
      </Modal>
      {loader ? <Loader /> : <DataTable data={showData} columns={columns} />}

      <Modal
        open={openDeleteModal}
        onClose={closeRegistration}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <h2 className="popupHead">Delete {data.genericName} Medicine?</h2>
          <div style={{ marginTop: '1rem' }}>
            <Button title="Delete" onClick={() => deleteMedicine(data._id)}>
              Delete
            </Button>
            <Button type="submit" title="Cancel" onClick={() => closeRegistration()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={instructionModalOpen}
        onClose={handleInstructionModalClose}
        aria-labelledby="instruction-modal-title"
        aria-describedby="instruction-modal-description"
      >
        <div className="modal">
          <h3>Instruction/Related Drug</h3>
          <div style={{ marginTop: '1rem' }}>
            <p>
              <strong>Instruction:</strong> {instructionData.instruction || 'N/A'}
            </p>
            <p>
              <strong>Related Drug:</strong> {instructionData.relatedDrug || 'N/A'}
            </p>
          </div>
          <Button style={{ marginTop: '1rem' }} onClick={handleInstructionModalClose}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MedicineMaster;
