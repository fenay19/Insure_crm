import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function OtherLabs({ data, handleClose }) {
  const labsData = data.addOtherLab;

  return (
    <div style={{ height: "400px", overflowY: "auto" }}>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }} aria-label="caption table">
          <TableHead sx={{ backgroundColor: "#f2eff2" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2eff2",
                  zIndex: 1,
                }}
              >
                Sr.No
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2eff2",
                  zIndex: 1,
                }}
              >
                Lab Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2eff2",
                  zIndex: 1,
                }}
              >
                Address
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2eff2",
                  zIndex: 1,
                }}
              >
                Contact
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2eff2",
                  zIndex: 1,
                }}
              >
                Departments
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labsData.length > 0 ? (
              labsData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">{row.labName}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                  <TableCell align="center">{row.contact}</TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "8px",
                      }}
                    >
                      {row.departmentId.map((department, depIndex) => (
                        <div
                          key={depIndex}
                          style={{
                            minWidth: "100px",
                            maxWidth: "150px",
                            textAlign: "center",
                            wordBreak: "break-word",
                            padding: "5px 10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: "#eef2f7",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          {department.departmentName}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <h3>No Data Found</h3>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
