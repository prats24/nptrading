import React,{useState} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
import { HiUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation } from 'react-router-dom';
import axios from "axios";

function TradersRanking(){

return (
    <>
        <Grid item xs={12} md={6} lg={5} mb={2} style={{ filter: 'blur(2px)' }}>
                <MDBox color="light">

                    <MDTypography mb={2} color="light" display="flex" justifyContent="center">
                        Ranks
                    </MDTypography>
                    
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                          <MDTypography fontSize={13} color="light">My Rank</MDTypography>
                        </Grid>
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Rank</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Name</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>P&L</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Profit(%)</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">121</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Prateek Pawan</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="error">-₹2,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="error">-20%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container mt={2}>
                        <Grid item xs={12} md={12} lg={12}>
                          <MDTypography fontSize={13} color="light">Top 10 Traders Rank</MDTypography>
                        </Grid>
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">1</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Aman Gupta</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹18,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">2</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Rajeev Ranjan</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹17,500</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">3</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Piyush Bansal</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹17,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">4</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Piyush Bansal</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹16,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">5</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Piyush Bansal</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹14,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">6</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Piyush Bansal</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹10,300</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+21%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">7</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Amit Kumar</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹10,250</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+11%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">8</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Jitesh Duggar</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹10,100</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+11%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">9</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Rajesh Sharma</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹9,300</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+8%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">10</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Kumar Jitendra</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+₹7,500</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="success">+3%</MDTypography>
                        </Grid>
    
                    </Grid>

                </MDBox>
            </Grid> 
    </>
);
}

export default TradersRanking;