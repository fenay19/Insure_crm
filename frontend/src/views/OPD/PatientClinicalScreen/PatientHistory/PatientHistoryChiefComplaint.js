import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React from "react";

const PatientHistoryChiefComplaint = ({ chiefComplaint }) => {
  return (
    <Box>
      <div className="PatientHistoryHead" style={{ marginTop: "1rem" }}>
        <h5>Chief Complaints: </h5>
      </div>

      <TableContainer style={{ marginTop: "1rem", marginLeft: "1.5rem" }}>
        <Table style={{ width: "90%" }}>
          <TableHead
            style={{
              backgroundColor: "#ffff",
              color: "#000",
              fontWeight: "600",
              borderBottom: "1px solid #ccc",
            }}
          >
            <TableRow>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                <span id="tableHeader">Chief Complaint</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                {/* Since */}
                <span id="tableHeader">Since</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                {/* Treatment */}
                <span id="tableHeader">Treatment</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                <span id="tableHeader">Symptoms</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                <span id="tableHeader">Location</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                <span id="tableHeader">Description</span>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 600,
                  background: "white",
                  color: "#000",
                  border: "1px solid #ddd",
                }}
              >
                <span id="tableHeader">Notes</span>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          {chiefComplaint.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell style={{ border: "1px solid #ddd" }}>-- </TableCell>

                {/* Since */}
                <TableCell style={{ border: "1px solid #ddd" }}>--</TableCell>

                {/* Treatment */}
                <TableCell style={{ border: "1px solid #ddd" }}>--</TableCell>

                {/* Symptoms */}
                <TableCell style={{ border: "1px solid #ddd" }}>--</TableCell>

                {/* Location */}
                <TableCell style={{ border: "1px solid #ddd" }}>--</TableCell>

                {/* Description */}
                <TableCell style={{ border: "1px solid #ddd" }}>--</TableCell>

                {/* Notes */}
                <TableCell style={{ border: "1px solid #ddd" }}>-- </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {chiefComplaint.map((v, ind) => (
                <TableRow key={ind}>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    <b>{v.chiefComplaint}</b>
                  </TableCell>

                  {/* Since */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.since.length > 0
                      ? v.since.map((vv, inx) => (
                          <span key={inx}>
                            {vv.data}
                            {inx !== v.since.length - 1 && ", "}
                          </span>
                        ))
                      : "-"}
                  </TableCell>

                  {/* Treatment */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.treatment.length > 0
                      ? v.treatment.map((vv, inx) => (
                          <span key={inx}>
                            {vv.data}
                            {inx !== v.treatment.length - 1 && ", "}
                          </span>
                        ))
                      : "-"}
                  </TableCell>

                  {/* Symptoms */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.symptoms.length > 0
                      ? v.symptoms.map((vv, inx) => (
                          <span key={inx}>
                            {vv.with}
                            {inx !== v.symptoms.length - 1 && ", "}
                          </span>
                        ))
                      : "-"}
                  </TableCell>

                  {/* Location */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.Location.length > 0
                      ? v.Location.map((vv, inx) => (
                          <span key={inx}>
                            {vv.data}
                            {inx !== v.Location.length - 1 && ", "}
                          </span>
                        ))
                      : "-"}
                  </TableCell>

                  {/* Description */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.description.length > 0
                      ? v.description.map((vv, inx) => (
                          <span key={inx}>
                            {vv.data}
                            {inx !== v.description.length - 1 && ", "}
                          </span>
                        ))
                      : "-"}
                  </TableCell>

                  {/* Notes */}
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {v.notes !== "" ? v.notes : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientHistoryChiefComplaint;
