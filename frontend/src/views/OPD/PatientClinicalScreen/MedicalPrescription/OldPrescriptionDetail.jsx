import { Box } from "@mui/material";

const OldPrescriptionDetail = ({
  oldPrescriptions,
  handleSubmitPrescription,
  prescriptions,
}) => {
  return (
    <>
      {Object.values(oldPrescriptions).length > 0 && (
        <>
          <h4>
            {oldPrescriptions.medical.length > 0 &&
              oldPrescriptions.medical[0].intentNumber}{" "}
            {Object.values(oldPrescriptions).length > 0 &&
              oldPrescriptions.date.length > 0 &&
              `"${oldPrescriptions.date}"`}
          </h4>
          <div className="oldPresMedicine">
            {oldPrescriptions.medical.length > 0 &&
              oldPrescriptions.medical[0].prescription.map((v, ind) => {
                let presc = false;
                prescriptions.forEach((pre) => {
                  if (
                    pre.brandName === v.brandName &&
                    pre.dose === v.dose &&
                    v.intake === pre.intake &&
                    v.time === pre.time &&
                    v.when === pre.when &&
                    v.duration === pre.duration
                  ) {
                    presc = true;
                  }
                });
                return (
                  <Box
                    key={ind}
                    className={presc ? "oldPresTabActive" : "oldPresTab"}
                    onClick={() => {
                      handleSubmitPrescription(v);
                    }}
                  >
                    <div className={presc ? "presDetailActive" : "presDetail"}>
                      <h6 className="tabname">
                        {v.type.toString().substring(0, 3).toUpperCase()}{" "}
                        {v.brandName} ({v.dose})
                      </h6>

                      <div>
                        <span>
                          {v.intake} {v.type},
                        </span>
                        <span>{v.time},</span>
                        <span>
                          {v.when}
                          {v.duration !== "" && ","}
                        </span>{" "}
                        <span>{v.duration}</span>
                        {(v.type.toLowerCase().includes("tab") ||
                          v.type.toLowerCase().includes("cap") ||
                          v.type.toLowerCase().includes("inj")) && (
                          <span>
                            (Total: {v.totalMed} {v.type})
                          </span>
                        )}
                      </div>
                      {v.notes.length > 0 && (
                        <div style={{ marginTop: "-6px" }}>
                          <span style={{ fontWeight: "bold" }}>{v.notes}</span>
                        </div>
                      )}
                    </div>
                  </Box>
                );
              })}

            {oldPrescriptions.glass !== undefined &&
              oldPrescriptions.glass.length > 0 && (
                <Box style={{ width: "98%" }}>
                  <h6 style={{ color: "blue", margin: "20px 0 -15px 0" }}>
                    Glass Prescription:
                  </h6>

                  <Box
                    className="Timing"
                    style={{ border: "1px solid black", width: "100%" }}
                  >
                    <div className="MedTiming">
                      <div
                        style={{ fontWeight: "bolder", color: "black" }}
                        className="glassPres"
                      >
                        ℞
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#f3f308" }}
                      >
                        Sphere
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#19d019" }}
                      >
                        Cylinder
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#4ab1ff" }}
                      >
                        Axis
                      </div>
                      <div className="glassPres" style={{ background: "pink" }}>
                        Add
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#a8a8a8" }}
                      >
                        PD
                      </div>
                    </div>
                    <div className="MedTiming">
                      <div className="glassPres">OD</div>
                      <div
                        className="glassPres"
                        style={{ background: "#f3f308" }}
                      >
                        {oldPrescriptions.glass[0].left.sphere}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#19d019" }}
                      >
                        {oldPrescriptions.glass[0].left.cylinder}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#4ab1ff" }}
                      >
                        {oldPrescriptions.glass[0].left.axis}
                      </div>
                      <div className="glassPres" style={{ background: "pink" }}>
                        {oldPrescriptions.glass[0].left.add}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#a8a8a8" }}
                      >
                        {oldPrescriptions.glass[0].left.pd}
                      </div>
                    </div>
                    <div className="MedTiming">
                      <div className="glassPres">OS</div>
                      <div
                        className="glassPres"
                        style={{ background: "#f3f308" }}
                      >
                        {oldPrescriptions.glass[0].right.sphere}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#19d019" }}
                      >
                        {oldPrescriptions.glass[0].right.cylinder}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#4ab1ff" }}
                      >
                        {oldPrescriptions.glass[0].right.axis}
                      </div>
                      <div className="glassPres" style={{ background: "pink" }}>
                        {oldPrescriptions.glass[0].right.add}
                      </div>
                      <div
                        className="glassPres"
                        style={{ background: "#a8a8a8" }}
                      >
                        {oldPrescriptions.glass[0].right.pd}
                      </div>
                    </div>
                  </Box>
                  {oldPrescriptions.glass[0].notes !== "" && (
                    <div>
                      <span style={{ fontWeight: "bold" }}>Note: </span>
                      {oldPrescriptions.glass[0].notes}
                    </div>
                  )}
                </Box>
              )}
          </div>
        </>
      )}
    </>
  );
};

export default OldPrescriptionDetail;
