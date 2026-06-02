import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import RotatingWord from './RotatingWord';
import { useMediaQuery, useTheme } from '@mui/material';

const FloatingCard = ({ emoji, title, value }) => {
  return (
    <Box
      sx={{
        width: 220,
        pl: 2,
        pr: 2,
        p: 1,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        animation: 'floatDiagonal 6s ease-in-out infinite',
        '@keyframes floatDiagonal': {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(8px, -6px) rotate(1deg)' },
          '50%': { transform: 'translate(-6px, 8px) rotate(-1deg)' },
          '75%': { transform: 'translate(4px, -4px) rotate(0.5deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(0deg)' }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 18 }}>{emoji}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            flexGrow: 1,
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': { bgcolor: '#007c9eec' },
            bgcolor: 'rgba(0,0,0,0.1)'
          }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 300, minWidth: 30 }}>
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

const FloatingVisitorsCard = ({ title, count, percentage }) => {
  return (
    <Box
      sx={{
        width: 180,
        p: 1.5,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        backdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.7)',
        animation: 'floatDiagonal 6s ease-in-out infinite',
        '@keyframes floatDiagonal': {
          '0%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(-4px, 4px)' },
          '100%': { transform: 'translate(0px, 0px)' }
        }
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
        {count.toLocaleString()}
      </Typography>
      <Typography variant="caption" sx={{ color: '#28a745', fontWeight: 500 }}>
        ↑ {percentage}% from yesterday
      </Typography>

      {/* mini graph */}
      <Box
        component="img"
        src="https://quickchart.io/chart?c={type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri'],datasets:[{data:[10,15,12,18,20],fill:false,borderColor:'%23007c9e',tension:0.4}]},options:{plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}}"
        alt="mini-graph"
        sx={{ mt: 0.5, width: '100%', borderRadius: 1 }}
      />
    </Box>
  );
};

const LandingHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: '100vh',
        pt: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fdfdfd',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Faded stretched background */}
      <Box
        sx={{
          position: 'absolute',
          width: '120%',
          height: '80%',
          borderRadius: '50%',
          background: 'rgba(0,124,158,0.25)',
          filter: 'blur(80px)',
          zIndex: 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Single left floating card */}
      <Box sx={{ position: 'absolute', left: 200, top: 400, transform: 'translateY(-50%)' }}>
        <FloatingCard emoji="😊" title="Happy Customer" value={95} />
      </Box>

      {/* Single left floating card */}
      <Box sx={{ position: 'absolute', right: 200, bottom: 200, transform: 'translateY(-50%)' }}>
        <FloatingCard emoji="😊" title="Happy Customer" value={95} />
      </Box>

      {/* Bottom-right floating visitors card */}
      {/* <Box sx={{ position: 'absolute', right: 700, top: 300 }}>
        <FloatingVisitorsCard title="Today's Visitors" count={17058} percentage={9.3} />
      </Box> */}

      {/* Bottom-right floating visitors card */}
      <Box sx={{ position: 'absolute', left: 200, bottom: 300 }}>
        <FloatingVisitorsCard title="Today's Visitors" count={17058} percentage={9.3} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 200,
          top: 400,
          transform: 'translateY(-50%)'
        }}
      >
        <Box
          sx={{
            width: 220,
            p: 2,
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
            animation: 'floatDiagonal 6s ease-in-out infinite',
            '@keyframes floatDiagonal': {
              '0%': { transform: 'translate(0px, 0px)' },
              '50%': { transform: 'translate(-4px, 4px)' },
              '100%': { transform: 'translate(0px, 0px)' }
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            CRM Activity Overview 📊
          </Typography>
          <Box
            component="img"
            src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Leads','Calls','Deals','Revenue'],datasets:[{data:[30,45,20,60],backgroundColor:'rgba(0,124,158,0.6)'}]},options:{plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}}"
            alt="mini-bar-chart"
            sx={{ width: '100%', borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'gray', mt: 1 }}>
            Weekly CRM Summary
          </Typography>
        </Box>
      </Box>
      {/* <Box
        sx={{
          position: 'absolute',
          right: 800,
          bottom: 50,
          transform: 'translateY(-50%)'
        }}
      >
        <Box
          sx={{
            width: 220,
            p: 2,
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
            animation: 'floatDiagonal 6s ease-in-out infinite',
            '@keyframes floatDiagonal': {
              '0%': { transform: 'translate(0px, 0px)' },
              '50%': { transform: 'translate(-4px, 4px)' },
              '100%': { transform: 'translate(0px, 0px)' }
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            CRM Activity Overview 📊
          </Typography>
          <Box
            component="img"
            src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Leads','Calls','Deals','Revenue'],datasets:[{data:[30,45,20,60],backgroundColor:'rgba(0,124,158,0.6)'}]},options:{plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}}"
            alt="mini-bar-chart"
            sx={{ width: '100%', borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'gray', mt: 1 }}>
            Weekly CRM Summary
          </Typography>
        </Box>
      </Box> */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          gap: 2
        }}
      >
        <Typography
          variant="h1"
          sx={{
            width: { xs: '40%', md: '60%', lg: '60%' },
            textAlign: 'right',
            fontWeight: 400,
            fontSize: { xs: '2rem', md: '4rem', lg: '5rem' },
            lineHeight: 1.2,
            color: 'black',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Customer Relation
        </Typography>

        {isMobile ? (
          // Mobile: static inline display
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '2rem',
              lineHeight: 1.2,
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'black'
            }}
          >
            <span style={{ fontSize: '1rem', color: '#007c9eec', textAlign: 'center' }}>Magic</span>
            <span style={{ fontSize: '2rem', color: '#007c9eec', textAlign: 'center' }}>Management</span>
            <span style={{ fontSize: '1rem', color: '#007c9eec', textAlign: 'center' }}>Mirai CRM</span>
          </Typography>
        ) : (
          <RotatingWord />
        )}
      </Box>
    </Box>
  );
};

export default LandingHome;
