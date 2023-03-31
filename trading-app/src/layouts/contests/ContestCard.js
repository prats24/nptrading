import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";
import ContestDetailsForm from './CreateContest'


const ContestCard = () => {
  const [contestData,setContestData] = useState([]);
  const [contestDetailsForm,setContestDetailsForm] = useState(false)
  const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/contest`)
      .then((res)=>{
                setContestData(res.data.data);
                console.log(res.data.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[])


      console.log("Contest Data: ",contestData)

    return (
      <>
      {     
      !contestDetailsForm ?
      <>
                    {contestData?.map(e=>(
                    <Grid item xs={12} md={12} lg={4}>
                      <MDBox
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                              m: 1,
                              width: "100%",
                              height: 200,
                              borderRadius:4,
                            },
                          }}
                        >
                          <Paper 
                            elevation={3}
                            style={{
                              position: 'relative', 
                              backgroundColor: '#1c2127', 
                            }}
                          >
                            <MDBox>
                              <MDTypography padding={2} color="white">{e?.contestName}</MDTypography>
                              <MDButton padding={2} color="white" onClick={()=>{setObjectId(e._id);setContestDetailsForm(true)}}>View Details</MDButton>
                            </MDBox>
                            <MDBox style={{
                              backgroundImage: `url(${ContestIcon})`,
                              backgroundPosition: 'bottom right',
                              backgroundSize: '50px 50px',
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '50px',
                              height: '50px',
                              margin: '8px',
                            }}>
                            </MDBox>
                          </Paper>


                        </MDBox>
                    </Grid>
                    ))}
                    </>
                    :
                    <>
                    <ContestDetailsForm oldObjectId={objectId} setOldObjectId={setObjectId}/>
                    </>
                    }
                    </>
)}



export default ContestCard;