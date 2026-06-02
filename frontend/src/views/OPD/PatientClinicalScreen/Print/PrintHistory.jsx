import { Box, Checkbox, Grid, Typography } from '@mui/material';
import { get } from 'api/api';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrintHistory = () => {
  const [patientHistoryData, setPatientHistoryData] = useState({});
  const selectedPatient = useSelector((state) => state.patient.selectedPatient);
  const getPatientHistory = async () => {
    try {
      const response = await get(`patient-history/${selectedPatient?.patientId?._id}`);

      if (response) {
        const res = response?.data.map((v) => ({
          medicalProblems: v?.medicalProblems,
          drugHistory: v?.drugHistory,
          allergies: v?.allergies,
          familyHistory: v?.familyHistory,
          lifeStyle: v?.lifeStyle,
          gynac: v?.gynac,
          obstetric: v?.obstetric,
          nutritional: v?.nutritional,
          pediatric: v?.pediatric,
          procedure: v?.procedure,
          other: v?.other
        }));
        setPatientHistoryData(res?.[0]);
      } else {
        console.warn('No patient history found or API returned an error.');

        setPatientHistoryData({});
      }
    } catch (error) {
      console.error('Error fetching patient history:', error);

      setPatientHistoryData({}); // or set an error state
    }
  };
  useEffect(() => {
    if (selectedPatient?.consultantId && selectedPatient?._id) {
      getPatientHistory();
    }
  }, [selectedPatient?.consultantId, selectedPatient?._id]);
  return (
    <Box>
      {patientHistoryData?.length ? (
        <Box className="printDataSectionMargin notranslate">
          <div className="printHead ">
            <h5>Medical History: </h5>
          </div>
          <div className="printContent" style={{ marginLeft: '10px' }}>
            <Box
              className={
                patientHistoryData.medicalProblems !== undefined && patientHistoryData.medicalProblems.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Past History:</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData.medicalProblems &&
                  Array.isArray(patientHistoryData.medicalProblems) &&
                  patientHistoryData.medicalProblems.map((v, ind) => {
                    if (v.having === 'Yes') {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={`${ind}-${v._id}`} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <Box>
                            <b style={{ marginRight: '3px' }}>{v.problem}: </b>
                            <span>Since {v.since.since}</span>
                          </Box>
                        </Grid>
                      );
                    }
                    return null; // Skip rendering if option is not 'Yes'
                  })}
              </Grid>
            </Box>

            <Box
              className={
                patientHistoryData.familyHistory !== undefined && patientHistoryData.familyHistory.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Family History</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData.familyHistory &&
                  Array.isArray(patientHistoryData.familyHistory) &&
                  patientHistoryData.familyHistory.map((v, ind) => {
                    if (v.option === 'Yes') {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={`${ind}-${v._id}`} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <Box>
                            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', marginRight: '3px' }}>
                              {v.problem}:
                            </Typography>
                            <Typography variant="body1" component="span">
                              {v.familyMember.map((vv, inx) => (
                                <span key={`${inx}-${vv._id}`}>
                                  <b>{vv.memberRelation}:</b>
                                  <span> Since {vv.duration.since}</span>
                                  {inx !== v.familyMember.length - 1 && <>,&nbsp;</>}
                                </span>
                              ))}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    }
                    return null; // Skip rendering if option is not 'Yes'
                  })}
              </Grid>
            </Box>

            <Box
              className={
                patientHistoryData !== undefined && patientHistoryData?.lifeStyle !== undefined && patientHistoryData?.lifeStyle.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Personal History:</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData !== undefined &&
                  patientHistoryData?.lifeStyle !== undefined &&
                  patientHistoryData?.lifeStyle.map((v, ind) => {
                    return (
                      <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                        <span>
                          {v.value !== '' ? (
                            v.answerType === 'Calender' ? (
                              <>
                                {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                              </>
                            ) : (
                              v.value
                            )
                          ) : (
                            v.objective.map((vv, indx) => {
                              return (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => {
                                        return (
                                          <span key={vinx}>
                                            {vi.data}
                                            {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                          </span>
                                        );
                                      })}
                                      )
                                    </span>
                                  )}{' '}
                                  {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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
                patientHistoryData.allergies !== undefined &&
                patientHistoryData.allergies.which !== undefined &&
                ((patientHistoryData.allergies.which.general !== undefined && patientHistoryData.allergies.which.general.length > 0) ||
                  (patientHistoryData.allergies.which.drug !== undefined && patientHistoryData.allergies.which.drug.length > 0) ||
                  (patientHistoryData.allergies.which.food !== undefined && patientHistoryData.allergies.which.food.length > 0) ||
                  (patientHistoryData.allergies.which.other !== undefined && patientHistoryData.allergies.which.other.length > 0))
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div className="examData">
                <div>
                  <h5 style={{ fontWeight: 'bold' }}>Allergies:</h5>
                </div>
                <div className="selectOptionExam ">
                  <Checkbox
                    label="Yes"
                    checked={
                      patientHistoryData.allergies !== undefined &&
                      patientHistoryData.allergies.having !== undefined &&
                      patientHistoryData.allergies.having === 'Yes'
                        ? true
                        : false
                    }
                  />
                  Yes
                  <Checkbox
                    label="No"
                    checked={
                      patientHistoryData.allergies !== undefined &&
                      patientHistoryData.allergies.having !== undefined &&
                      patientHistoryData.allergies.having === 'No'
                        ? true
                        : false
                    }
                  />
                  No
                </div>
              </div>

              {patientHistoryData?.allergies !== undefined &&
                patientHistoryData?.allergies.having !== undefined &&
                patientHistoryData?.allergies.having === 'Yes' && (
                  <>
                    <Grid container spacing={2} sx={{ marginTop: '0' }}>
                      <Grid item xs={4} sm={4} md={4} lg={3} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        {patientHistoryData?.allergies?.which !== undefined &&
                          patientHistoryData?.allergies?.which?.general !== undefined &&
                          patientHistoryData?.allergies?.which?.general?.length > 0 && (
                            <div>
                              <b>General Allergy: </b>
                              <ul style={{ marginLeft: '12px' }}>
                                {patientHistoryData?.allergies?.which?.general?.map((v, inx) => {
                                  return (
                                    <li key={inx}>
                                      <Box
                                        sx={{
                                          fontWeight: '500',
                                          display: 'inline'
                                        }}
                                      >
                                        {v?.allergyName}
                                      </Box>
                                      : Since {v?.since.since}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={3} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        {patientHistoryData.allergies.which !== undefined &&
                          patientHistoryData.allergies.which.food !== undefined &&
                          patientHistoryData.allergies.which.food.length > 0 && (
                            <div>
                              <b>Food Allergy: </b>
                              <ul style={{ marginLeft: '12px' }}>
                                {patientHistoryData.allergies.which.food.map((v, inx) => {
                                  return (
                                    <li key={inx}>
                                      <Box
                                        sx={{
                                          fontWeight: '500',
                                          display: 'inline'
                                        }}
                                      >
                                        {v.allergyName}
                                      </Box>
                                      : Since {v.since.since}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={3} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        {patientHistoryData.allergies.which !== undefined &&
                          patientHistoryData.allergies.which?.drug !== undefined &&
                          patientHistoryData.allergies.which?.drug.length > 0 && (
                            <div>
                              <b>Drug Allergy: </b>
                              <ul style={{ marginLeft: '12px' }}>
                                {patientHistoryData.allergies.which.drug.map((v, inx) => {
                                  return (
                                    <li key={inx}>
                                      <Box
                                        sx={{
                                          fontWeight: '500',
                                          display: 'inline'
                                        }}
                                      >
                                        {v.allergyName}
                                      </Box>
                                      : Since {v.since.since}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                      </Grid>
                    </Grid>
                    {patientHistoryData.allergies.which !== undefined &&
                      patientHistoryData.allergies.which.other !== undefined &&
                      patientHistoryData.allergies.which.other.length > 0 && (
                        <div className="selectOptionExam" style={{ marginTop: '5px' }}>
                          <b>Other Allergy: </b>
                          <span>{patientHistoryData.allergies.which.other}</span>
                        </div>
                      )}
                  </>
                )}
            </Box>

            <Box
              className={
                patientHistoryData.procedure !== undefined &&
                patientHistoryData.procedure.which !== undefined &&
                patientHistoryData.procedure.which.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div className="examData">
                <div>
                  <h5 style={{ fontWeight: 'bold' }}>Procedure:</h5>
                </div>
                <div className="selectOptionExam ">
                  <Checkbox
                    label="Yes"
                    checked={
                      patientHistoryData.procedure !== undefined &&
                      patientHistoryData.procedure.having !== undefined &&
                      patientHistoryData.procedure.having === 'Yes'
                        ? true
                        : false
                    }
                  />
                  Yes
                  <Checkbox
                    label="No"
                    checked={
                      patientHistoryData.procedure !== undefined &&
                      patientHistoryData.procedure.having !== undefined &&
                      patientHistoryData.procedure.having === 'No'
                        ? true
                        : false
                    }
                  />
                  No
                  <Checkbox
                    label="Don't Know"
                    checked={
                      patientHistoryData.procedure !== undefined &&
                      patientHistoryData.procedure.having !== undefined &&
                      patientHistoryData.procedure.having === "Don't Know"
                        ? true
                        : false
                    }
                  />
                  Don't Know
                </div>
              </div>
              {patientHistoryData.procedure !== undefined &&
                patientHistoryData.procedure.having !== undefined &&
                patientHistoryData.procedure.having === 'Yes' &&
                patientHistoryData.procedure.which !== undefined &&
                patientHistoryData.procedure.which.length > 0 && (
                  <Grid container spacing={2} sx={{ marginTop: '0' }}>
                    {patientHistoryData.procedure.which.map((v, inx) => {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={inx} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <b style={{ marginRight: '3px' }}>{v.surgery}: </b>
                          <span>{v.when.since} Ago</span>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
            </Box>

            {selectedPatient?.gender?.toLowerCase() === 'female' && (
              <Box
                className={
                  patientHistoryData !== undefined && patientHistoryData.gynac !== undefined && patientHistoryData.gynac.length > 0
                    ? 'subSectionPrintColumn'
                    : 'subSectionPrint'
                }
                style={{ marginBottom: '10px' }}
              >
                <div>
                  <h5 style={{ fontWeight: 'bold' }}>Gynac History:</h5>
                </div>

                <Grid container spacing={2} sx={{ marginTop: '0' }}>
                  {patientHistoryData !== undefined &&
                    patientHistoryData.gynac !== undefined &&
                    patientHistoryData.gynac.map((v, ind) => {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                          <span>
                            {v.value !== '' ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective.map((vv, indx) => {
                                return (
                                  <span key={indx}>
                                    {vv.data}{' '}
                                    {vv.innerData.length > 0 && (
                                      <span>
                                        (
                                        {vv.innerData.map((vi, vinx) => {
                                          return (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                            </span>
                                          );
                                        })}
                                        )
                                      </span>
                                    )}{' '}
                                    {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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

            {selectedPatient?.gender?.toLowerCase() === 'female' && (
              <Box
                className={
                  patientHistoryData !== undefined && patientHistoryData.obstetric !== undefined && patientHistoryData.obstetric.length > 0
                    ? 'subSectionPrintColumn'
                    : 'subSectionPrint'
                }
                style={{ marginBottom: '10px' }}
              >
                <div>
                  <h5 style={{ fontWeight: 'bold' }}>Obstetric History:</h5>
                </div>

                <Grid container spacing={2} sx={{ marginTop: '0' }}>
                  {patientHistoryData !== undefined &&
                    patientHistoryData.obstetric !== undefined &&
                    patientHistoryData.obstetric.map((v, ind) => {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                          <span>
                            {v.value !== '' ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective.map((vv, indx) => {
                                return (
                                  <span key={indx}>
                                    {vv.data}{' '}
                                    {vv.innerData.length > 0 && (
                                      <span>
                                        (
                                        {vv.innerData.map((vi, vinx) => {
                                          return (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                            </span>
                                          );
                                        })}
                                        )
                                      </span>
                                    )}{' '}
                                    {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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
                      `${JSON.parse(localStorage.getItem('patientConsult'))?.patientDetails?.dob?.split('/')[2]}-${
                        JSON.parse(localStorage.getItem('patientConsult'))?.patientDetails?.dob?.split('/')[1]
                      }-${JSON.parse(localStorage.getItem('patientConsult'))?.patientDetails?.dob?.split('/')[0]}`
                    ).getTime()
                ).getUTCFullYear() - 1970
              )
            ) < 18 && (
              <Box
                className={
                  patientHistoryData !== undefined && patientHistoryData.pediatric !== undefined && patientHistoryData.pediatric.length > 0
                    ? 'subSectionPrintColumn'
                    : 'subSectionPrint'
                }
                style={{ marginBottom: '10px' }}
              >
                <div>
                  <h5 style={{ fontWeight: 'bold' }}>Pediatric History:</h5>
                </div>

                <Grid container spacing={2} sx={{ marginTop: '0' }}>
                  {patientHistoryData !== undefined &&
                    patientHistoryData.pediatric !== undefined &&
                    patientHistoryData.pediatric.map((v, ind) => {
                      return (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                          <span>
                            {v.value !== '' ? (
                              v.answerType === 'Calender' ? (
                                <>
                                  {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                                </>
                              ) : (
                                v.value
                              )
                            ) : (
                              v.objective.map((vv, indx) => {
                                return (
                                  <span key={indx}>
                                    {vv.data}{' '}
                                    {vv.innerData.length > 0 && (
                                      <span>
                                        (
                                        {vv.innerData.map((vi, vinx) => {
                                          return (
                                            <span key={vinx}>
                                              {vi.data}
                                              {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                            </span>
                                          );
                                        })}
                                        )
                                      </span>
                                    )}{' '}
                                    {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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
                patientHistoryData !== undefined && patientHistoryData?.other !== undefined && patientHistoryData.nutritional.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Nutritional History:</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData !== undefined &&
                  patientHistoryData.nutritional !== undefined &&
                  patientHistoryData.nutritional.map((v, ind) => {
                    return (
                      <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                        <span>
                          {v.value !== '' ? (
                            v.answerType === 'Calender' ? (
                              <>
                                {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                              </>
                            ) : (
                              v.value
                            )
                          ) : (
                            v.objective.map((vv, indx) => {
                              return (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => {
                                        return (
                                          <span key={vinx}>
                                            {vi.data}
                                            {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                          </span>
                                        );
                                      })}
                                      )
                                    </span>
                                  )}{' '}
                                  {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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
                patientHistoryData.drugHistory !== undefined && patientHistoryData.drugHistory.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Drug History:</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData.drugHistory !== undefined &&
                  patientHistoryData.drugHistory.map((v, ind) => {
                    return (
                      v.option === 'Yes' && (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                          <b style={{ marginRight: '3px' }}>{v.problem}: </b>
                          <span>
                            {v.option === 'Yes' ? (
                              <>Since {v.since.since}</>
                            ) : (
                              <>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>
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
                patientHistoryData !== undefined && patientHistoryData?.other !== undefined && patientHistoryData?.other.length > 0
                  ? 'subSectionPrintColumn'
                  : 'subSectionPrint'
              }
              style={{ marginBottom: '10px' }}
            >
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Other History:</h5>
              </div>

              <Grid container spacing={2} sx={{ marginTop: '0' }}>
                {patientHistoryData !== undefined &&
                  patientHistoryData?.other !== undefined &&
                  patientHistoryData?.other.map((v, ind) => {
                    return (
                      <Grid item xs={6} sm={6} md={4} lg={3} key={ind} sx={{ paddingLeft: '10px', marginTop: '-16px' }}>
                        <b style={{ marginRight: '5px' }}>{v.problem}: </b>
                        <span>
                          {v.value !== '' ? (
                            v.answerType === 'Calender' ? (
                              <>
                                {v.value.split('-')[2]}-{v.value.split('-')[1]}-{v.value.split('-')[0]}
                              </>
                            ) : (
                              v.value
                            )
                          ) : (
                            v.objective.map((vv, indx) => {
                              return (
                                <span key={indx}>
                                  {vv.data}{' '}
                                  {vv.innerData.length > 0 && (
                                    <span>
                                      (
                                      {vv.innerData.map((vi, vinx) => {
                                        return (
                                          <span key={vinx}>
                                            {vi.data}
                                            {vv.innerData.length - 1 > vinx && <span style={{ marginRight: '5px' }}>, </span>}
                                          </span>
                                        );
                                      })}
                                      )
                                    </span>
                                  )}{' '}
                                  {v.objective.length - 1 > indx && <span style={{ marginRight: '5px' }}>, </span>}
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
          </div>
        </Box>
      ) : (
        <Box>
          <div className="printHead ">
            <h5>Medical History: </h5>
          </div>
          <Typography variant="h5" sx={{ mt: 1 }}>
            No History Available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PrintHistory;
