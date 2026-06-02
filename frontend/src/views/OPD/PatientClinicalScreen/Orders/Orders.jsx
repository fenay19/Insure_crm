import { Button, Grid } from '@mui/material';
import { useState } from 'react';
import LabRadiology from '../LabRadiology/LabRadiology';
import Procedure from '../Procedure/Procedure';
import Instruction from '../Instruction/Instruction';
import Diagnostics from '../OtherDiagnostics/OtherDiganostics';
import Investigation from '../Investigation/Investigation';
import CrossConsultation from '../CrossConsultation/CrossConsultation';
const Orders = ({ selectedMenu, editData }) => {
  const departmentId = editData?.departmentId?._id;
  const [toggle, setToggle] = useState('Investigation');

  const buttonStyles = (buttonTitle) => ({
    backgroundColor: toggle === buttonTitle ? '#004d4d' : 'rgb(8, 155, 171)',
    color: 'white'
  });

  const openFormModal = (formName) => {
    setToggle(formName);
  };
  return (
    <div className="paticularSection">
      <Grid container spacing={2} height="inherit" style={{ alignContent: 'flex-start' }}>
        <Grid item xs={12} style={{ marginBottom: '-5px' }}>
          {selectedMenu !== 'All' && <h2 className="popupHead">Orders</h2>}
        </Grid>
        <Grid item xs={12}>
          <Button
            className="global_btn"
            onClick={() => {
              openFormModal('Investigation');
            }}
            style={buttonStyles('Investigation')}
          >
            Investigation
          </Button>

          <Button
            className="global_btn"
            onClick={() => {
              openFormModal('Procedure');
            }}
            style={buttonStyles('Procedure')}
            sx={{ marginLeft: '10px' }}
          >
            Procedure
          </Button>

          <Button
            className="global_btn"
            onClick={() => {
              openFormModal('CrossConsultation');
            }}
            
            style={buttonStyles('CrossConsultation')}
            sx={{ marginLeft: '10px' }}
          >
            Cross Consultation
          </Button>

          <Button
            className="global_btn"
            onClick={() => {
              openFormModal('Instruction');
            }}
            style={buttonStyles('Instruction')}
            sx={{ marginLeft: '10px' }}
          >
            Instruction
          </Button>
        </Grid>

        <Grid item xs={12} height="calc(100% - 70px)">
          <div style={{ borderTop: '1px solid #e5dada', height: '100%' }}>
            {/* {toggle === 'Investigation' && <LabRadiology departmentId={departmentId} />} */}
            {toggle === 'Investigation' && <Investigation editData={editData} />}
            {toggle === 'CrossConsultation' && <CrossConsultation editData={editData}/>}
            {toggle === 'Procedure' && <Procedure editData={editData} />}
            {toggle === 'Instruction' && <Instruction editData={editData} />}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Orders;
