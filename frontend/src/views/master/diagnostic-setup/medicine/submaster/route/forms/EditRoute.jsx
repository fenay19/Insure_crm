import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { Cancel, Save } from "@mui/icons-material";
import { post, put } from "api/api";

const EditRoute = ({ handleClose, getData, editData}) => {
  const [inputData, setInputData] = useState({
    routeName: editData.routeName,
  });
  const [error, setError] = useState({
    routeName: "",
  });
  // const toast = useToast();

 

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

    if (inputData.employeeRole === "") {
      setError((prev) => {
        return {...prev, routeName: "Route Name is required"}
      })
    }
    if (inputData.routeName !== "") {
    await put(`route-master/${editData._id}`,inputData)
        .then(() => {
          setInputData({
            routeName: "",
          });
          toast.success(`Route ${editData.routeName}`);
          
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.msg !== undefined) {
            toast.error(error.response.data.msg)
          } else {
            toast.error("Something went wrong!")
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">update Route Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Route Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.routeName}
              name="routeName"
              error={error.routeName !== "" ? true : false}
              helperText={error.routeName}
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

export default EditRoute;

