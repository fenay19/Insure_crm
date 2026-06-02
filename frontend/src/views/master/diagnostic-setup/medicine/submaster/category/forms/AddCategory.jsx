import React, { useState } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
// import { useToast } from "@chakra-ui/react";


import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";

const AddCategory = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    categoryName: "",
  });
  const [error, setError] = useState({
    categoryName: "",
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

    if (inputData.categoryName === "") {
      setError((prev) => {
        return {...prev, categoryName: "Category Name is required"}
      })
    }
    if (inputData.categoryName !== "") {
    await post('category-master',inputData)
        .then(() => {
          setInputData({
            categoryName: "",
          });
          // toast({
          //   title: "Prefix Added",
          //   status: "success",
          //   duration: 4000,
          //   isClosable: true,
          //   position: "bottom",
          // });
          handleClose();
          getData();
        })
        .catch((error) => {
          if(error.response.msg !== undefined) {
            // toast({
            //   title: "Error",
            //   description: error.response.data.msg,
            //   status: "error",
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
            alert(error.response.msg)
          } else {
            // toast({
            //   title: 'Something went wrong, Please try later!!',
            //   status: 'error',
            //   duration: 4000,
            //   isClosable: true,
            //   position: "bottom",
            // });
          }
      })
    }
  };


  return (
    <div className="modal">
      <h2 className="popupHead">Add Category Name</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category Name"
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

export default AddCategory;

