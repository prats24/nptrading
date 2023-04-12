import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { HiUserGroup } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MDSnackbar from "../../../components/MDSnackbar";




const ContestPortfolioCard = ({contestId, endDate}) => {
  
  const [contestPortfolioData,setContestPortfolioData] = useState([]);
  const [objectId,setObjectId] = useState(contestId);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  console.log("contestId", contestId, objectId)

  let nextPagePath = 'notstarted';
  if((new Date()) < new Date(endDate)){
    nextPagePath = 'notstarted'
  } else{
    console.log(new Date(), new Date(endDate))
    nextPagePath = 'trade'
  }

  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/portfolio/user`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
              setContestPortfolioData(res.data.data);
              console.log(res.data.data)
      }).catch((err)=>{
        return new Error(err);
    })
  },[])

  async function joinContest(){
    console.log("in join")
    if(!selectedPortfolio){
      console.log("in join if")
      openSuccessSB("Failed","Please select a portfolio")
      return;
    }
    // console.log("in joinContest func", contestId, selectedPortfolio)
    const res = await fetch(`${baseUrl}api/v1/contest/${contestId}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio
        })
    });
    
    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){
        // window.alert(data.error);
        console.log("invalid entry");
    }else{
        // setNextPage(false)
        // window.alert("entry succesfull");
        console.log("entry succesfull");
    }

  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);


  const renderSuccessSB = (
  <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );
      
  console.log(contestPortfolioData) 
    
    return (
      <>
      {contestPortfolioData.length > 0 ?
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          {contestPortfolioData?.map((e)=>{

            let color = (selectedPortfolio === e._id) ? "warning" : "light";
          return (
            
            <Grid key={e._id} item xs={12} md={6} lg={6} >
            <MDBox bgColor='light' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color={color} size="small" 
              // component={Link} 

              onClick={()=>{setSelectedPortfolio(e._id)}}
              
            >
                <Grid container spacing={0}>
                    
                    <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e?.portfolioName}</MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black"}}>Portfolio Value</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",fontWeight:800}}>₹{(e?.portfolioValue).toLocaleString()}</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                    </Grid>

                </Grid>
            </MDButton>
            </MDBox>
            </Grid>
            
          )
          })}
          <Grid container >
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">Select Your Portfolio and click on join!</MDTypography>
          </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light"
                  component={selectedPortfolio && Link} 
                  to={ selectedPortfolio && {
                      pathname: `/arena/contest/${nextPagePath}`,
                    }}
                    state= { selectedPortfolio && {contestId: contestId, portfolioId: selectedPortfolio}}
                  
                    onClick={()=>{joinContest()}}
                >
                    Join
                </MDButton>
            </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light" 
                  component={Link} 
                  to={{
                      pathname: `/arena`,
                    }}
                >
                    Back
                </MDButton>
                {renderSuccessSB}
            </Grid>
          </Grid>
        </Grid>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">You do not have any portfolio to join the contest</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default ContestPortfolioCard;