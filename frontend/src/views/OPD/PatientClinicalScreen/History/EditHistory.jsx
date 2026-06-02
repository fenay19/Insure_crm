import { Box, Button, Chip } from '@mui/material'
import React from 'react'

function EditHistory({openEditHistory, setOpenEditHistory, setOpenEditPopup, allMedicalProblems}) {




  return (
    <div>
     {openEditHistory.pastHistory && <Box>
          {allMedicalProblems.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          // style={{ margin: '5px' }}
                          className="selectProblem"
                          label={val.problem}
                          color="secondary"
                          variant="outlined"
                          sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'secondary.main', p: 1, mr: 1, mt: 1 }}
                         
                        />
                      );
                    })}
                    

     <Button variant='contained' onClick={()=>{
          setOpenEditHistory(false)
          setOpenEditPopup(false)
         
     }}>
          Cancel
     </Button>
     </Box> }
    </div>
  )
}

export default EditHistory