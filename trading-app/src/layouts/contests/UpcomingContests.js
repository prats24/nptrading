import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";
import MDButton from "../../components/MDButton";
import axios from "axios";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { CircularProgress, Icon } from "@mui/material";
import { bgcolor, padding } from '@mui/system';

// Data
import ContestCard from './ContestCard'
import CreateContest from './CreateContest'


const UpcomingContests = () => {
    const [reRender, setReRender] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const [createContestForm,setCreateContestForm] = useState(false);

   
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const contests = [
      {contestName: 'Friday Fun', minParticipants: 100, maxParticipants: 1000},
      {contestName: 'D Day', minParticipants: 100, maxParticipants: 1000},
      {contestName: 'New Era', minParticipants: 100, maxParticipants: 1000},
    ]

      console.log(contests)
    return (
      <>
      {isLoading ?    
                <>
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                <CircularProgress color="info" />
                </MDBox>
                </>
      :
                <>
                <MDBox pt={0} pb={1}>
                  <MDBox>
                    {!createContestForm && 
                    <MDButton 
                      variant="contained" 
                      size="small" 
                      color="success" 
                      sx={{marginLeft:1.5}}
                      onClick={()=>{setCreateContestForm(true)}}
                      >
                      Create Contest
                    </MDButton>
                    }
                  </MDBox>
                
                {!createContestForm ?
                  <Grid container spacing={2}>
                    
                    <ContestCard/>

                  </Grid>
                  :
                  
                  <CreateContest/>
                }
                </MDBox> 
                </>
      }
    </>
     )
}


export default UpcomingContests;