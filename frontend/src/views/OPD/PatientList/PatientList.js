import "../../css/PatientList.css";
import { Box } from "@mui/material";

const PatientList = ({
  patient,
  selectedPatient,
  setSelectedPatient,
}) => {

  const handlePatientIn = async (val) => {
    localStorage.setItem("patientConsult", JSON.stringify(val));
    setSelectedPatient(val);
  };

  return (
    <div className="patientListOPDD">
      {patient.length > 0 ? (
        <>
          {patient.map((val, ind) => {
            return (
              <Box
                className={
                  val._id === selectedPatient._id
                    ? "patientOPDActive"
                    : "patientOPD"
                }
                key={ind}
                onClick={() => handlePatientIn(val)}
              >
                <div className="pdetail">
                  <div className="ptName">{val.patientname}</div>
                  <span>
                    ({val.patientDetails.gender.substring(0, 1).toUpperCase()}
                  </span>
                  <span>{val.patientDetails.age}yr</span>)
                </div>
              </Box>
            );
          })}
        </>
      ) : (
        <h3 className="noFoundOPd" style={{ justifyContent: "center" }}>
          Patient Not Available
        </h3>
      )}
    </div>
  );
};

export default PatientList;
