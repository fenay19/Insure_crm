import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const styles = {
  card: {
    minHeight: '100%',
    width: '100%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow for a modern look
    borderRadius: '8px'
  },
  cardContent: {
    padding: 0
  },
  header: {
    padding: '1rem',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2
  },
  headerText: {
    color: 'white'
  },
  searchInput: {
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    width: '200px',
    fontSize: '14px',
    outline: 'none',
    transition: 'box-shadow 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add subtle shadow
    '&:focus': {
      border: '1px solid #1976d2',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Add focus effect
    }
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'background.paper',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid',
    borderColor: 'divider'
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '40vh',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent'
    }
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px', // Increased padding for better spacing
    cursor: 'pointer',
    borderRadius: '8px', // Rounded corners for a cleaner look
    marginBottom: '8px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)' // Add hover effect
    }
  },
  rowText: {
    flex: 1,
    fontWeight: '500', // Medium font weight for readability
    fontSize: '13px' // Slightly larger font size
  }
};

const StickyHeader = () => (
  <Box sx={styles.stickyHeader}>
    <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '13px' }}>Select Dr</Typography>
    <Typography sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>Select Department</Typography>
    <Typography sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>Availability</Typography>
  </Box>
);

const Row = ({ row, index, onClick }) => {
  const handleClick = (row) => {
    return function () {
      window.localStorage.setItem('selected-department', row?.department);
      onClick(row);
    };
  };

  const theme = useTheme();
  return (
    <Box
      sx={{
        ...styles.row,
        justifyContent: 'space-between'
      }}
      onClick={handleClick(row)}
    >
      <Typography sx={styles.rowText}>{row.label}</Typography>
      <Typography sx={{ ...styles.rowText, textAlign: 'center' }}>{row.department}</Typography>
      <Typography
        sx={{
          ...styles.rowText,
          textAlign: 'right',
          color: row.value === 'Unavailable' ? theme.palette.error.main : theme.palette.success.main
        }}
      >
        {row.value}
      </Typography>
    </Box>
  );
};

const DepartmentWiseDoctor = ({ rows, headerData, color, onClick }) => {
  console.log('DARAAAAAAAA', rows);
  const [filteredData, setFilteredData] = useState(rows);
  useEffect(() => {
    setFilteredData(rows);
  }, [rows]);
  const handleChange = (e) => {
    const { value } = e.target;
    console.log('Rows', rows, value);

    const filteredData = rows?.filter(({ label }) => {
      const searched = label.toLowerCase()?.includes(value.toLowerCase());
      return searched;
    });

    setFilteredData(filteredData ?? rows);
    console.log('Filtered', filteredData);
  };
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        {/* Header */}
        <Box
          sx={{
            ...styles.header,
            backgroundColor: '#5E686D'
          }}
        >
          <Typography variant="h6" sx={styles.headerText}>
            Department wise Doctor Availability
          </Typography>
          <input
            type="text"
            placeholder="Search..."
            style={{
              ...styles.searchInput
            }}
            onChange={handleChange}
          />
        </Box>

        {/* Content */}
        <Box sx={styles.rowContainer}>
          <StickyHeader />
          {filteredData?.length > 0 ? (
            filteredData.map((row, index) => <Row key={row?._id || index} row={row} index={index} onClick={onClick} />)
          ) : (
            <Typography sx={{ padding: 2, textAlign: 'center' }}>No data available</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentWiseDoctor;
