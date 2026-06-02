import React, { useState, } from "react";
import {
    FormControl,
    Grid,
    IconButton,
    TextField,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { post } from "api/api";
import { toast } from "react-toastify";

const AddCompany = ({ close, fetchData }) => {

    const [error, setError] = useState({});
    const [inputData, setInputData] = useState({
        govermentCompanyName: "",
        
    });



    const handleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
        if (error[e.target.name]) {
            setError({ ...error, [e.target.name]: "" });
        }
    };


    async function handleSubmit(e) {
        e.preventDefault();
        const newError = {};

        if (inputData.govermentCompanyName === "") {
            newError.govermentCompanyName = "goverment Company is required";
        }


        setError(newError);
        if (Object.keys(newError).length === 0) {
          
            await post('insurance-company/gov',inputData)
        .then(() => {
          setInputData({
            govermentCompanyName: "",
          });
          toast.success("Goverment company Added");
          close();
          fetchData();
        })
        .catch((error) => {
          if(error.response.data.msg !== undefined) {
            
            toast.error(error.response.data.msg)
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
      })
        }
    }


    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <div className="popupHead">
                    <h2>Add Goverment Company</h2>
                </div>
                <div>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <FormControl fullWidth >
                                <TextField
                                    label="goverment Company"
                                    type="text"
                                    variant="outlined"
                                    name="govermentCompanyName"
                                    value={inputData.govermentCompanyName}
                                    onChange={handleInputChange}
                                    error={error.govermentCompanyName ? true : false}
                                    helperText={error.govermentCompanyName}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <Grid item xs={12}>
                    <div className="btnGroup">
                        <IconButton title="Save" className="btnPopup btnSave" type="submit">
                            <Save />
                        </IconButton>
                        <IconButton
                            title="Cancel"
                            className="btnPopup btnCancel"
                            onClick={close}
                        >
                            <Cancel />
                        </IconButton>
                    </div>
                </Grid>
            </form>
        </div>
    );
};

export default AddCompany;
