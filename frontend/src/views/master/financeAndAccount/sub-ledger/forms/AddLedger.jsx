import React, { useState, useEffect } from "react";
import {
    FormControl,
    Grid,
    IconButton,
    TextField,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { post, get } from "api/api";
import { toast } from "react-toastify";

const AddLedger = ({ close, fetchData }) => {
    const [error, setError] = useState({});
    const [ledger, setLedger] = useState([]);
    const [inputData, setInputData] = useState({
        ledger: "",
        ledgerId: "",
        subLedger: "",
    });

    // Fetching Ledger List
    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const response = await get("ledger");
                if (response.allLedger) {
                    setLedger(response.allLedger);
                }
            } catch (error) {
                console.error("Error fetching ledger:", error);
            }
        };
        fetchLedger();
    }, []);

    // Handling Ledger Selection
    const handleLedgerSelect = (e) => {
        const id = e.target.value;
        const selectedLedger = ledger.find((item) => item._id === id);
        if (selectedLedger) {
            setInputData((prevData) => ({
                ...prevData,
                ledgerId: selectedLedger._id,
                ledger: selectedLedger.ledger,
            }));
        } else {
            setInputData((prevData) => ({
                ...prevData,
                ledgerId: "",
                ledger: "",
            }));
        }

        if (error.ledgerId) {
            setError({ ...error, ledgerId: "" });
        }
    };

    // Handling Input Changes
    const handleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
        if (error[e.target.name]) {
            setError({ ...error, [e.target.name]: "" });
        }
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};

        // Validation
        if (inputData.ledgerId === "") {
            newError.ledgerId = "Ledger is required";
        }
        if (inputData.subLedger.trim() === "") {
            newError.subLedger = "Sub Ledger is required";
        }

        setError(newError);

        // If no errors, proceed with API call
        if (Object.keys(newError).length === 0) {
            try {
                await post("ledger/sub-ledger", inputData);
                setInputData({
                    ledgerId: "",
                    subLedger: "",
                    ledger: "",
                });
                toast.success("Sub Ledger Added");
                close();
                fetchData();
            } catch (error) {
                toast.error("Something went wrong, please try again later!");
            }
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <div className="popupHead">
                    <h2>Add Sub Ledger</h2>
                </div>
                <div>
                    <Grid container spacing={2} mt={1}>
                        {/* Ledger Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" error={!!error.ledgerId}>
                                <InputLabel id="ledger-label">Ledger</InputLabel>
                                <Select
                                    labelId="ledger-label"
                                    name="ledgerId"
                                    value={inputData.ledgerId}
                                    onChange={handleLedgerSelect}
                                    label="Ledger"
                                    error={!!error.ledgerId}
                                >
                                    <MenuItem value="">
                                        <em>Select Ledger</em>
                                    </MenuItem>
                                    {ledger.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.ledger}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {error.ledgerId && (
                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                        {error.ledgerId}
                                    </p>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Sub Ledger Input */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Sub Ledger"
                                    type="text"
                                    variant="outlined"
                                    name="subLedger"
                                    value={inputData.subLedger}
                                    onChange={handleInputChange}
                                    error={!!error.subLedger}
                                    helperText={error.subLedger}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>

                {/* Action Buttons */}
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

export default AddLedger;
