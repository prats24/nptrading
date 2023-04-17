import React,{useState, useEffect, memo} from 'react'
import MDBox from '../../../../components/MDBox'
import MDButton from '../../../../components/MDButton'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MDTypography from '../../../../components/MDTypography'
import { Divider } from '@mui/material'
import DemoTradersRanking from '../../data/DemoTradersRanking'
import DummyInstrument from "./dummyInstrument"
import DummyPnl from "./dummyPnl"
import {useNavigate} from 'react-router-dom';

function ContestRegistration () {
    const nevigate = useNavigate();
  
    return (
    <MDBox  width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

        <Grid item xs={12} md={6} lg={6.5} mb={2} >
                <MDBox color="light" >

                    <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700, filter: 'blur(2px)'}}>
                        CONTEST NAME
                    </MDTypography>
                    
                    <DummyInstrument />
                    <DummyPnl />

                    

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            {/* Ranking View */}
            
            <DemoTradersRanking />
            



        </Grid>
    </MDBox>
  )

}
export default memo(ContestRegistration);