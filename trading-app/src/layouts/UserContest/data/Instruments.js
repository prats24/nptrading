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

function InstrumentsData(){

return (
    <>
        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} color="light">Instruments</MDTypography>
            </Grid>
        </Grid>

        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Contract Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Symbol</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>LTP</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Change(%)</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Buy</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Sell</MDTypography>
            </Grid>

        </Grid>

        <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>13-Apr-2023</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023CE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>₹231</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>+2%</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDButton variant="contained" color="info" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>B</MDButton>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDButton variant="contained" color="error" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>S</MDButton>
            </Grid>

        </Grid>

        <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>13-Apr-2023</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023PE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>₹131</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>-4%</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDButton variant="contained" color="info" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>B</MDButton>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDButton variant="contained" color="error" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>S</MDButton>
            </Grid>

        </Grid>
        </>
);
}

export default InstrumentsData;