import React,{useState} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
import { HiUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation } from 'react-router-dom';
import axios from "axios";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InstrumentsData from '../data/Instruments'
import MYPNLData from '../data/MyPNLData'
import TradersRanking from '../data/TradersRanking'

function ContestRegistration () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Location: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
    React.useEffect(()=>{
      
        axios.get(`${baseUrl}api/v1/contest/${id}`)
        .then((res)=>{
                setContest(res?.data?.data);
                console.log(res?.data?.data)
        }).catch((err)=>{
            return new Error(err);
        })

    },[])

    console.log("Contest Registration Data: ",contest)
    console.log(`/arena/${contest?.contestName}/${contest?._id}`)
  
    return (
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

        <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700}}>
                        {contest?.contestName}
                    </MDTypography>
                    
                    <InstrumentsData/>

                    <MYPNLData />

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            {/* Ranking View */}
            <TradersRanking />



        </Grid>
    </MDBox>
  )

}
export default ContestRegistration;