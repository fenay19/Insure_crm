import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const words = ['Management', 'Magic', 'MiraiCRM'];

const RotatingWord = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Get relative positions for 3-word vertical display
  const getPosition = (index) => {
    const prev = (currentIndex - 1 + words.length) % words.length;
    const next = (currentIndex + 1) % words.length;

    if (index === currentIndex) return 'center';
    if (index === prev) return 'top';
    if (index === next) return 'bottom';
    return 'hidden';
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        width: { xs: '8rem', md: '12rem', lg: '15rem' },
        height: { xs: '2.5rem', md: '4rem', lg: '5rem' } // height of one word
      }}
    >
      {words.map((word, index) => {
        const position = getPosition(index);
        let style = {};

        switch (position) {
          case 'center':
            style = {
              opacity: 1,
              filter: 'blur(0px)',
              fontSize: { xs: '2rem', md: '4rem', lg: '5rem' },
              zIndex: 2,
              transform: 'translateY(0)'
            };
            break;
          case 'top':
            style = {
              opacity: 0.5,
              filter: 'blur(4px)',
              fontSize: { xs: '1.5rem', md: '3rem', lg: '4rem' },
              zIndex: 1,
              transform: { xs: 'translateY(-2rem)', md: 'translateY(-4.5rem)', lg: 'translateY(-4.5rem)' }
            };
            break;
          case 'bottom':
            style = {
              opacity: 0.5,
              filter: 'blur(4px)',
              fontSize: { xs: '1.5rem', md: '3rem', lg: '4rem' },
              zIndex: 1,
              transform: { xs: 'translateY(3rem)', md: 'translateY(5.5rem)', lg: 'translateY(5.5rem)' }
            };
            break;
          case 'hidden':
            style = { opacity: 0, transform: 'translateY(0)' };
            break;
          default:
            break;
        }

        return (
          <Typography
            key={index}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'left',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.2,
              color: '#007c9eec',
              transition: 'all 0.5s ease',
              ...style
            }}
          >
            {word}
          </Typography>
        );
      })}
    </Box>
  );
};

export default RotatingWord;
