import React, { useEffect, useState } from 'react'
import { Cancel, Save } from "@mui/icons-material";
import { get, post } from "api/api";
import { toast } from 'react-toastify';
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const AddBed = ({ handleClose, getData }) => {
  const [roomNameData, setRoomNameData] = useState([]);

  const [inputData, setInputData] = useState({
    roomName:"",
    roomNameId:"",
    bedNo: "",
    totalBeds:[]
  });
  const [error, setError] = useState({
    roomName:"",
    bedNo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name ==='roomNameId') {
      const findData = roomNameData.find(data => data._id === value);
      setInputData((prev) => {
        return {...prev, roomName: findData.roomNo, roomNameId: value}
      });
    }

    setInputData((prev) => {
        return {...prev, [name]: value}
      }
    );
    setError((prev) => {
        return {...prev, [name]: ""}
      }
    );
  };


  const handleSubmitData = async (e) => {
    e.preventDefault();

    // Validate fields
    if (inputData.roomNameId === "") {
        setError((prev) => {
            return { ...prev, roomName: "Room Name is required" };
        });
        return;
    }
    if (inputData.bedNo === "") {
        setError((prev) => {
            return { ...prev, bedNo: "Total Bed is required" };
        });
        return;
    }

    // Calculate totalBeds
    const totalBeds = [];
    for (let i = 1; i <= parseInt(inputData.bedNo, 10); i++) {
        totalBeds.push(`${inputData.roomName.substring(0, 3).toUpperCase()}_${String(i).padStart(3, '0')}`);
    }

    // Prepare data
    const requestData = {
        ...inputData,
        totalBeds
    };

    try {
        await post('bed-master', requestData);
        toast.success("Bed details added successfully");
        setInputData({
            roomName: "",
            roomNameId: "",
            bedNo: "",
            totalBeds: []
        });
        handleClose();
        getData();
    } catch (error) {
        if (error.response?.data?.msg) {
            toast.error(error.response.data.msg);
        } else {
            toast.error("Something went wrong, please try later!");
        }
    }
};


  const getRoomNameData = async () => {
    await get('room-no').then(response => {
      setRoomNameData(response.data)
    })
  }

  useEffect(() => {
    getRoomNameData()
    // eslint-disable-next-line
  }, [])


  return (
    <div className="modal">
      <h2 className="popupHead">Add Room No./Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Room No./Name</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="roomNameId"
                      label="Room Name"
                      value={inputData.roomNameId}
                      onChange={handleInputChange}
                    >
                      {roomNameData.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.roomNo}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText style={{color:"red"}}>{error.roomName}</FormHelperText>
                  </FormControl>
                </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Total Bed"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.bedNo}
              name="bedNo"
              error={error.bedNo !== "" ? true : false}
              helperText={error.bedNo}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton type="submit" title="Cancel" onClick={handleClose} className="btnCancel">
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddBed;

