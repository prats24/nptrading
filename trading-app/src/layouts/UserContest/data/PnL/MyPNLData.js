import React,{useState} from 'react'
// import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
// import MDButton from '../../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
// import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import { useLocation } from 'react-router-dom';
// import axios from "axios";

function MYPNLData({contestId}){

return (
    <>
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
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023CE</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>250</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>135</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>140</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>+1250</MDTypography>
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

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Open Quantity : 250</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Gross P&L : +₹1,100</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Brokerage : ₹100</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Net P&L : +₹1,000</MDTypography>
                        </Grid>
    
                    </Grid>
    </>
);
}

export default MYPNLData;