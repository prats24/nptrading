import React from 'react'
import MDBox from '../../../components/MDBox'
import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography'

function Indicies(){

return(
    <>
            <Grid item xs={12} md={6} lg={3}>
                    <MDBox bgColor="dark" borderRadius={6} p={2}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={18} color="light">₹17,800.40</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="success">+90.10(+0.51%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="light">NIFTY 50</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <MDBox bgColor="dark" borderRadius={6} p={2}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={18} color="light">₹41,400.40</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="success">+240.10(+0.51%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="light">BANK NIFTY</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <MDBox bgColor="dark" borderRadius={6} p={2}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={18} color="light">₹1,340.00</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="success">+190.10(+0.51%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="light">GROSS P&L</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <MDBox bgColor="dark" borderRadius={6} p={2}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={18} color="light">₹1,280.00</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="success">+190.10(+0.51%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography fontSize={12} color="light">NET P&L</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>
                </>
)}

export default Indicies;