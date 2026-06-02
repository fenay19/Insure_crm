// import { Box, Grid } from "@mui/material";
// import React from "react";

// const PrintHistoryPresentIllness = ({ presentIllness }) => {

  


//   return (
//     <Box className="printDataSectionMargin notranslate">
//       <div className="printHead">
//         <h5>History of Present Illness:</h5>
//       </div>
//       <div className="printContent">
//         {presentIllness && presentIllness.length > 0 && (
//           <Box
//             className={
//               presentIllness.length > 0
//                 ? "subSectionPrintColumn"
//                 : "subSectionPrint"
//             }
//           >
//             <div className="printContent" style={{marginTop : "5px", marginLeft:"10px"}}>
//               <Grid container spacing={1} >
//                 {presentIllness.map((v, ind) => (
//                   <Grid item xs={6} sm={6} md={4} lg={4} xl={3} key={ind} sx={{ marginTop: "-8px" }}>
//                     <b style={{ marginRight: "5px" }}>{v.problem}: </b>
//                     {v.value !== "" ? (
//                       v.answerType === "Calender" ? (
//                         <>
//                           {v.value.split("-")[2]}-{v.value.split("-")[1]}-
//                           {v.value.split("-")[0]}
//                         </>
//                       ) : (
//                         v.value
//                       )
//                     ) : (
//                       v.objective.map((vv, indx) => (
//                         <span key={indx}>
//                           {vv.data}
//                           {v.objective.length - 1 > indx && (
//                             <span style={{ marginRight: "3px" }}>, </span>
//                           )}
//                         </span>
//                       ))
//                     )}
//                   </Grid>
//                 ))}</Grid>
              

//             </div>



//           </Box>
//         )}
//       </div>
//     </Box>
//   );
// };

// export default PrintHistoryPresentIllness;
import { Box, Grid } from "@mui/material";
import React from "react";

const PrintHistoryPresentIllness = ({ presentIllness = [] }) => {
  return (
    <Box className="printDataSectionMargin notranslate">
      {/* <div className="printHead">
        <h5>History of Present Illness:</h5>
      </div> */}

      {/* {presentIllness?.length > 0 && (
        <Box className="subSectionPrintColumn">
          <div className="printContent" style={{ marginTop: "5px", marginLeft: "10px" }}>
            <Grid container spacing={1}>
              {presentIllness.map((v, ind) => (
                <Grid item xs={6} sm={6} md={4} lg={4} xl={3} key={ind} sx={{ marginTop: "-8px" }}>
                  <b style={{ marginRight: "5px" }}>{v?.problem || "Unknown"}:</b>
                  
                  {v?.value ? (
                    v?.answerType === "Calender" ? (
                      // Convert YYYY-MM-DD to DD-MM-YYYY
                      <>
                        {v?.value?.split("-")?.[2] || "??"}-
                        {v?.value?.split("-")?.[1] || "??"}-
                        {v?.value?.split("-")?.[0] || "??"}
                      </>
                    ) : (
                      v?.value
                    )
                  ) : (
                    v?.objective?.length > 0 ? (
                      v.objective.map((vv, indx) => (
                        <span key={indx}>
                          {vv?.data || "N/A"}
                          {indx < v.objective.length - 1 && <span>, </span>}
                        </span>
                      ))
                    ) : (
                      <span>N/A</span>
                    )
                  )}
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      )} */}
    </Box>
  );
};

export default PrintHistoryPresentIllness;
