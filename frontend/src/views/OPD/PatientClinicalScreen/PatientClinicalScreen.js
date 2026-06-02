import {
  Checkbox,
  Box,
  useMediaQuery,
  IconButton,
  Drawer,
  ListItemText,
  List,
  ListItemButton,
  MenuItem,
  Grid,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import "../../css/PatientClinicalScreen.css";
import {
  AutoStories,
  Close,
  Explicit,
  HdrAuto,
  Info,
  MedicalInformation,
  Medication,
  MenuBook,
  MonitorHeart,
  Print,
  QueuePlayNext,
  ReceiptLong,
  RecentActors,
  Settings,
  Summarize,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import MenuAll from "./MenuAll/MenuAll";
import MedicalPrescription from "./MedicalPrescription/MedicalPrescription";
import Vitals from "./Vitals/Vitals";
import History from "./History/History";
import Orders from "./Orders/Orders";
import ChiefComplaint from "./ChiefComplaint/ChiefComplaint";
import ProvisionalDiagnosis from "./ProvisionalDiagnosis/ProvisionalDiagnosis";
import axios from "axios";
import REACT_APP_BASE_URL from "API/api";
import tokenHandler from "token/tokenHandler";
import { useToast } from "@chakra-ui/react";
import WidgetsLoader from "@components/WidgetsLoader";
import Examination from "./Examination/Examination";
import PatientHistory from "./PatientHistory/PatientHistory";
import PresentIllness from "./PresentIllness/PresentIllness";
import FinalDiagnosis from "./FinalDiagnosis/FinalDiagnosis";
import FollowUp from "./FollowUp/FollowUp";

const PatientClinicalScreen = ({ selectedPatient }) => {
  const [hospitalData, setHospitalData] = useState({
    ...JSON.parse(localStorage.getItem("hospiData")),
    headerImage:
      JSON.parse(localStorage.getItem("hospiData")).headerImage !== undefined &&
      JSON.parse(localStorage.getItem("hospiData")).headerImage.data !==
        undefined
        ? JSON.parse(localStorage.getItem("hospiData")).headerImage.data
        : "",
    footerImage: "",
  });

  const matches = useMediaQuery("(max-width:1199px)");
  const [consultMenu, setConsultMenu] = useState([]);
  const [consultMenuPrint, setConsultMenuPrint] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("All");
  // eslint-disable-next-line

  const [draggedItem, setDraggedItem] = useState(null);
  const [loader, setLoader] = useState(true);
  const token = tokenHandler();
  const toast = useToast();

  const [openSetting, setOpenSetting] = useState(false);

  const handleClick = (event) => {
    setOpen(!open);
  };

  useEffect(() => {
    if (document.getElementById("menuContent") !== null) {
      // eslint-disable-next-line no-unused-expressions
      document.getElementById("menuContent").scrollTop = 0;
    }
  }, [selectedMenu]);

  const toggleDrawer = () => {
    setOpenSetting((prev) => !prev);
  };

  const getClinicalMenu = async () => {
    setLoader(true);

    if (localStorage.getItem("loginRole") === "doctor") {
      await axios
        .get(`${REACT_APP_BASE_URL}opd/opd-menu`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          localStorage.setItem(
            "drConsult",
            JSON.stringify(response.data.data[0].menu)
          );
          setConsultMenu(response.data.data[0].menu);

          localStorage.setItem(
            "drConsultPrint",
            JSON.stringify(response.data.data[0].printMenu)
          );
          setConsultMenuPrint(response.data.data[0].printMenu);

          setLoader(false);
        })
        .catch((error) => {
          toast({
            title: "Something went wrong, Please try later!!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      setTimeout(() => {
        setConsultMenu(["Vitals"]);
        localStorage.setItem("drConsult", JSON.stringify(["Vitals"]));
        setConsultMenuPrint([
          "Vitals",
          "Chief Complaint",
          "Medical Prescription",
          "Orders",
        ]);
        localStorage.setItem(
          "drConsultPrint",
          JSON.stringify([
            "Vitals",
            "Chief Complaint",
            "Medical Prescription",
            "Orders",
          ])
        );
        setLoader(false);
      }, 0);
    }
  };

  useEffect(() => {
    getClinicalMenu();
    // eslint-disable-next-line
  }, [selectedPatient]);

  useEffect(() => {
    if (
      consultMenu.length > 0 &&
      localStorage.getItem("loginRole") === "doctor"
    ) {
      axios
        .put(
          `${REACT_APP_BASE_URL}opd/opd-menu/${
            JSON.parse(localStorage.getItem("loginData"))._id
          }`,
          { menu: consultMenu, printMenu: consultMenuPrint },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          setConsultMenu(response.data.data[0].menu);
          localStorage.setItem(
            "drConsult",
            JSON.stringify(response.data.data[0].menu)
          );

          setConsultMenuPrint(response.data.data[0].printMenu);
          localStorage.setItem(
            "drConsultPrint",
            JSON.stringify(response.data.data[0].printMenu)
          );

          toast({
            title: `Consultant Menu Successfully Submitted!!`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {});
    }
    // eslint-disable-next-line
  }, [consultMenu, consultMenuPrint]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  const handleDragEnter = async (e, index) => {
    if (draggedItem === null) return;
    const newList = [...consultMenu];
    newList.splice(index, 0, newList.splice(draggedItem, 1)[0]);
    setConsultMenu(newList);
    localStorage.setItem("drConsult", JSON.stringify(newList));
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const opdPrintSettingHandler = (exist) => {
    let dataExist = consultMenuPrint.includes(exist);

    let dPrint = [];
    if (dataExist) {
      consultMenuPrint.forEach((vM) => {
        if (vM !== exist) {
          dPrint.push(vM);
        }
      });
    } else {
      dPrint = [...consultMenuPrint, exist];
    }

    localStorage.setItem("drConsultPrint", JSON.stringify(dPrint));
    setConsultMenuPrint(dPrint);
  };

  const handleChange = (event) => {
    const { name, files } = event.target;
    if (files[0] === "" || files[0] === undefined) {
      setHospitalData((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    } else {
      setHospitalData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const onHeaderFooterSubmit = (e) => {
    const frm = new FormData();
    frm.append("hospitalName", hospitalData.hospitalName);
    frm.append("hospitalAddress", hospitalData.hospitalAddress);
    frm.append("State", hospitalData.State);
    frm.append("City", hospitalData.City);
    frm.append("District", hospitalData.District);
    frm.append("Pincode", hospitalData.Pincode);
    frm.append("mobileNumber", hospitalData.mobileNumber);
    frm.append("landlineNumber", hospitalData.landlineNumber);
    frm.append("email", hospitalData.email);
    frm.append("website", hospitalData.website);
    frm.append("gst", hospitalData.gst);
    frm.append("isPrimary", hospitalData.isPrimary);
    frm.append("hospitalLogo", hospitalData.hospitalLogo);
    frm.append("isPharmacy", hospitalData.isPharmacy);
    frm.append("headerImage", hospitalData.headerImage);
    frm.append("footerImage", "");

    axios
      .put(`${REACT_APP_BASE_URL}company-setup/${hospitalData._id}`, frm, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {

        if (
          response.data.updateDetail.headerImage !== undefined &&
          response.data.updateDetail.headerImage.data !== undefined
        ) {
          localStorage.setItem("hospiData", JSON.stringify(response.data.updateDetail));
          setHospitalData((prev) => {
            return {
              ...prev,
              hospitalData: response.data.updateDetail.headerImage.data,
            };
          });
        }

        toast({
          title: "Header Image Update Successfully...",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((error) => {
        toast({
          title: `Something went wrong. Please try later!!`,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" className="printSettingList">
      <>
        <Box className="printTopNameIcon">
          <h4>Print Setting</h4>
          <Close style={{ cursor: "pointer" }} onClick={toggleDrawer} />
        </Box>

        <Box sx={{ padding: "0 5px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={12} sx={{ marginTop: "10px !important" }}>
              <p style={{color:"red", marginBottom:"10px", fontSize:"12px"}}> Header Image size should be 1360px * 300px</p>
              {hospitalData.headerImage !== "" &&
              hospitalData.headerImage !== undefined &&
              typeof hospitalData.headerImage === "string" ? (
                <img
                  src={`${REACT_APP_BASE_URL.replace("/api/", "")}/images/${
                    hospitalData.headerImage
                  }`}
                  style={{ width: "99%", margin: "10px 0" }}
                  alt="Company Logo"
                />
              ) : (
                hospitalData.headerImage !== "" &&
                hospitalData.headerImage !== undefined && (
                  <img
                    src={URL.createObjectURL(hospitalData.headerImage)}
                    style={{ width: "99%", margin: "10px 0" }}
                    alt="Company Logo"
                  />
                )
              )}
              <TextField
                variant="outlined"
                label="Header Image"
                name="headerImage"
                // value={hospitalData.headerImage }
                type="file"
                inputProps={{
                  accept: "image/png, image/jpg, image/jpeg, image/svg",
                }}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {/* <Grid item xs={12} lg={12} >
              {hospitalData.footerImage !== "" &&
              hospitalData.footerImage !== undefined &&
              typeof hospitalData.footerImage === "string" ? (
                <img
                  src={`${REACT_APP_BASE_URL.replace("/api/", "")}/images/${
                    hospitalData.footerImage
                  }`}
                  style={{ width: "100px", margin: "10px 0" }}
                  alt="Company Logo"
                />
              ) : (
                hospitalData.footerImage !== "" &&
                hospitalData.footerImage !== undefined && (
                  <img
                    src={URL.createObjectURL(hospitalData.footerImage)}
                    style={{ width: "100px", margin: "10px 0" }}
                    alt="Company Logo"
                  />
                )
              )}
              <TextField
                variant="outlined"
                label="Footer Image"
                name="footerImage"
                // value={hospitalData.footerImage }
                type="file"
                inputProps={{
                  accept: "image/png, image/jpg, image/jpeg, image/svg",
                }}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            <Grid item xs={12} lg={12} style={{ marginTop: "-8px" }}>
              <Button variant="contained" onClick={onHeaderFooterSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider style={{ marginTop: "15px" }} />

        <List>
          {JSON.parse(localStorage.getItem("drConsult")).map((text, index) => (
            <Box key={index} onClick={() => opdPrintSettingHandler(text)}>
              <ListItemButton>
                <Checkbox
                  checked={consultMenuPrint.includes(text) ? true : false}
                />
                <ListItemText primary={text} />
              </ListItemButton>
            </Box>
          ))}
          <Box onClick={() => opdPrintSettingHandler("With Header")}>
            <ListItemButton>
              <Checkbox
                checked={
                  consultMenuPrint.includes("With Header") ? true : false
                }
              />
              <ListItemText primary="With Header" />
            </ListItemButton>
          </Box>
        </List>
      </>
    </Box>
  );

  return (
    <div>
      {loader ? (
        <WidgetsLoader />
      ) : (
        <>
          <Box className="topPatientMenu">
            <div className="menuParent">
              <div
                className={`${selectedMenu === "All" && "menuActive"} menu`}
                onClick={() => {
                  setSelectedMenu("All");
                }}
              >
                <HdrAuto className="menuIcon" />
                All
              </div>
              {consultMenu.map((con, ind) => {
                return (
                  (matches ? ind < 5 : ind < 10) && (
                    <div
                      className={`${selectedMenu === con && "menuActive"} menu`}
                      onClick={() => {
                        setSelectedMenu(con);
                        setOpen(false);
                      }}
                      key={ind}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ind)}
                      onDragEnter={(e) => handleDragEnter(e, ind)}
                      onDragEnd={handleDragEnd}
                    >
                      {con === "Chief Complaint" && (
                        <RecentActors className="menuIcon" />
                      )}
                      {con === "Medical History" && (
                        <Summarize className="menuIcon" />
                      )}

                      {con === "History of Present Illness" && (
                        <MenuBook className="menuIcon" />
                      )}
                      {con === "Examination" && (
                        <Explicit className="menuIcon" />
                      )}

                      {con === "Provisional Diagnosis" && (
                        <MedicalInformation className="menuIcon" />
                      )}

                      {con === "Final Diagnosis" && (
                        <Medication className="menuIcon" />
                      )}

                      {con === "Medical Prescription" && (
                        <ReceiptLong className="menuIcon" />
                      )}

                      {con === "Orders" && <Info className="menuIcon" />}
                      {con === "Follow Up" && (
                        <QueuePlayNext className="menuIcon" />
                      )}
                      {con === "Vitals" && (
                        <MonitorHeart className="menuIcon" />
                      )}
                      {con}
                    </div>
                  )
                );
              })}
              {!matches && (
                <>
                  {localStorage.getItem("loginRole") === "doctor" && (
                    <div
                      className={`${
                        selectedMenu === "Print" && "menuActive"
                      } menu`}
                      onClick={() => {
                        // setSelectedMenu("Print");
                        handleClick();
                      }}
                    >
                      <Print className="menuIcon" />
                      Print
                    </div>
                  )}
                  <div
                    className={`${
                      selectedMenu === "Review History" && "menuActive"
                    } menu`}
                    onClick={() => {
                      setSelectedMenu("Review History");
                    }}
                  >
                    <AutoStories className="menuIcon" />
                    Review History
                  </div>
                </>
              )}
            </div>
          </Box>

          <Box className="menuContent" id="menuContent">
            <div
              style={{
                display: open ? "flex" : "none",
                justifyContent: "center",
                position: "relative",
                zIndex: "1000000000000000",
              }}
            >
              <div
                className="printOption"
                style={{
                  top:
                    !(
                      JSON.parse(
                        localStorage.getItem("patientConsult")
                      ).department.toLowerCase() === "ophthalmology" ||
                      JSON.parse(
                        localStorage.getItem("patientConsult")
                      ).department.toLowerCase() === "ophthalmologist"
                    ) &&
                    matches &&
                    "89%",
                }}
              >
                {(JSON.parse(
                  localStorage.getItem("patientConsult")
                ).department.toLowerCase() === "ophthalmology" ||
                  JSON.parse(
                    localStorage.getItem("patientConsult")
                  ).department.toLowerCase() === "ophthalmologist") && (
                  <MenuItem
                    onClick={() => {
                      setOpen(false);
                      window.open(
                        "/opdGlassPrint",
                        "",
                        `width=850px, height=${window.screen.height}, top=0, left=0`
                      );
                    }}
                  >
                    Glass Prescription
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setOpen(false);
                    window.open(
                      "/opdPrint",
                      "",
                      `width=850px, height=${window.screen.height}, top=0, left=0`
                    );
                  }}
                >
                  Medical Prescription
                </MenuItem>
              </div>
            </div>
            {localStorage.getItem("loginRole") === "doctor" && (
              <IconButton
                className="printSettingIcon "
                title="Print Setting"
                onClick={toggleDrawer}
              >
                <Settings className="printSettingBtn" />
              </IconButton>
            )}

            <Drawer
              anchor="right"
              open={openSetting}
              onClose={toggleDrawer}
              className="printSettingDrawer"
            >
              {list("right")}
            </Drawer>

            {selectedMenu === "All" && (
              <MenuAll selectedMenu={selectedMenu} consultMenu={consultMenu} />
            )}
            {selectedMenu === "Medical Prescription" && (
              <MedicalPrescription selectedMenu={selectedMenu} />
            )}

            {selectedMenu === "History of Present Illness" && (
              <PresentIllness selectedMenu={selectedMenu} />
            )}

            {selectedMenu === "Vitals" && (
              <Vitals selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Medical History" && (
              <History selectedMenu={selectedMenu} />
            )}

            {selectedMenu === "Orders" && (
              <Orders selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Follow Up" && (
              <FollowUp selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Chief Complaint" && (
              <ChiefComplaint selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Provisional Diagnosis" && (
              <ProvisionalDiagnosis selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Final Diagnosis" && (
              <FinalDiagnosis selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Examination" && (
              <Examination selectedMenu={selectedMenu} />
            )}
            {selectedMenu === "Review History" && (
              <PatientHistory selectedMenu={selectedMenu} />
            )}
          </Box>

          <Box className="bottomPatientMenu">
            {consultMenu.map((con, ind) => {
              return (
                ind >= 5 && (
                  <div
                    className={`${selectedMenu === con && "menuActive"} menu`}
                    onClick={() => {
                      setSelectedMenu(con);
                    }}
                    key={ind}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ind)}
                    onDragEnter={(e) => handleDragEnter(e, ind)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e, ind)}
                    onTouchMove={(e) => handleDragEnter(e, ind)}
                    onTouchEnd={handleDragEnd}
                  >
                    {con === "Chief Complaint" && (
                      <RecentActors className="menuIcon" />
                    )}
                    {con === "Medical History" && (
                      <Summarize className="menuIcon" />
                    )}
                    {con === "History of Present Illness" && (
                      <MenuBook className="menuIcon" />
                    )}
                    {con === "Examination" && <Explicit className="menuIcon" />}

                    {con === "Provisional Diagnosis" && (
                      <MedicalInformation className="menuIcon" />
                    )}

                    {con === "Final Diagnosis" && (
                      <Medication className="menuIcon" />
                    )}

                    {con === "Medical Prescription" && (
                      <ReceiptLong className="menuIcon" />
                    )}

                    {con === "Orders" && <Info className="menuIcon" />}
                    {con === "Follow Up" && (
                      <QueuePlayNext className="menuIcon" />
                    )}
                    {con === "Vitals" && <MonitorHeart className="menuIcon" />}
                    {con}
                  </div>
                )
              );
            })}
            {localStorage.getItem("loginRole") === "doctor" && (
              <div
                className={`${selectedMenu === "Print" && "menuActive"} menu`}
                onClick={() => {
                  handleClick();
                }}
              >
                <Print className="menuIcon" />
                Print
              </div>
            )}{" "}
            <div
              className={`${
                selectedMenu === "Review History" && "menuActive"
              } menu`}
              onClick={() => {
                setSelectedMenu("Review History");
              }}
            >
              <AutoStories className="menuIcon" />
              Review History
            </div>
          </Box>
        </>
      )}
    </div>
  );
};

export default PatientClinicalScreen;
