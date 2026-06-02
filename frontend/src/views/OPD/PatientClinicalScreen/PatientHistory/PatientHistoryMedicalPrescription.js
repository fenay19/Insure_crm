import {
  Box,
  Table,
  TableBody,
  td,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const PatientHistoryMedicalPrescription = ({ medicalPrescription }) => {
  return (
    <Box
      className=" PatientHistoryDataSectionMargin"
      style={{ flexDirection: "column" }}
    >
      <div className="PatientHistoryHead">
        <h5 >Medical Prescription: </h5>
      </div>

      <TableContainer style={{ width: "60%",marginLeft: "1.5rem",border: "1px solid #ccc",borderRadius: "5px",padding:"1rem" }} >
        <Table >
          <thead
            style={{
              backgroundColor: "#ffff",
              color: "#000",
              fontWeight: "600",
              borderBottom: "1px solid #ccc",
            }}
          >
            <TableRow>
              <td
                style={{
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  float: "left",
                }}
              >
                Medicine Name
              </td>
              <td
                style={{
                  fontWeight: "700",
                  fontSize: "0.875rem",
                }}
              >
                Dose
              </td>
              <td
                style={{
                  fontWeight: "700",
                  fontSize: "0.875rem",
                }}
              >
                Duration
              </td>
            </TableRow>
          </thead>          
          <TableBody>
            {medicalPrescription.length === 0 && (
              <TableRow>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </TableRow>
            )}
            {medicalPrescription !== undefined &&
              medicalPrescription.map((v, ind) => {
                return (
                  <tr key={ind} style={{borderBottom: "1px solid #ccc"}}>
                    <td style={{ textAlign: "left", }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <p style={{ fontWeight: "600", float: "left" }}>
                          {ind + 1}.{" "}
                          {v.type.substring(0, 3).toString().toUpperCase()}{" "}
                          {v.brandName}({v.dose})
                        </p>

                        {v.notes.length > 0 && (
                          <div style={{ fontSize: "12px" }}>
                            <b>Note:</b> {v.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "left",fontSize: "14px", }}>
                      <div>
                        {v.intake} {v.type},{" "}
                        {[
                          "4 Hour",
                          "6 Hour",
                          "8 Hour",
                          "12 Hour",
                          "24 Hour",
                          "48 Hour",
                        ].includes(v.time) ? (
                          <>Every {v.time}</>
                        ) : v.time === "Once" ? (
                          "1 time a day"
                        ) : v.time === "Twice" ? (
                          "2 times a day"
                        ) : v.time === "Thrice" ? (
                          "3 times a day"
                        ) : (
                          v.time
                        )}
                        ,
                      </div>
                      <div style={{marginBottom:"5px",marginTop:"-4px"}}>{v.when}</div>
                    </td>
                    <td style={{ textAlign: "left",fontSize: "14px", }}>
                      <div>{v.duration}</div>
                      {v.totalMed !== "" && (
                        <div style={{marginBottom:"5px",marginTop:"-4px"}}>
                          Total: {v.totalMed} {v.type}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientHistoryMedicalPrescription;
