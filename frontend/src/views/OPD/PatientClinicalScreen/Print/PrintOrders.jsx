

// export default PrintOrders;
import { Box } from "@mui/material";
import { get } from "api/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PrintOrders = ({ investigation = [], procedure = [], crossConsultant = {},  instruction = [] }) => {
  const [patientProcedures, setPatientProcedures] = useState([]);
  
  useEffect(() => {
    if (Array.isArray(procedure)) {
      setPatientProcedures(procedure);
    }
  }, [procedure]);

  const hasLab = Array.isArray(investigation) && investigation.length > 0;
  const hasInstruction = Array.isArray(instruction) && instruction.length > 0;
  const hasProcedure = Array.isArray(patientProcedures) && patientProcedures.length > 0;
  const hasAnyOrder = hasLab || hasInstruction || hasProcedure;
  const hasCrossConsultation = Object.keys(crossConsultant)?.length>0
  return (
    <Box
      className={`${hasAnyOrder ? "printDataSection" : "printDataSectionEnd"} printDataSectionMargin`}
      style={{ flexDirection: hasAnyOrder ? "column" : undefined }}
    >
      <div className="printHead notranslate">
        <h5>Orders:</h5>
      </div>

      {/* Investigation Section */}
      {hasLab && (
        <Box className="notranslate" style={{ marginLeft: "10px" }}>
          <h5>Investigation:</h5>
          <ul style={{ marginLeft: "1.5rem" }}>
            {investigation.map((v, i) => (
              <li key={i}>{v?.testName || "Unnamed Test"}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* Procedure Section */}
      {hasProcedure && (
        <Box className="notranslate" style={{ marginLeft: "10px" }}>
          <h5>Procedure:</h5>
          {patientProcedures.map((proc, i) => (
            <Box key={i} sx={{ marginBottom: 1 }}>
              <ul style={{ marginLeft: "1.5rem" }}>
                {(proc.procedure || []).map((v, j) => (
                  <li key={j}>{v?.procedureName || "Unnamed Procedure"}</li>
                ))}
              </ul>
              {proc.notes?.trim() && (
                <span style={{ marginLeft: "10px" }}>
                  (<b style={{ marginRight: "5px" }}>Note:</b>{proc.notes})
                </span>
              )}
            </Box>
          ))}
        </Box>
      )}
    {
      hasCrossConsultation && (<Box className="notranslate" style={{ marginLeft: "10px" }}>
        <h5>cross consultations:</h5>
        {(crossConsultant?.consultant||[])?.map((items) => (
          <Box sx={{ marginBottom: 1 }}>
            <ul style={{ marginLeft: "1.5rem" }}>
              {items?.basicDetails?.firstName}   {items?.basicDetails?.lastName} ({items?.employmentDetails?.departmentOrSpeciality?.departmentName})
            </ul>
          </Box>
        ))}
      </Box>)
    }
      {/* Instruction Section */}
      {hasInstruction && (
        <Box style={{ marginLeft: "10px" }}>
          <div className="notranslate">
            <h5>Instruction:</h5>
          </div>
          <ul style={{ marginLeft: "1.5rem" }}>
            {instruction.map((v, i) => (
              <li key={i}>{v?.heading || "Unnamed Instruction"}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};


export default PrintOrders;
