import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import logo from '../../../assets/images/mirai.png';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const navItems = ['About', 'Features', 'Pricing', 'Contact'];

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 20,
          left: 0,
          right: 0,
          mx: 'auto', // center horizontally
          maxWidth: '98%', // control width, keeps spacing from both sides
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          color: 'black'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 40,
              cursor: 'pointer'
            }}
          />

          {/* Desktop Nav */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 4,
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item}
                onClick={() => handleScroll(item)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: '#007c9eec' }
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#007c9eec',
                color: '#007c9eec',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#007c9eec',
                  color: 'white',
                  borderColor: '#007c9eec'
                }
              }}
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </Button>
            {/* <Button
              variant="contained"
              sx={{
                backgroundColor: '#007c9eec',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#006a87' }
              }}
            >
              Sign Up
            </Button> */}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton edge="end" onClick={toggleDrawer(true)} sx={{ display: { xs: 'flex', md: 'none' }, color: 'black' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={toggleDrawer(false)}>
          <IconButton sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item} onClick={() => handleScroll(item)}>
                <ListItemText
                  primary={item}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': { color: '#007c9eec' }
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#007c9eec',
                color: '#007c9eec',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#007c9eec',
                  color: 'white',
                  borderColor: '#007c9eec'
                }
              }}
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </Button>
            {/* <Button
              variant="contained"
              sx={{
                backgroundColor: '#007c9eec',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#006a87' }
              }}
            >
              Sign Up
            </Button> */}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
