import "./MenuAll.css";
import History from "../History/History";
import MedicalPrescription from "../MedicalPrescription/MedicalPrescription";
import Vitals from "../Vitals/Vitals";
import { Box } from "@mui/material";

import ChiefComplaint from "../ChiefComplaint/ChiefComplaint";
import ProvisionalDiagnosis from "../ProvisionalDiagnosis/ProvisionalDiagnosis";
import Examination from "../Examination/Examination";
import PatientDetails from "./PatientDetails";
import PresentIllness from "../PresentIllness/PresentIllness";
import Orders from "../Orders/Orders";
import FinalDiagnosis from "../FinalDiagnosis/FinalDiagnosis";
import FollowUp from "../FollowUp/FollowUp";

const MenuAll = ({ selectedMenu, consultMenu }) => {
  return (
    <div className="allMenu">
      <Box className="patientAllMenuData personalDetail">
        <PatientDetails />
      </Box>
      {consultMenu.map((con, ind) => {
        return (
          <Box key={ind} className="patientAllMenuData">
            <h3>
              {con}
            </h3>
            {con === "Chief Complaint" ? (
              <ChiefComplaint selectedMenu={selectedMenu} />
            ) : con === "Medical History" ? (
              <History selectedMenu={selectedMenu} />
            ) : con === "History of Present Illness" ? (
              <PresentIllness selectedMenu={selectedMenu} />
            ) :  con === "Examination" ? (
              <Examination selectedMenu={selectedMenu} />
            ) : con === "Provisional Diagnosis" ? (
              <ProvisionalDiagnosis selectedMenu={selectedMenu} />
            ) : con === "Final Diagnosis" ? (
              <FinalDiagnosis selectedMenu={selectedMenu} />
            ) : con === "Orders" ? (
              <Orders selectedMenu={selectedMenu} />
            ) : con === "Follow Up" ? (
              <FollowUp selectedMenu={selectedMenu} />
            ) : con === "Medical Prescription" ? (
              <MedicalPrescription selectedMenu={selectedMenu} />
            ) : (
              con === "Vitals" && <Vitals selectedMenu={selectedMenu} />
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default MenuAll;
