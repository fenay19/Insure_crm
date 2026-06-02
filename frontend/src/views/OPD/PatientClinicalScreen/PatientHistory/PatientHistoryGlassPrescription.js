import { Box, Grid } from "@mui/material";
import React from "react";

const PatientHistoryGlassPrescription = ({ glassPrescription }) => {
  return (
    <Box
      className="PatientHistoryDataSection PatientHistoryDataSectionMargin"
      style={{ marginTop: "-20px" }}
    >
      <div className="PatientHistoryHead">
        <h5>Glass Prescription: </h5>
      </div>

      <Box className={"subSectionPatientHistory PatientHistoryContent"}>
        {glassPrescription !== undefined && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Box className="Timing" style={{ border: "1px solid black" }}>
                <div className="MedTiming">
                  <div
                    style={{ fontWeight: "bolder", color: "black" }}
                    className="glassPres"
                  >
                    ℞
                  </div>
                  <div className="glassPres" style={{ background: "#f3f308" }}>
                    Sphere
                  </div>
                  <div className="glassPres" style={{ background: "#19d019" }}>
                    Cylinder
                  </div>
                  <div className="glassPres" style={{ background: "#4ab1ff" }}>
                    Axis
                  </div>
                  <div className="glassPres" style={{ background: "pink" }}>
                    Add
                  </div>
                  <div className="glassPres" style={{ background: "#a8a8a8" }}>
                    PD
                  </div>
                </div>
                <div className="MedTiming">
                  <div className="glassPres">OD</div>
                  <div className="glassPres" style={{ background: "#f3f308" }}>
                    {glassPrescription[0].left.sphere}
                  </div>
                  <div className="glassPres" style={{ background: "#19d019" }}>
                    {glassPrescription[0].left.cylinder}
                  </div>
                  <div className="glassPres" style={{ background: "#4ab1ff" }}>
                    {glassPrescription[0].left.axis}
                  </div>
                  <div className="glassPres" style={{ background: "pink" }}>
                    {glassPrescription[0].left.add}
                  </div>
                  <div className="glassPres" style={{ background: "#a8a8a8" }}>
                    {glassPrescription[0].left.pd}
                  </div>
                </div>
                <div className="MedTiming">
                  <div className="glassPres">OS</div>
                  <div className="glassPres" style={{ background: "#f3f308" }}>
                    {glassPrescription[0].right.sphere}
                  </div>
                  <div className="glassPres" style={{ background: "#19d019" }}>
                    {glassPrescription[0].right.cylinder}
                  </div>
                  <div className="glassPres" style={{ background: "#4ab1ff" }}>
                    {glassPrescription[0].right.axis}
                  </div>
                  <div className="glassPres" style={{ background: "pink" }}>
                    {glassPrescription[0].right.add}
                  </div>
                  <div className="glassPres" style={{ background: "#a8a8a8" }}>
                    {glassPrescription[0].right.pd}
                  </div>
                </div>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default PatientHistoryGlassPrescription;
