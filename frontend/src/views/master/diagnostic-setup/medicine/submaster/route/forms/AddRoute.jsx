import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";
import { toast } from "react-toastify";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";

const AddRoute = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    routeName: "",
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

    if (inputData.routeName === "") {
      setError((prev) => {
        return {...prev, routeName: "Route Name is required"}
      })
    }
    if (inputData.genericName !== "") {
    await post('route-master',inputData)
        .then(() => {
          setInputData({
            routeName: "",
          });
          toast.success("Route Added");
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.msg !== undefined) {
            toast.error(error.response.data.msg)

            alert(error.response.msg)
          } else {
            toast.error('Something went wrong, Please try later!!')
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Add Route Name</h2>
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

export default AddRoute;

