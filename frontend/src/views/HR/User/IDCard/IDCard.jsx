import React from "react";
import { Box, Typography, Avatar, Grid } from "@mui/material";

export const EmployeeID = () => {
  return (
    <Box
      sx={{
        width: 320,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6c63ff 30%, #a091ff 100%)",
          height: 140,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
        }}
      >
        {/* Circular Profile Picture */}
        <Avatar
          alt="Profile"
          src="https://via.placeholder.com/80"
          sx={{
            width: 90,
            height: 90,
            position: "absolute",
            bottom: -45,
            border: "4px solid white",
            backgroundColor: "#eee",
          }}
        />
      </Box>

      {/* Content Section */}
      <Box sx={{ padding: "60px 20px 20px" }}>
        {/* Employee Name */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 1,
            color: "#333",
          }}
        >
          GAYATRI WATAN KOLSE
        </Typography>

        {/* Info Details */}
        <Grid container spacing={1} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Designation:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#333" }}
            >
              "BILLING INCHARGE"
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Department:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#333" }}
            >
              BILLING
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Emp ID:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#333" }}
            >
              13
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#f9f9f9",
          padding: "10px 16px",
          borderTop: "1px solid #eee",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: 10,
            width: 20,
            height: 20,
            backgroundColor: "#6c63ff",
            borderRadius: "50%",
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: 20,
            width: 20,
            height: 20,
            backgroundColor: "#6c63ff",
            borderRadius: "50%",
          }}
        ></Box>
      </Box>
    </Box>
  );
};



const IDCard = () => {
  return (
    <Box
      sx={{
        width: 400,
        border: '1px solid #ccc',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 4,
        backgroundColor: '#fff',
        textAlign: 'center'
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: '#6c63ff',
          color: '#fff',
          padding: 2,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            margin: '0 auto',
            backgroundColor: '#fff'
          }}
        >
          <Typography variant="h6" sx={{ color: '#6c63ff', fontWeight: 'bold' }}>
            NSH
          </Typography>
        </Avatar>
        <Typography variant="subtitle1" sx={{ marginTop: 1, color: 'white' }}>
          Critical Care Hospital & Diagnostic Centre
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', marginTop: 0.5, color: 'white' }}>
          Excellence in Care
        </Typography>
      </Box>

      {/* Details Section */}
      <Box sx={{ padding: 3 }}>
  <Grid container spacing={2}>
    {/* Date of Joining */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Date of Joining:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        25-Nov-24
      </Typography>
    </Grid>

    {/* Date of Birth */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Date of Birth:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        20-Oct-88
      </Typography>
    </Grid>

    {/* Blood Group */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Blood Group:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        -
      </Typography>
    </Grid>

    {/* Emergency Contact */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Emergency Contact:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        9860424922
      </Typography>
    </Grid>

    {/* Hospital Reception */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Hospital Reception:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        9028050462
      </Typography>
    </Grid>

    {/* Hospital Address */}
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="left">
        Hospital Address:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" align="right">
        Plot No. 72, Gangabai Ghat Chowk, Nagpur 440008
      </Typography>
    </Grid>
  </Grid>
</Box>



      {/* Footer Section with Curve */}
      <Box
        sx={{
          backgroundColor: '#6c63ff',
          color: '#fff',
          padding: 2,
          textAlign: 'center',
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          marginTop: 2
        }}
      >
        <Typography variant="body2">Plot No. 72, Gangabai Ghat Chowk, Nagpur 440008</Typography>
      </Box>
    </Box>
  );
};

export default IDCard;
