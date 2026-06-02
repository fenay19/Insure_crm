import { Box, Checkbox } from "@mui/material";
import { Grid } from "@mui/material";
import React from "react";

const PatientHistoryHistory = ({ history }) => {
  return (
    <Box className="PatientHistoryDataSectionMargin">
      <div className="PatientHistoryHead">
        <h5>Medical History: </h5>
      </div>

      <div
        className="printContent"
        style={{ padding: "0 5px", marginLeft: "1.5rem" }}
      >
        <Box
          className={
            history.medicalProblems !== undefined &&
            history.medicalProblems.length > 0
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div>
            <h5 style={{ fontSize: "14px" }}>Past History:</h5>
          </div>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: "0", marginLeft: ".5rem" }}
          >
            {history.medicalProblems !== undefined &&
              history.medicalProblems.map((v, ind) => {
                return (
                  v.option === "Yes" && (
                    <Grid
                      item
                      xs={4}
                      sm={4}
                      md={4}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "3px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span style={{ fontSize: "14px" }}>
                        {v.option === "Yes" ? (
                          <>Since {v.since}</>
                        ) : (
                          <>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            &nbsp; &nbsp; &nbsp; &nbsp;
                          </>
                        )}
                      </span>
                    </Grid>
                  )
                );
              })}
          </Grid>
        </Box>

        <Box
          className={
            history !== undefined &&
            history.familyHistory !== undefined &&
            history.familyHistory.length > 0
              ? "subSectionPatientHistoryColumn"
              : "subSectionPatientHistory"
          }
          style={{ marginBottom: "5px" }}
        >
          <div>
            <h5 style={{ fontSize: "14px" }}>Family History</h5>
          </div>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: "0", marginLeft: ".5rem" }}
          >
            {history.familyHistory !== undefined &&
              history.familyHistory.map((v, ind) => {
                return (
                  v.option === "Yes" && (
                    <Grid
                      item
                      xs={4}
                      sm={4}
                      md={4}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "3px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span>
                        {v.option === "Yes" ? (
                          <>
                            {v.familyMember.map((vv, inx) => {
                              return (
                                <span key={inx} style={{ fontSize: "14px" }}>
                                  <b>{vv.memberRelation}:</b>
                                  <span> Since {vv.duration}</span>
                                  {inx !== v.familyMember.length - 1 && (
                                    <>,&nbsp;</>
                                  )}
                                </span>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            &nbsp; &nbsp; &nbsp; &nbsp;
                          </>
                        )}
                      </span>
                    </Grid>
                  )
                );
              })}
          </Grid>
        </Box>

        <Box
          className={
            history.lifeStyle !== undefined && history.lifeStyle.length > 0
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div>
            <h5 style={{ fontSize: "14px" }}>Personal History:</h5>
          </div>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: "0", marginLeft: ".5rem" }}
          >
            {history.lifeStyle !== undefined &&
              history.lifeStyle.map((v, ind) => {
                return (
                  (v.option === "Yes" ||
                    v.option === "Quit" ||
                    v.option === "Occasional") && (
                    <Grid
                      item
                      xs={4}
                      sm={4}
                      md={4}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "3px", fontSize: "14px" }}>
                        {v.habit}:{" "}
                      </b>
                      <span style={{ fontSize: "14px" }}>
                        {v.option === "Yes" ||
                        v.option === "Quit" ||
                        v.option === "Occasional" ? (
                          <>
                            {v.option}
                            {v.since !== "" && (
                              <>
                                {v.option && (
                                  <span
                                    style={{
                                      marginRight: "5px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ,{" "}
                                  </span>
                                )}{" "}
                                Since {v.since}
                              </>
                            )}
                            {v.quantity !== "" && (
                              <>
                                , Quantity {v.quantity} {v.unit}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            &nbsp; &nbsp; &nbsp; &nbsp;
                          </>
                        )}
                      </span>
                    </Grid>
                  )
                );
              })}
          </Grid>
        </Box>

        <Box
          className={
            history.allergies !== undefined &&
            history.allergies.which !== undefined &&
            ((history.allergies.which.general !== undefined &&
              history.allergies.which.general.length > 0) ||
              (history.allergies.which.drug !== undefined &&
                history.allergies.which.drug.length > 0) ||
              (history.allergies.which.food !== undefined &&
                history.allergies.which.food.length > 0) ||
              (history.allergies.which.other !== undefined &&
                history.allergies.which.other.length > 0))
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div className="examData">
            <div>
              <h5 style={{ fontSize: "14px" }}>Allergies:</h5>
            </div>
            <div className="selectOptionExam ">
              <Checkbox
                label="Yes"
                checked={
                  history.allergies !== undefined &&
                  history.allergies.having !== undefined &&
                  history.allergies.having === "Yes"
                    ? true
                    : false
                }
              />
              Yes
              <Checkbox
                label="No"
                checked={
                  history.allergies !== undefined &&
                  history.allergies.having !== undefined &&
                  history.allergies.having === "No"
                    ? true
                    : false
                }
              />
              No
            </div>
          </div>

          {history.allergies !== undefined &&
            history.allergies.having !== undefined &&
            history.allergies.having === "Yes" && (
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{ marginTop: "0", marginLeft: ".5rem" }}
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                  >
                    {history.allergies.which !== undefined &&
                      history.allergies.which.general !== undefined &&
                      history.allergies.which.general.length > 0 && (
                        <div>
                          <b style={{ fontSize: "14px" }}>General Allergy: </b>
                          <ul style={{ marginLeft: "1.7rem" }}>
                            {history.allergies.which.general.map((v, inx) => {
                              return (
                                <li key={inx}>
                                  <Box
                                    sx={{
                                      fontWeight: "500",
                                      display: "inline",
                                    }}
                                  >
                                    {v.allergyName}
                                  </Box>
                                  : Since{" "}
                                  <span style={{ fontSize: "14px" }}>
                                    {v.since}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                  >
                    {history.allergies.which !== undefined &&
                      history.allergies.which.food !== undefined &&
                      history.allergies.which.food.length > 0 && (
                        <div>
                          <b style={{ fontSize: "14px" }}>Food Allergy: </b>
                          <ul style={{ marginLeft: "1.7rem" }}>
                            {history.allergies.which.food.map((v, inx) => {
                              return (
                                <li key={inx}>
                                  <Box
                                    sx={{
                                      fontWeight: "500",
                                      display: "inline",
                                    }}
                                  >
                                    {v.allergyName}
                                  </Box>
                                  : Since{" "}
                                  <span style={{ fontSize: "14px" }}>
                                    {v.since}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                  >
                    {history.allergies.which !== undefined &&
                      history.allergies.which.drug !== undefined &&
                      history.allergies.which.drug.length > 0 && (
                        <div>
                          <b style={{ fontSize: "14px" }}>Drug Allergy: </b>
                          <ul style={{ marginLeft: "1.7rem" }}>
                            {history.allergies.which.drug.map((v, inx) => {
                              return (
                                <li key={inx}>
                                  <Box
                                    sx={{
                                      fontWeight: "500",
                                      display: "inline",
                                    }}
                                  >
                                    {v.allergyName}
                                  </Box>
                                  : Since{" "}
                                  <span style={{ fontSize: "14px" }}>
                                    {v.since}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </Grid>
                </Grid>
                {history.allergies.which !== undefined &&
                  history.allergies.which.other !== undefined &&
                  history.allergies.which.other.length > 0 && (
                    <div
                      className="selectOptionExam"
                      style={{
                        paddingLeft: "10px",
                        marginTop: "5px",
                        marginLeft: "1.5rem",
                      }}
                    >
                      <b style={{ fontSize: "14px" }}>Other Allergy: </b>
                      <span style={{ fontSize: "14px" }}>
                        {history.allergies.which.other}
                      </span>
                    </div>
                  )}
              </>
            )}
        </Box>

        <Box
          className={
            history.procedure !== undefined &&
            history.procedure.which !== undefined &&
            history.procedure.which.length > 0
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div className="examData">
            <div>
              <h5 style={{ fontSize: "14px" }}>Procedure:</h5>
            </div>
            <div className="selectOptionExam " style={{ fontSize: "14px" }}>
              <Checkbox
                label="Yes"
                checked={
                  history.procedure !== undefined &&
                  history.procedure.having !== undefined &&
                  history.procedure.having === "Yes"
                    ? true
                    : false
                }
              />
              Yes
              <Checkbox
                style={{ fontSize: "14px" }}
                label="No"
                checked={
                  history.procedure !== undefined &&
                  history.procedure.having !== undefined &&
                  history.procedure.having === "No"
                    ? true
                    : false
                }
              />
              No
              <Checkbox
                style={{ fontSize: "14px" }}
                label="Don't Know"
                checked={
                  history.procedure !== undefined &&
                  history.procedure.having !== undefined &&
                  history.procedure.having === "Don't Know"
                    ? true
                    : false
                }
              />
              Don't Know
            </div>
          </div>
          {history.procedure !== undefined &&
            history.procedure.having !== undefined &&
            history.procedure.having === "Yes" &&
            history.procedure.which !== undefined &&
            history.procedure.which.length > 0 && (
              <Grid container spacing={2} sx={{ marginTop: "0" }}>
                {history.procedure.which.map((v, inx) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={inx}
                      sx={{
                        paddingLeft: "10px",
                        marginTop: "-16px",
                        marginLeft: "1.5rem",
                      }}
                    >
                      <b style={{ marginRight: "3px", fontSize: "14px" }}>
                        {v.surgery}:{" "}
                      </b>
                      <span style={{ fontSize: "14px" }}>{v.when} Ago</span>
                    </Grid>
                  );
                })}
              </Grid>
            )}
        </Box>

        {JSON.parse(
          localStorage.getItem("patientConsult")
        ).patientDetails.gender.toLowerCase() === "female" && (
          <Box
            className={
              history !== undefined &&
              history.gynac !== undefined &&
              history.gynac.length > 0
                ? "subSectionPrintColumn"
                : "subSectionPrint"
            }
            style={{ marginBottom: "5px" }}
          >
            <div>
              <h5 style={{ fontSize: "14px" }}>Gynac History:</h5>
            </div>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: "0", marginLeft: "1.5rem" }}
            >
              {history !== undefined &&
                history.gynac !== undefined &&
                history.gynac.map((v, ind) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "5px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span style={{ fontSize: "14px" }}>
                        {v.value !== "" ? (
                          v.answerType === "Calender" ? (
                            <>
                              {v.value.split("-")[2]}-{v.value.split("-")[1]}-
                              {v.value.split("-")[0]}
                            </>
                          ) : (
                            v.value
                          )
                        ) : (
                          v.objective.map((vv, indx) => {
                            return (
                              <span key={indx} style={{ fontSize: "14px" }}>
                                {vv.data}{" "}
                                {vv.innerData.length > 0 && (
                                  <span>
                                    (
                                    {vv.innerData.map((vi, vinx) => {
                                      return (
                                        <span
                                          key={vinx}
                                          style={{ fontSize: "14px" }}
                                        >
                                          {vi.data}
                                          {vv.innerData.length - 1 > vinx && (
                                            <span
                                              style={{ marginRight: "5px" }}
                                            >
                                              ,{" "}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                    )
                                  </span>
                                )}{" "}
                                {v.objective.length - 1 > indx && (
                                  <span
                                    style={{
                                      marginRight: "5px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ,{" "}
                                  </span>
                                )}
                              </span>
                            );
                          })
                        )}
                      </span>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        )}

        {JSON.parse(
          localStorage.getItem("patientConsult")
        ).patientDetails.gender.toLowerCase() === "female" && (
          <Box
            className={
              history !== undefined &&
              history.obstetric !== undefined &&
              history.obstetric.length > 0
                ? "subSectionPrintColumn"
                : "subSectionPrint"
            }
            style={{ marginBottom: "5px" }}
          >
            <div>
              <h5 style={{ fontSize: "14px" }}>Obstetric History:</h5>
            </div>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: "0", marginLeft: "1.5rem" }}
            >
              {history !== undefined &&
                history.obstetric !== undefined &&
                history.obstetric.map((v, ind) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "5px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span>
                        {v.value !== "" ? (
                          v.answerType === "Calender" ? (
                            <>
                              {v.value.split("-")[2]}-{v.value.split("-")[1]}-
                              {v.value.split("-")[0]}
                            </>
                          ) : (
                            v.value
                          )
                        ) : (
                          v.objective.map((vv, indx) => {
                            return (
                              <span key={indx} style={{ fontSize: "14px" }}>
                                {vv.data}{" "}
                                {vv.innerData.length > 0 && (
                                  <span>
                                    (
                                    {vv.innerData.map((vi, vinx) => {
                                      return (
                                        <span
                                          key={vinx}
                                          style={{ fontSize: "14px" }}
                                        >
                                          {vi.data}
                                          {vv.innerData.length - 1 > vinx && (
                                            <span
                                              style={{ marginRight: "5px" }}
                                            >
                                              ,{" "}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                    )
                                  </span>
                                )}{" "}
                                {v.objective.length - 1 > indx && (
                                  <span
                                    style={{
                                      marginRight: "5px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ,{" "}
                                  </span>
                                )}
                              </span>
                            );
                          })
                        )}
                      </span>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        )}

        {Number(
          Math.abs(
            new Date(
              Date.now() -
                new Date(
                  `${
                    JSON.parse(
                      localStorage.getItem("patientConsult")
                    ).patientDetails.dob.split("/")[2]
                  }-${
                    JSON.parse(
                      localStorage.getItem("patientConsult")
                    ).patientDetails.dob.split("/")[1]
                  }-${
                    JSON.parse(
                      localStorage.getItem("patientConsult")
                    ).patientDetails.dob.split("/")[0]
                  }`
                ).getTime()
            ).getUTCFullYear() - 1970
          )
        ) < 18 && (
          <Box
            className={
              history !== undefined &&
              history.pediatric !== undefined &&
              history.pediatric.length > 0
                ? "subSectionPrintColumn"
                : "subSectionPrint"
            }
            style={{ marginBottom: "5px" }}
          >
            <div>
              <h5 style={{ fontSize: "14px" }}>Pediatric History:</h5>
            </div>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: "0", marginLeft: "1.5rem" }}
            >
              {history !== undefined &&
                history.pediatric !== undefined &&
                history.pediatric.map((v, ind) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "5px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span>
                        {v.value !== "" ? (
                          v.answerType === "Calender" ? (
                            <>
                              {v.value.split("-")[2]}-{v.value.split("-")[1]}-
                              {v.value.split("-")[0]}
                            </>
                          ) : (
                            v.value
                          )
                        ) : (
                          v.objective.map((vv, indx) => {
                            return (
                              <span key={indx} style={{ fontSize: "14px" }}>
                                {vv.data}{" "}
                                {vv.innerData.length > 0 && (
                                  <span>
                                    (
                                    {vv.innerData.map((vi, vinx) => {
                                      return (
                                        <span
                                          key={vinx}
                                          style={{ fontSize: "14px" }}
                                        >
                                          {vi.data}
                                          {vv.innerData.length - 1 > vinx && (
                                            <span
                                              style={{
                                                marginRight: "5px",
                                                fontSize: "14px",
                                              }}
                                            >
                                              ,{" "}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                    )
                                  </span>
                                )}{" "}
                                {v.objective.length - 1 > indx && (
                                  <span
                                    style={{
                                      marginRight: "5px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ,{" "}
                                  </span>
                                )}
                              </span>
                            );
                          })
                        )}
                      </span>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        )}

        <Box
          className={
            history !== undefined &&
            history.nutritional !== undefined &&
            history.nutritional.length > 0
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div>
            <h5 style={{ fontSize: "14px" }}>Nutritional History:</h5>
          </div>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: "0", marginLeft: "1.5rem" }}
          >
            {history !== undefined &&
              history.nutritional !== undefined &&
              history.nutritional.map((v, ind) => {
                return (
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    key={ind}
                    sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                  >
                    <b style={{ marginRight: "5px", fontSize: "14px" }}>
                      {v.problem}:{" "}
                    </b>
                    <span>
                      {v.value !== "" ? (
                        v.answerType === "Calender" ? (
                          <>
                            {v.value.split("-")[2]}-{v.value.split("-")[1]}-
                            {v.value.split("-")[0]}
                          </>
                        ) : (
                          v.value
                        )
                      ) : (
                        v.objective.map((vv, indx) => {
                          return (
                            <span key={indx} style={{ fontSize: "14px" }}>
                              {vv.data}{" "}
                              {vv.innerData.length > 0 && (
                                <span>
                                  (
                                  {vv.innerData.map((vi, vinx) => {
                                    return (
                                      <span
                                        key={vinx}
                                        style={{ fontSize: "14px" }}
                                      >
                                        {vi.data}
                                        {vv.innerData.length - 1 > vinx && (
                                          <span style={{ marginRight: "5px" }}>
                                            ,{" "}
                                          </span>
                                        )}
                                      </span>
                                    );
                                  })}
                                  )
                                </span>
                              )}{" "}
                              {v.objective.length - 1 > indx && (
                                <span
                                  style={{
                                    marginRight: "5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  ,{" "}
                                </span>
                              )}
                            </span>
                          );
                        })
                      )}
                    </span>
                  </Grid>
                );
              })}
          </Grid>
        </Box>

        <Box
          className={
            history.drugHistory !== undefined && history.drugHistory.length > 0
              ? "subSectionPrintColumn"
              : "subSectionPrint"
          }
          style={{ marginBottom: "5px" }}
        >
          <div>
            <h5 style={{ fontSize: "14px" }}>Drug History:</h5>
          </div>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: "0", marginLeft: "1.5rem" }}
          >
            {history.drugHistory !== undefined &&
              history.drugHistory.map((v, ind) => {
                return (
                  v.option === "Yes" && (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={ind}
                      sx={{ paddingLeft: "10px", marginTop: "-16px" }}
                    >
                      <b style={{ marginRight: "3px", fontSize: "14px" }}>
                        {v.problem}:{" "}
                      </b>
                      <span style={{ fontSize: "14px" }}>
                        {v.option === "Yes" ? (
                          <>Since {v.since}</>
                        ) : (
                          <>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            &nbsp; &nbsp; &nbsp; &nbsp;
                          </>
                        )}
                      </span>
                    </Grid>
                  )
                );
              })}
          </Grid>
        </Box>

        <Box className="subSectionPrint" style={{ marginBottom: "5px" }}>
          <div>
            <h5 style={{ fontSize: "14px" }}>Other History:</h5>
          </div>

          {history.other !== undefined && history.other !== "" && (
            <div style={{ fontSize: "14px" }} className="otherHistoryPrint">
              {history.other}
            </div>
          )}
        </Box>
      </div>
    </Box>
  );
};

export default PatientHistoryHistory;
