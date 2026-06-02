import React, { useEffect, useState } from 'react'
import { Cancel, Save } from "@mui/icons-material";
import { get, post } from "api/api";
import { toast } from 'react-toastify';
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const AddRoomNo = ({ handleClose, getData }) => {
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [inputData, setInputData] = useState({
    roomTypeId:"",
    roomNo: "",
  });
  const [error, setError] = useState({
    roomType:"",
    roomNo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name ==='roomTypeId') {
      const findData = roomTypeData.find(data => data._id === value);
      setInputData((prev) => {
        return {...prev, roomType: findData.roomType, roomTypeId: value}
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

  const fetchRoomType = async () => {
    await get('room-type')
      .then((response) => {
        let addsr = [];
        response.data.forEach((val, index) => {
          addsr.push({ ...val, sr: index + 1 });
        });
        setRoomTypeData(addsr);
      })
      .catch((err) => toast.error('Something went wrong, Please try later!!'));
  };

  useEffect(() => {
    fetchRoomType();
  }, []);

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (inputData.roomNo === "") {
      setError((prev) => {
        return {...prev, roomNo: "room no is required"}
      })
    }
    if (inputData.roomType === "") {
      setError((prev) => {
        return {...prev, roomType: "room type is required"}
      })
    }
    if (inputData.roomNo !== "") {
    await post('room-no',inputData)
        .then(() => {
          setInputData({
            roomNo: "",
          });
          toast.success("Room Name Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.data.msg !== undefined) {
            toast.error(error.response.data.msg);
            // alert(error.response.data.msg)
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Add Room No./Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="roomTypeId"
                      label="Room Type"
                      value={inputData.roomTypeId}
                      onChange={handleInputChange}
                    >
                      {roomTypeData.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.roomType}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText style={{color:"red"}}>{error.roomType}</FormHelperText>
                  </FormControl>
                </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room No./Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.roomNo}
              name="roomNo"
              error={error.roomNo !== "" ? true : false}
              helperText={error.roomNo}
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

export default AddRoomNo;

