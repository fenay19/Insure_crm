import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import post from "../../../../api/";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";

const EditPrefix = ({ handleClose, getData,editData }) => {
  const [inputData, setInputData] = useState({
    prefix: editData.prefix,
  });
  const [error, setError] = useState({
    prefix: "",
  });
//   const toast = useToast();

  const handleSave = (event) => {
    handleSubmitData(event)
  };

  // Use the custom hook
//   useSaveOnCtrlS(handleSave);

  const handleCancel = () => {
    handleClose()
  };

  // Use the custom hook
//   useCancelEsc(handleCancel);

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

    if (inputData.prefix === "") {
      setError((prev) => {
        return {...prev, prefix: "Prefix is required"}
      })
    }
    if (inputData.prefix !== "") {
    //   await axios.post(`${REACT_APP_BASE_URL}prefix`, 
    //     inputData,
    //     {
    //       headers: { Authorization: 'Bearer ' + token },
    //     })
    await post('prefix')
        .then(() => {
          setInputData({
            prefix: "",
          });
        //   toast({
        //     title: "Prefix Added",
        //     status: "success",
        //     duration: 4000,
        //     isClosable: true,
        //     position: "bottom",
        //   });
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.data.msg !== undefined) {
            // toast({
            //   title: "Error",
            //   description: error.response.data.msg,
            //   status: "error",
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
            alert(error.response.data.msg)
          } else {
        //     toast({
        //       title: 'Something went wrong, Please try later!!',
        //       status: 'error',
        //       duration: 4000,
        //       isClosable: true,
        //       position: "bottom",
        //     });
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Update Prefix</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prefix"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.prefix}
              name="prefix"
              error={error.prefix !== "" ? true : false}
              helperText={error.prefix}
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

export default EditPrefix;

