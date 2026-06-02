import React,{useState} from 'react';
import { Grid, TextField, IconButton,Dialog,DialogTitle,DialogContent,DialogActions,Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FormFields = ({ formData, setFormData,handleAddCustomSection}) => {
  const [openModal, setOpenModal] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleAddCustomSectionSubmit = () => {
    if (customSectionName) {
      handleAddCustomSection(customSectionName);
      setCustomSectionName('');
      handleCloseModal();
    }
  };
  return (
    <div>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Diagnosis"
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{ border: '1px solid black' }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Allergy"
          value={formData.allergy}
          onChange={(e) => setFormData({ ...formData, allergy: e.target.value})}
          fullWidth
          variant="outlined"
          sx={{ border: '1px solid black' }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Post of Day"
          value={formData.postofDay}
          onChange={(e) => setFormData({ ...formData, postofDay: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{ border: '1px solid black' }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="ICU Day"
          value={formData.icuDay}
          onChange={(e)=>setFormData({ ...formData, icuDay: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{ border: '1px solid black' }}
        />
      </Grid>
      <Grid item xs={12} sm={4} display="flex" alignItems="center">
        <TextField
          label="Diet Orders"
          value={formData.dietOrders}
          onChange={(e) => setFormData({ ...formData, dietOrders: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{ border: '1px solid black' }}
        />
      </Grid>
      <Grid item xs={12} sm={4} display="flex" alignItems="center">
          <IconButton onClick={handleOpenModal} color="primary" sx={{ ml: 1 }}>
            <AddIcon fontSize="large" />
          </IconButton>
      </Grid>
    </Grid>
    <Dialog open={openModal} onClose={handleCloseModal}>
    <DialogTitle>Add Custom Section</DialogTitle>
    <DialogContent>
      <TextField
        label="Custom Section Name"
        value={customSectionName}
        onChange={(e) => setCustomSectionName(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddCustomSectionSubmit} color="primary">
        Add Section
      </Button>
    </DialogActions>
  </Dialog>
  </div>
  );
};

export default FormFields;

