import { Box, Grid } from "@mui/material";
import React from "react";

const PatientHistoryVitals = ({ vitals }) => {
  return (
    <Box>
      <div className="PatientHistoryHead">
        <h5>Vitals: </h5>
      </div>

      <div className="PatientHistoryContent">
        <Grid
          container
          spacing={2}
          style={{
            marginTop: "0",
            borderCollapse: "collapse",
            marginLeft: "1.5rem",
            width: "95%"
          }}
        >
          {vitals.map((v, indx) => (
            <Grid
              xs={12}
              sm={3}
              md={2}
              lg={2}
              item
              key={indx}
              style={{
                border: "0.5px solid black",
                padding: "0px",
                display: "grid",
                gridTemplateRows: "auto 1fr", 
                gap: "10px", 
                marginBottom: "20px", 
                paddingBottom: "10px",
              }}
            >
              {/* Heading */}
              <div
                style={{
                  fontWeight: "bold",
                  borderBottom: "0.5px solid black",
                  paddingBottom: "5px",
                  textAlign: "center", 
                }}
              >
                {v.name}:
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", 
                  padding: "0px 10px",
                }}
              >
                <div>
                  {v.objective.length > 0 ? v.objective[0].data : v.value}
                </div>
                <span
                  style={{ marginLeft: "5px" }}
                  dangerouslySetInnerHTML={{
                    __html: v.unit,
                  }}
                ></span>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
};

export default PatientHistoryVitals;
