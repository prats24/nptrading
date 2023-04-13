import React from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography'
import Logo from '../../../assets/images/logo1.jpeg'

function Contests(){

return(
    <>
                <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="space-between">
                    <MDBox bgColor="dark" borderRadius={6} p={2}>
                        <MDBox display="flex" justifyContent="space-between">
                             <MDTypography color="light">Contests</MDTypography>
                             <MDButton variant="text" size="small" color="light">View all</MDButton>
                        </MDBox>
                        
                        <Grid container spacing={2} xs={12} md={12} lg={12} minWidth="100%">
                            <Grid item xs={12} md={12} lg={4} display="flex" justifyContent="space-between" flexDirection="row" maxWidth="100%" height='auto' flexWrap="nowrap">
                                <img src={Logo} width={250} height={250}/>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display="flex" justifyContent="space-between" flexDirection="row" maxWidth="100%" height='auto' flexWrap="nowrap">
                                <img src={Logo} width={250} height={250}/>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display="flex" justifyContent="space-between" flexDirection="row" maxWidth="100%" height='auto' flexWrap="nowrap">
                                <img src={Logo} width={250} height={250}/>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>
                </>
)}

export default Contests;