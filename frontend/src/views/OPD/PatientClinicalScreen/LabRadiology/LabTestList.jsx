import { Chip } from "@mui/material";

const LabTestList = ({singleData, submittedInvestigation, handleEditData }) => {
  
  return (
    <>
      {singleData.map((val, ind) => {
        return (
          <Chip
            key={ind}
            className="selectProblemActive"
            label={`${val.testName}`}
            onDelete={() => {
              let medPro = [];
              submittedInvestigation.forEach((vM) => {
                if (vM.investigationId !== val.investigationId) {
                  medPro.push(vM);
                }
              });

              handleEditData(medPro);
            }}
          />
        );
      })}
    </>
  );
};

export default LabTestList;
