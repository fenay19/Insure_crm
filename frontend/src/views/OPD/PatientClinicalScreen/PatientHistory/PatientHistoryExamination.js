import { Box, Grid } from "@mui/material";
import React from "react";

const PatientHistoryExamination = ({ examination }) => {
  return (
    <Box>
      {/* General Examination */}
      <Box>
        <div className="PatientHistoryHead">
          <h5>General Examination: </h5>
        </div>

        <div>
          {examination !== undefined && examination.general !== undefined && (
            <>
              {examination.general.length > 0 ? (
                <Grid container spacing={2}>
                  {examination.general.map((vv, ind) => {
                    return (
                      <Grid item xs={12} key={ind} style={{ width: "96%" }}>
                        <Box
                          style={{ marginBottom: "10px", marginLeft: "1.8rem" }}
                        >
                          <h5
                            style={{
                              fontSize: ".9rem",
                              fontWeight: "500",
                              textDecoration: "underline",
                            }}
                          >
                            {vv.disorder}:
                          </h5>

                          <Grid
                            container
                            spacing={2}
                            style={{
                              marginTop: "0",
                              marginBottom: "10px",
                              marginLeft: "1.5rem",
                            }}
                          >
                            {vv.subDisorder.map((v, inx) => (
                              <Grid item xs={12} sm={4} key={inx}>
                                <b
                                  style={{
                                    marginRight: "5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {v.name}:{" "}
                                </b>
                                <span style={{ fontSize: ".9rem" }}>
                                  {v.answerType !== "Objective" ? (
                                    v.answerType === "Calender" ? (
                                      <>
                                        {v.value.split("-")[2]}-
                                        {v.value.split("-")[1]}-
                                        {v.value.split("-")[0]}
                                      </>
                                    ) : (
                                      v.value
                                    )
                                  ) : (
                                    v.objective.map((vvv, indx) => (
                                      <span key={indx}>
                                        {vvv.data}
                                        {vvv.innerData.length > 0 && (
                                          <>
                                            (
                                            {vvv.innerData.map((vi, vinx) => (
                                              <span key={vinx}>
                                                {vi.data}
                                                {vvv.innerData.length - 1 >
                                                  vinx && <span>, </span>}
                                              </span>
                                            ))}
                                            )
                                          </>
                                        )}
                                        {v.objective.length - 1 > indx && (
                                          <span>, </span>
                                        )}
                                      </span>
                                    ))
                                  )}
                                </span>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <p style={{ marginTop: "-8px" }}>NAD </p>
              )}
              {examination.local.length > 0 && (
                <p style={{ marginTop: "-8px", marginLeft: "1.8rem" }}>
                  Other NAD{" "}
                </p>
              )}
            </>
          )}
        </div>
      </Box>

      {/* Local Examination */}
      <Box>
        <div className="PatientHistoryHead">
          <h5>Local Examination: </h5>
        </div>

        <div>
          {examination !== undefined && examination.local !== undefined && (
            <>
              {examination.local.length > 0 ? (
                <Grid container spacing={2} style={{ width: "96%" }}>
                  {examination.local.map((vv, ind) => {
                    return (
                      <Grid item xs={12} key={ind}>
                        <Box
                          style={{ marginBottom: "10px", marginLeft: "1.8rem" }}
                        >
                          <h5
                            style={{
                              fontSize: ".9rem",
                              fontWeight: "500",
                              textDecoration: "underline",
                            }}
                          >
                            {vv.disorder}:
                          </h5>
                          <Grid
                            container
                            spacing={2}
                            style={{
                              marginTop: "0",
                              marginBottom: "10px",
                              marginLeft: "1.5rem",
                            }}
                          >
                            {vv.subDisorder.map((v, inx) => (
                              <Grid item xs={12} sm={4} key={inx}>
                                <b
                                  style={{
                                    marginRight: "5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {v.name}:{" "}
                                </b>
                                <span>
                                  {v.answerType !== "Objective" ? (
                                    v.answerType === "Calender" ? (
                                      <>
                                        {v.value.split("-")[2]}-
                                        {v.value.split("-")[1]}-
                                        {v.value.split("-")[0]}
                                      </>
                                    ) : (
                                      v.value
                                    )
                                  ) : (
                                    v.objective.map((vv, indx) => (
                                      <span key={indx}>
                                        {vv.data}
                                        {vv.innerData.length > 0 && (
                                          <>
                                            (
                                            {vv.innerData.map((vi, vinx) => (
                                              <span key={vinx}>
                                                {vi.data}
                                                {vv.innerData.length - 1 >
                                                  vinx && <span>, </span>}
                                              </span>
                                            ))}
                                            )
                                          </>
                                        )}
                                        {v.objective.length - 1 > indx && (
                                          <span>, </span>
                                        )}
                                      </span>
                                    ))
                                  )}
                                </span>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <p style={{ marginTop: "-8px" }}>NAD </p>
              )}
              {examination.local.length > 0 && (
                <p style={{ marginTop: "-8px", marginLeft: "1.5rem" }}>
                  Other NAD{" "}
                </p>
              )}
            </>
          )}
        </div>
      </Box>

      {/* Systemic Examination */}
      <Box>
        <div className="PatientHistoryHead">
          <h5>Systemic Examination: </h5>
        </div>

        <div>
          {examination !== undefined &&
            examination.systematic !== undefined && (
              <>
                {examination.systematic.length > 0 ? (
                  <Grid container spacing={2} style={{ width: "96%" }}>
                    {examination.systematic.map((vv, ind) => {
                      return (
                        <Grid item xs={12} key={ind}>
                          <Box
                            style={{
                              marginBottom: "10px",
                              marginLeft: "1.8rem",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: ".9rem",
                                fontWeight: "500",
                                textDecoration: "underline",
                              }}
                            >
                              {vv.disorder}:
                            </h5>
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginTop: "0",
                                marginBottom: "10px",
                                marginLeft: "1.5rem",
                              }}
                            >
                              {vv.subDisorder.map((v, inx) => (
                                <Grid item xs={12} sm={4} key={inx}>
                                  <b
                                    style={{
                                      marginRight: "5px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {v.name}:{" "}
                                  </b>
                                  <span>
                                    {v.answerType !== "Objective" ? (
                                      v.answerType === "Calender" ? (
                                        <>
                                          {v.value.split("-")[2]}-
                                          {v.value.split("-")[1]}-
                                          {v.value.split("-")[0]}
                                        </>
                                      ) : (
                                        v.value
                                      )
                                    ) : (
                                      v.objective.map((vv, indx) => (
                                        <span key={indx}>
                                          {vv.data}
                                          {vv.innerData.length > 0 && (
                                            <>
                                              (
                                              {vv.innerData.map((vi, vinx) => (
                                                <span key={vinx}>
                                                  {vi.data}
                                                  {vv.innerData.length - 1 >
                                                    vinx && <span>, </span>}
                                                </span>
                                              ))}
                                              )
                                            </>
                                          )}
                                          {v.objective.length - 1 > indx && (
                                            <span>, </span>
                                          )}
                                        </span>
                                      ))
                                    )}
                                  </span>
                                </Grid>
                              ))}
                            </Grid>
                            {vv.diagram && vv.diagram !== "" && (
                              <div className="systematicDiagram">
                                <img
                                  src={vv.diagram}
                                  style={{ width: "150px" }}
                                  alt=""
                                />
                              </div>
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <p style={{ marginTop: "-8px" }}>NAD </p>
                )}
                {examination.systematic.length > 0 && (
                  <p style={{ marginTop: "-8px", marginLeft: "1.8rem" }}>
                    Other NAD{" "}
                  </p>
                )}
              </>
            )}
        </div>
      </Box>

      {/* Other Examination */}
      <Box>
        <div className="PatientHistoryHead">
          <h5>Other Examination: </h5>
        </div>

        <div className="PatientHistoryContent">
          <Grid container spacing={2} style={{ width: "96%" }}>
            {examination !== undefined &&
              examination.other !== undefined &&
              examination.other.map((vv, ind) => {
                return (
                  <Grid item xs={12} key={ind}>
                    <Box className="otherMain">
                      <div>
                        <h6
                          style={{
                            fontSize: ".9rem",
                            fontWeight: "500",
                            // textDecoration: "underline",
                            width: "170px",
                          }}
                        >
                          {vv.exam}:{" "}
                        </h6>
                      </div>
                      <div>
                        {" "}
                        {/* className="otherNote" */}
                        {vv.notes === "" ? (
                          <>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </>
                        ) : (
                          vv.notes
                        )}
                      </div>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </div>
      </Box>
    </Box>
  );
};

export default PatientHistoryExamination;
