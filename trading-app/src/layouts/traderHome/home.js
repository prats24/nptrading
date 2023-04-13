import React from 'react'
import MDBox from '../../components/MDBox'
import { Grid } from '@mui/material'
import MDTypography from '../../components/MDTypography'

//data
import IndicesComponent from './components/IndicesComponent'
import CarouselComponent from './components/CarouselComponent.js'

function Home(){


    return(
        <>
        <MDBox>
            <Grid container spacing={2}>
                
                <IndicesComponent/>

            </Grid>

            <Grid container spacing={2} mt={1} xs={12} md={6} lg={12}>
                
                <Grid item xs={12} md={6} lg={9} sx={{minWidth:"100%"}}>
                    <CarouselComponent/>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    
                </Grid>
                
            </Grid>
        </MDBox>
        </>
    )
}

export default Home;