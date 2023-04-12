import React,{useState, useEffect} from 'react'
import { io } from "socket.io-client";
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
// import MDButton from '../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation } from 'react-router-dom';
import axios from "axios";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Portfolios from '../data/Portfolios'
import MYPNLData from '../data/PnL/MyPNLData'
import InstrumentsData from '../data/Instruments/Instruments'
import DemoTradersRanking from '../data/DemoTradersRanking'

function ContestTradeView () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    // const  contestName  = location?.state?.data;
    const  portfolioId  = location?.state?.portfolioId;

    console.log("Location: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

    let socket;
    try {
      socket = io.connect(`${baseUrl1}`)
    } catch (err) {
      throw new Error(err);
    }
  
  console.log("in event running", socket.id, socket)
    useEffect(() => {
      console.log("in event 1")
      socket.on("connect", () => {
        console.log("in event 2")
        socket.emit("hi", true)
        // socket.emit('contest', contestId)
      })
    }, []);
    React.useEffect(()=>{
      
        axios.get(`${baseUrl}api/v1/contest/${contestId}`)
        .then((res)=>{
                setContest(res?.data?.data);
                console.log(res?.data?.data)
        }).catch((err)=>{
            return new Error(err);
        })

    },[])

    // console.log("Contest Registration Data: ",id)
    // console.log(`/arena/${contest?.contestName}/${contest?._id}`)
  
    return (
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

        <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700}}>
                        {contest?.contestName}
                    </MDTypography>
                    
                    <InstrumentsData contestId={contestId} socket={socket} portfolioId={portfolioId} />

                    <MYPNLData contestId={contestId} socket={socket} portfolioId={portfolioId} />
                    {/* <Portfolios contestId={id}/> */}

                    

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            Ranking View
            
            {/* <DemoTradersRanking /> */}
            



        </Grid>
    </MDBox>
  )

}
export default ContestTradeView;