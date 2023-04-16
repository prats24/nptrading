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
import TradersRanking from '../data/TradersRanking'
import DummyInstrument from "../data/dummy/dummyInstrument"
import DummyPnl from "../data/dummy/dummyPnl"
import DummyRank from "./DemoTradersRanking";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Timer from '../timer';
import MDButton from '../../../components/MDButton';


function ContestTradeView () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    // const  contestName  = location?.state?.data; isDummy
    const  portfolioId  = location?.state?.portfolioId;
    // const  isDummy  = location?.state?.isDummy;
    const  isDummy  = false;

    const [render, setReRender] = useState(true);
    let style = {
      textAlign: "center", 
      fontSize: ".75rem", 
      color: "#003366", 
      backgroundColor: "#CCCCCC", 
      borderRadius: "5px", 
      padding: "5px",  
      fontWeight: "600",
      display: "flex", 
      alignItems: "center"
    }

    console.log("Location in tradePage: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

    let socket;
    try {
      socket = io.connect(`${baseUrl1}`)
    } catch (err) {
      throw new Error(err);
    }
  
  // console.log("in event running", socket.id, contestId)
    useEffect(() => {

      console.log("in event 1")
      socket.on("connect", () => {
        console.log("in event 2")
        // socket.emit('userId', contestId)

        // socket.emit('contest', contestId)
        // socket.emit("hi", true)
      })
    }, []);


    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])

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
                  {/* <MDBox style={{display: 'flex', alignItems: 'center'}} > */}
                    {/* <span style={{color:'white'}}>Back</span> */}
                    <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                        {contest?.contestName}
                    </MDTypography>
                  {/* </MDBox> */}

                    {isDummy &&
                      <Grid item mb={1} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>Contest is Starts in:</span> <div style={style} ><AvTimerIcon/><Timer targetDate={contest?.contestStartDate} text="Contest Started" /></div>
                      </Grid>
                    }
                    
                    {!isDummy ?
                    <>
                    <InstrumentsData contestId={contestId} socket={socket} portfolioId={portfolioId} Render={{render, setReRender}}/>
                    <MYPNLData contestId={contestId} socket={socket} portfolioId={portfolioId} Render={{render, setReRender}}/>
                    </>
                    :
                    <>
                    <DummyInstrument />
                    <DummyPnl />
                    </>
                    }

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>
            {isDummy ?
            <DummyRank />
            :
            <TradersRanking contestId={contestId} socket={socket}/>
            }


        </Grid>
    </MDBox>
  )

}
export default ContestTradeView;