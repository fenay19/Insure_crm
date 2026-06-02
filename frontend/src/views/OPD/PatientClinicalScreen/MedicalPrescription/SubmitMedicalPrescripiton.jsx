import {
  Box,
  IconButton,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const SubmitMedicalPrescription = ({
  prescriptions,
  selectedMedicineHandler,
  selectedMed,
  setSelectedMed,
  handleRemovePrescription,
}) => {
  return (
    <Box>
      {prescriptions.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            mt: 2,
            p: 2,
            overflowX: "auto", // enable horizontal scroll
          }}
        >
          <Box sx={{ minWidth: "1000px" }}> {/* adjust minWidth based on content */}
            <Table
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.2)",
                width: "100%",
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#126078" }}>
                  <TableCell sx={headCellStyle}>Sr. No.</TableCell>
                  <TableCell sx={headCellStyle}>Brand Name</TableCell>
                  <TableCell sx={headCellStyle}>Type</TableCell>
                  <TableCell sx={headCellStyle}>Generic Name</TableCell>
                  <TableCell sx={headCellStyle}>Tablet</TableCell>
                  <TableCell sx={headCellStyle}>Dose</TableCell>
                  <TableCell sx={headCellStyle}>Route</TableCell>
                  <TableCell sx={headCellStyle}>Duration</TableCell>
                  <TableCell sx={headCellStyle}>Timing</TableCell>
                  <TableCell sx={headCellStyle}>Frequency</TableCell>
                  <TableCell sx={headCellStyle}>Instruction</TableCell>
                  <TableCell sx={headCellStyle}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((v, ind) => {
                  const isSelected =
                    v.brandName === selectedMed.brandName &&
                    v.dose === selectedMed.dose;

                  return (
                    <TableRow
                      key={ind}
                      hover
                      onClick={() => selectedMedicineHandler(v)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "rgba(0, 0, 255, 0.1)"
                          : "inherit",
                      }}
                    >
                      <TableCell sx={bodyCellStyle}>{ind + 1}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.brandName || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.type || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.genericName || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.intake || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.dose || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>{v.route || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {v.duration || "N/A"} ({v.when || "N/A"})
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {v.time === "Once" || v.time === "Twice" || v.time === "Thrice"
                          ? `${v.time} a day`
                          : v.time
                          ? `${v.time + "ly"}`
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {v.morning || 0} - {v.evening || 0} - {v.night || 0}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{v.notes || "N/A"}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMed({});
                            handleRemovePrescription(v);
                          }}
                        >
                          <Close sx={{ fontSize: "16px", color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}
    </Box>
  );
};

const headCellStyle = {
  color: "white",
  fontWeight: "bold",
  border: "1px solid #126078",
  whiteSpace: "nowrap",
};

const bodyCellStyle = {
  border: "1px solid rgba(0, 0, 0, 0.2)",
  whiteSpace: "nowrap",
};

export default SubmitMedicalPrescription;
