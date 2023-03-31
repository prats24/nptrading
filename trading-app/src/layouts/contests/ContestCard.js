import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";


const ContestCard = () => {
   
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const contests = [
      {contestName: 'Friday Fun', minParticipants: 100, maxParticipants: 1000},
      {contestName: 'D Day', minParticipants: 100, maxParticipants: 1000},
      {contestName: 'New Era', minParticipants: 100, maxParticipants: 1000},
    ]

      console.log(contests)

    return (
      <>     
                    {contests?.map(e=>(
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
                              <MDTypography padding={2} color="white">{e.contestName}</MDTypography>
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
)}



export default ContestCard;