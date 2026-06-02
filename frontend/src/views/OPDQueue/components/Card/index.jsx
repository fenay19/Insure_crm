import { Typography, Card, CardContent, Box } from '@mui/material';

const Cards = ({ total, title }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ textAlign: 'center', padding: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          {total}
        </Box>
        {/* Title */}
        <Typography
          variant="subtitle2"
          sx={{
            marginTop: 1,
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.75rem' // Smaller font size for the title
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Cards;
