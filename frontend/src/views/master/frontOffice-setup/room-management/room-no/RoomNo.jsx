import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Loader from "component/Loader/Loader";
import { get, put } from "api/api";
import DataTable from "component/DataTable";
import { Button, CardContent, Typography } from "@mui/material";
import { toast } from "react-toastify";
import EditBtn from "component/buttons/EditBtn";
import DeleteBtn from "component/buttons/DeleteBtn";
import ImportExport from "component/ImportExport";
import NoDataPlaceholder from "component/NoDataPlaceholder";
import AddRoomNo from "./forms/AddRoomNo";
import EditRoomNo from "./forms/EditRoomNo";

const RoomNo = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState("add");
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const headerFields = ["Room Type", "Room No/Name"];
  const downheaderFields = ["Room Type", "Room No/Name"];

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
    try {
      const response = await get("room-no");
      const addsr = response.data.map((val, index) => ({ ...val, sr: index + 1 }));
      setServerData(addsr);
      setShowData(addsr);
    } catch (error) {
      toast.error("Failed to fetch room data");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData.filter((item) => {
      return (
        item.roomNo?.toLowerCase().includes(searchValue) ||
        item.roomType?.toLowerCase().includes(searchValue)
      );
    });
    const addsr = filteredData.map((val, index) => ({ ...val, sr: index + 1 }));
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType("edit");
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteData = async (id) => {
    try {
      await put(`room-no/delete/${id}`);
      toast.success(`${data.roomNo} Room No deleted!`);
      getData();
    } catch (error) {
      toast.error("Failed to delete room. Please try again later.");
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const fileValidationHandler = (fileData) => {
    return fileData.reduce((acc, val) => {
      if (val["Room Type"] && val["Room No/Name"]) {
        acc.push({
          roomNo: val["Room No/Name"],
          roomType: val["Room Type"],
        });
      }
      return acc;
    }, []);
  };

  const exportDataHandler = () => {
    return showData.map((val, ind) => ({
      SN: ind + 1,
      "Room Type": val.roomType?.replace(/,/g, ""),
      "Room No/Name": val.roomNo?.replace(/,/g, " "),
    }));
  };

  const columns = ["SN", "Room Type", "Room No/Name", "Action"];
  const finalData = showData.map((item, ind) => ({
    SN: ind + 1,
    "Room Type": item.roomType,
    "Room No/Name": item.roomNo,
    Action: (
      <div className="action_btn">
        <EditBtn onClick={() => handleEdit(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item)} />
      </div>
    ),
  }));

  return (
    <CardContent>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="contained" className="global_btn" onClick={openRegistration}>
          + Add
        </Button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            style={{ height: "40px", padding: "5px", borderRadius: "5px", border: "1px solid #126078" }}
            type="search"
            placeholder="Search..."
            onChange={filterData}
          />
          <ImportExport
            update={getData}
            headerFields={headerFields}
            downheaderFields={downheaderFields}
            name="Room Name"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="room-no/import"
          />
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : showData.length === 0 ? (
        <NoDataPlaceholder />
      ) : (
        <DataTable columns={columns} data={finalData} />
      )}
      <Modal open={openRegistrationModal}>
        {type === "add" ? (
          <AddRoomNo handleClose={closeRegistration} getData={getData} />
        ) : (
          <EditRoomNo handleClose={closeRegistration} editData={editData} getData={getData} />
        )}
      </Modal>
      <Modal open={openDeleteModal} onClose={closeRegistration}>
        <div className="modal">
          <h2>Delete {data.roomNo} Room Name?</h2>
          <div style={{ marginTop: "2rem" }}>
            <Button onClick={() => deleteData(data._id)}>Delete</Button>
            <Button onClick={closeRegistration}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </CardContent>
  );
};

export default RoomNo;
