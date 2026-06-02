import {
  Box,
  TableBody,
  IconButton,
  Input,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  useMediaQuery,
} from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";
import { useState, useEffect } from "react";
import {retrieveToken} from 'api/api'
import axios from "axios";
import REACT_APP_BASE_URL from "api/api";

const OldMedicalPrescription = ({ oldPrescriptions, setOldPrescriptions }) => {
  const [dateSearch, setDateSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const matches = useMediaQuery("(max-width:1199px)");
  const token = retrieveToken();

  const [oldMedicinePatient, setOldMedicinePatient] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [showMedicine, setShowMedicine] = useState([]);

  const getPatientOldMedicalPrescription = async () => {
    await axios
      .get(
        `${REACT_APP_BASE_URL}patient-medical-prescription/old-prescription/${
          JSON.parse(localStorage.getItem("patientConsult")).patientId
        }/${JSON.parse(localStorage.getItem("patientConsult")).consultantId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        let r = [];
        response.data.presecription.forEach((v, ind) => {
          const date = new Date(v.createdAt);
          // Extract day, month, and year
          const day = String(date.getUTCDate()).padStart(2, "0"); // Ensure 2 digits
          const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
          const year = date.getUTCFullYear();

          // Format into dd-mm-yyyy
          let formattedDate = `${day}-${month}-${year}`;

          if (v.medical.length > 0 || v.glass.length > 0) {
            r.push({
              ...v,
              date: formattedDate,
            });
          }
        });
        let a = []
        r.forEach((v, ind) => {
          a.push({...v, sr: ind + 1})
        })
        setOldMedicinePatient(a);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPatientOldMedicalPrescription();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.entries(oldMedicinePatient).length > 0) {
      if (dateSearch === "") {
        setShowMedicine(oldMedicinePatient);

        setOldPrescriptions(oldMedicinePatient[0]);

        //call api and set all data
      } else {
        //call api get data of particular date
        let d = [];
        oldMedicinePatient.forEach((v) => {
          if (
            v.date ===
            `${dateSearch.split("-")[2]}-${dateSearch.split("-")[1]}-${
              dateSearch.split("-")[0]
            }`
          ) {
            d.push(v);
            setOldPrescriptions(v);
          }
        });
        setShowMedicine(d);
      }
    }
    // eslint-disable-next-line
  }, [dateSearch, oldMedicinePatient]);

  const handleDateSearch = (e) => {
    setDateSearch(e.target.value);
    // let serchM = []
    // medicine.forEach((v) => {
    //     if (v.brandName.toLowerCase().includes(e.target.value.toLowerCase())) {
    //         serchM.push(v)
    //     }
    // })
    // setShowMedicine(serchM)
  };

  return (
    <>
      <Input
        className="date_select"
        type="date"
        onChange={handleDateSearch}
        value={dateSearch}
        style={{ marginTop: "5px" }}
      />
      <Button
        style={{
          marginLeft: "10px",
          fontSize: "12px",
          padding: "2px 5px",
          marginTop: "5px",
        }}
        variant="contained"
        color="error"
        onClick={() => {
          setDateSearch("");
        }}
      >
        Clear Date
      </Button>
      <Box className="old_select_medicine_show">
        {showMedicine && showMedicine.length === 0 ? (
          <h2 className="noFoundOPd">Not Found</h2>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No.</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Prescription Intent</TableCell>
                    {!matches && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showMedicine &&
                    showMedicine
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow
                          key={index}
                          className={
                            item.date === oldPrescriptions.date
                              ? "oldPresActive"
                              : ""
                          }
                          onClick={() => {
                            setOldPrescriptions(item);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>{item.sr}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            {item.medical.length > 0 &&
                              item.medical[0].intentNumber}
                          </TableCell>
                          {!matches && (
                            <TableCell>
                              <IconButton
                                title="View Prescription"
                                onClick={() => {
                                  setOldPrescriptions(item);
                                }}
                              >
                                <RemoveRedEye className="btnSave" />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            {showMedicine.length > rowsPerPage && (
              <TablePagination
                rowsPerPageOptions={[15]}
                component="div"
                count={showMedicine.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        )}

        {/* {(dateSearch.length > 0 && showMedicine.length > 0) ?
                    <>
                        {showMedicine.map((val, ind) => {
                            return <Chip
                            className={`${val.brandName === selectedMedicine.brandName ? 'medicine_chip_selected_active_doseA' :'medicine_chip_selected_active_dose'}`}
                            avatar={<Avatar className='medicine_avatar_selected'>{val.type.substring(0, 3).toUpperCase()}</Avatar>}
                                label={`${val.brandName} (${val.dose})`}
                                onClick={() => {
                                    setSelectedMedicine(val)
                                    selectedMedicineHandler(val)
                                }}
                            />
                        })}
                    </>
                    :
                    <>
                        {dateSearch.length === 0 &&
                            <Box>Please Select Date</Box>
                        }
                        {showMedicine.length === 0 &&
                            <Box>You are not visite hospital at {dateSearch}</Box>
                        }
                    </>
                } */}
      </Box>
    </>
  );
};

export default OldMedicalPrescription;
