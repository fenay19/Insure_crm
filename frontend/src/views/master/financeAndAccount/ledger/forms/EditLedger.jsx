import React, { useState } from "react";
import {
    FormControl,
    Grid,
    IconButton,
    TextField,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import { post, put } from "api/api";

const EditLedger = ({ close, getData,editData }) => {
    const [error, setError] = useState({});
    const [inputData, setInputData] = useState({
        ledgerType:editData.ledgerType,
        ledger:editData.ledger,
    });

    const handleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
        if (error[e.target.name]) {
            setError({ ...error, [e.target.name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
    
        // Validate input fields
        if (inputData.ledgerType === "") {
            newError.ledgerType = "Ledger type is required";
        }
        if (inputData.ledger === "") {
            newError.ledger = "Ledger is required";
        }
    
        setError(newError);
    
        // If there are no validation errors, proceed with the API call
        if (Object.keys(newError).length === 0) {
            try {
                await put(`ledger/${editData._id}`, inputData);
                setInputData({
                    ledgerType: '',
                    ledger: "",
                });   
                toast.success("Ledger updated");

                close();
                getData();
            } catch (error) {
                toast.error(`Error: ${error.message}`);
            }
        }
    };
    
    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <div className="popupHead">
                    <h2>updated Ledger</h2>
                </div>
                <div>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Ledger Type"
                                    type="text"
                                    variant="outlined"
                                    name="ledgerType"
                                    value={inputData.ledgerType}
                                    onChange={handleInputChange}
                                    error={!!error.ledgerType}
                                    helperText={error.ledgerType}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Ledger"
                                    type="text"
                                    variant="outlined"
                                    name="ledger"
                                    value={inputData.ledger}
                                    onChange={handleInputChange}
                                    error={!!error.ledger}
                                    helperText={error.ledger}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <Grid item xs={12}>
                    <div className="btnGroup">
                        <IconButton
                            title="Save"
                            className="btnPopup btnSave"
                            type="submit"
                        >
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

export default EditLedger;
