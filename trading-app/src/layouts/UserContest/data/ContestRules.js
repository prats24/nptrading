import React from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import Rule from '../../../assets/images/rule.png'
import { Divider } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


function ContestRules({contest}){

console.log(contest?.contestRule?.contestRules)
return (

<Grid item xs={12} md={6} lg={3.5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={4} color="light" display="flex" justifyContent="center">
                        Contest Rules
                    </MDTypography>

                    <MDBox display="flex" justifyContent="center" >
                        <img src={Rule} width={60} height={60} style={{borderRadius:"50%"}}/> 
                    </MDBox>

                    <Grid container  mt={2} style={{border:'1px solid white',borderRadius:6}}>
                    
                    
                    {contest?.contestRule?.contestRules?.map((e)=>{
                        console.log("Contest Rules",e)
                        return(<>
                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="left" alignItems="center">
                           <MDTypography color="light" fontSize={15}>{e?.rule}</MDTypography>
                        </Grid>

                    </>)
                    })
                    }
                    </Grid>

                </MDBox>
            </Grid>
);
}

export default ContestRules;