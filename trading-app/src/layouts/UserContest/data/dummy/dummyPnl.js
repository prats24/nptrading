import React,{useState, useEffect} from 'react'
// import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'

function MYPNLData(){


return (
    <>
    {/* <Grid container mt={2} zIndex={1} position={'relative'} sx={{mt: "100px", }}>
        <Grid item xs={12} md={12} lg={12}>
        <MDTypography fontSize={13} color="light">Your Pnl will show here</MDTypography>
        </Grid>
    </Grid> */}
    <Grid style={{ filter: 'blur(2px)' }}>
      <Grid container mt={2}>
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={13} color="light">My P&L</MDTypography>
        </Grid>
      </Grid>

      <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
          
          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Instrument</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Quantity</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Avg. Price</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>LTP</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Gross P&L</MDTypography>
          </Grid>

          {/* <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Net P&L</MDTypography>
          </Grid> */}

      </Grid>




        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>NIFTY13042023PE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>0</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>134</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>121</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>-150</MDTypography>
            </Grid>

        </Grid>

       <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
          
          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>NIFTY13042023PE</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>0</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>134</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>121</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="warning" style={{fontWeight:700}}>-150</MDTypography>
          </Grid>

      </Grid>

       
    </Grid>
    <Grid  container mt={2} zIndex={1} position={'relative'}>
      <Grid item xs={12} md={12} lg={12} style={{ position: "absolute", top: "-65px", left: "35%" }}>
        <MDTypography fontSize={20} fontWeight={900} color="light">Your Pnl will show here</MDTypography>
      </Grid>
    </Grid>
    </>
);
}

export default MYPNLData;