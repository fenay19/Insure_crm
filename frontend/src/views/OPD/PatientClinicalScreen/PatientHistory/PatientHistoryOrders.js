import { Box } from "@mui/material";
import React from "react";

const PatientHistoryOrders = ({ labRadiology, procedure, instruction }) => {
  return (
    <Box
      className={`${
        (labRadiology === undefined || labRadiology.length === 0) &&
        (procedure === undefined || procedure.procedure.length === 0) &&
        (instruction === undefined || instruction.length === 0)
          && "PatientHistoryDataSectionEnd"
      }  `}
      style={{
        flexDirection:
          !(
            (labRadiology === undefined || labRadiology.length === 0) &&
            (procedure === undefined || procedure.procedure.length === 0) &&
            (instruction === undefined || instruction.length === 0)
          ) && "column",
      }}
    >
      <div className="PatientHistoryHead" >
        <h5 >Orders: </h5>
      </div>

      {labRadiology.length > 0 && (
        <Box style={{marginLeft:"1.5rem"}}>
          <div>
            <h5>Investigation: </h5>
          </div>

          {labRadiology !== undefined &&
            labRadiology.map((v, inx) => {
              return (
                <li key={inx}
                  style={{
                    marginLeft: "1.5rem",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {v.testName}
                 
                </li>
              );
            })}
        </Box>
      )}

      {procedure.procedure.length > 0 && (
        <Box style={{marginBottom:"5px"}}>
          <div>
            <h5>Procedure: </h5>
          </div>

          {procedure.procedure !== undefined &&
            procedure.procedure.map((v, ind) => {
              return (
                <li key={ind}
                  style={{
                    // listStyleType: "none",
                    marginLeft: "1.5rem",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <span>
                    {v.SurgeryName}
                    {/* {ind !== procedure.procedure.length - 1 && (
                      <span style={{ marginRight: "5px" }}>, </span>
                    )} */}
                  </span>
                </li>
              );
            })}
          {procedure.notes !== undefined && procedure.notes !== "" && (
            <span style={{ marginLeft: "10px" }}>
              (<b style={{ marginRight: "5px" }}>Note:</b>
              {procedure.notes})
            </span>
          )}
        </Box>
      )}

      {instruction.length > 0 && (
        <Box >
          <div>
            <h5>Instruction: </h5>
          </div>

          {instruction !== undefined &&
            instruction.map((v, inx) => {
              return (
                <li key={inx}
                  style={{
                    // listStyleType: "none",
                    marginLeft: "1.5rem",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {v.heading}
                  {/* {inx !== instruction.length - 1 && (
                    <span style={{ marginRight: "5px" }}>, </span>
                  )} */}
                </li>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default PatientHistoryOrders;
