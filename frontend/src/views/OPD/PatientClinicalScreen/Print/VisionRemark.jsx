import { Typography, Box } from '@mui/material';

const VisionRemarkAdvice = ({ visionRemark, visionAdvice }) => {
  if (!visionRemark && !visionAdvice) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333', backgroundColor: '#f5f5f5', p: 0.5 }}>
        Vision Remarks & Advice
      </Typography>

      {visionRemark && (
        <Typography variant="body2" sx={{ mb: 1, color: '#444' }}>
          <strong>Remark:</strong> {visionRemark}
        </Typography>
      )}

      {visionAdvice && (
        <Typography variant="body2" sx={{ color: '#444' }}>
          <strong>Advice:</strong> {visionAdvice}
        </Typography>
      )}
    </Box>
  );
};

export default VisionRemarkAdvice;
