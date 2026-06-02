import React, { useState } from 'react'
import { Cancel, Save } from "@mui/icons-material";
import { post, put } from "api/api";
import { toast } from 'react-toastify';
import { Grid, IconButton, TextField } from '@mui/material';

const EditRoom = ({ handleClose, getData,editData }) => {
  const [inputData, setInputData] = useState({
    categoryName: editData.categoryName,
  });
  const [error, setError] = useState({
    categoryName: "",
  });


  const handleSave = (event) => {
    handleSubmitData(event)
  };

  const handleCancel = () => {
    handleClose()
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

    if (inputData.categoryName === "") {
      setError((prev) => {
        return {...prev, categoryName: "category is required"}
      })
    }
    if (inputData.categoryName !== "") {
    await put(`room-category/${editData._id}`,inputData)
        .then(() => {
          setInputData({
            categoryName: "",
          });
          toast.success("Room Category Added");
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
      <h2 className="popupHead">Update Room category</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room Category"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.categoryName}
              name="categoryName"
              error={error.categoryName !== "" ? true : false}
              helperText={error.categoryName}
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

export default EditRoom;

