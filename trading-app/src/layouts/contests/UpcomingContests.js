import React, {useState} from 'react'
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";


// Material Dashboard 2 React example components
import MDButton from "../../components/MDButton";
import { CircularProgress, Icon } from "@mui/material";


// Data
import ContestCard from './ContestCard'
import CreateContest from './CreateContest'


const UpcomingContests = () => {
  
    const [isLoading,setIsLoading] = useState(false);
    const [createContestForm,setCreateContestForm] = useState(false);
    const [isObjectNew,setIsObjectNew] =useState(false);

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
                    {(!createContestForm && !isObjectNew) && 
                    <MDButton 
                      variant="contained" 
                      size="small" 
                      color="success" 
                      sx={{marginLeft:1.5}}
                      onClick={()=>{setCreateContestForm(true);setIsObjectNew(true)}}
                      >
                      Create Contest
                    </MDButton>
                    }
                  </MDBox>
                
                
                {!createContestForm ?
                  <Grid container spacing={2} mt={-4}>
                    
                    <ContestCard createContestForm={createContestForm} setCreateContestForm={setCreateContestForm} isObjectNew={isObjectNew} setIsObjectNew={setIsObjectNew}/>

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