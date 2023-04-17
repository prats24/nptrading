import React, {memo} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
import Prize from '../../../assets/images/prize.png'


function PrizeDistribution({contest}){


return (
        <Grid item xs={12} md={6} lg={3} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={4} color="light" display="flex" justifyContent="center">
                        Prize Distribution
                    </MDTypography>

                    <MDBox display="flex" justifyContent="center" >
                        <img src={Prize} width={60} height={60} style={{borderRadius:"50%"}}/> 
                    </MDBox>

                    <Grid container  mt={2} style={{border:'1px solid white',borderRadius:6}}>

                        <Grid item xs={12} md={6} lg={5} mt={1} mb={1}display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rank</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} mt={1} mb={1}display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Prize Amount</MDTypography>
                        </Grid>

                        {contest?.rewards.length === 0 ?
                               
                                  <>
                                    <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                                        <Divider style={{backgroundColor: 'white'}} />
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center" alignItems="center">
                                        <MDTypography color="light" fontSize={15}>Rank Details not updated yet!</MDTypography>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                                        <Divider style={{backgroundColor: 'white'}} />
                                    </Grid>
                                </>
                                
                                :
                                contest?.rewards?.map((e)=>{
                                    return(
                                        <>

                                            <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                                                <MDTypography color="light" fontSize={15}>{e?.rankStart == e?.rankEnd ? e?.rankStart : `${e?.rankStart}-${e?.rankEnd}`}</MDTypography>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                                                <MDTypography color="light" fontSize={15}>{`${e?.currency} ${e?.reward}`}</MDTypography>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                                                <Divider style={{backgroundColor: 'white'}} />
                                            </Grid>
                                        </>
                                    )
                                })
                            }
                            
                    </Grid>

                </MDBox>
            </Grid>
);
}

export default memo(PrizeDistribution);