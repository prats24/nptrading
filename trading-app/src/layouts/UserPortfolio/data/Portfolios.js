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
import {useNavigate} from 'react-router-dom';




const MyPortfolioCard = () => {
  
  const [myPortfolio,setMyPortfolio] = useState([]);
  const [portfolioPnl, setPortfolioPnl] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  useEffect(()=>{
  
    // axios.get(`${baseUrl}api/v1/portfolio/my`,{
    //   withCredentials: true,
    //   headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Credentials": true
    //   },
    // })
    // .then((res)=>{
    //     setMyPortfolio(res.data.data);
    //     console.log(res.data.data)
    //   }).catch((err)=>{
    //     return new Error(err);
    // })


    let call1 = axios.get(`${baseUrl}api/v1/portfolio/my`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    let call2 = axios.get(`${baseUrl}api/v1/portfolio/pnl`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      console.log(api2Response.data);
      setMyPortfolio(api1Response.data.data)
      setPortfolioPnl(api2Response.data)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])


  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
    color: "",
    icon: ""
  })
  const openSuccessSB = (title,content, message) => {
    msgDetail.title = title;
    msgDetail.content = content;
    // msgDetail.successSB = true;
    if(message == "SUCCESS"){
      msgDetail.color = 'success';
      msgDetail.icon = 'check'
    } else {
      msgDetail.color = 'error';
      msgDetail.icon = 'warning'
    }
    console.log(msgDetail)
    setMsgDetail(msgDetail)
    // setTitle(title)
    // setContent(content)
    setSuccessSB(true);
  }

  const closeSuccessSB = () =>{
    // msgDetail.successSB = false
    setSuccessSB(false);

  }

  // const closeSuccessSB = () => msgDetail.successSB = false;


  const renderSuccessSB = (
  <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );
      
  console.log(renderSuccessSB) 
    
    return (
      <>
      {myPortfolio.length > 0 ?
          <MDBox bgColor="light" minWidth="100%" minHeight='auto'>
            <Grid container spacing={2}>
              {myPortfolio?.map((e)=>{
                  let portfolio = portfolioPnl.filter((elem)=>{
                    return e?._id === elem?._id?.portfolioId
                  })

                  let netPnl = portfolio[0]?.amount - portfolio[0]?.brokerage;
                // let color = (myPortfolio === e._id) ? "warning" : "light";
              return (
                
                <Grid key={e._id} item xs={12} md={6} lg={6} >
                <MDBox bgColor='light' padding={0} style={{borderRadius:4, ml: "1000px"}}>
                <MDButton variant="contained" color={"dark"} size="small" 
                  sx={{width: "80%"}}
                >
                    <Grid container>
                        
                        <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                            <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e?.portfolioName}</MDTypography>
                        </Grid>
                        
                        <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                            <MDTypography fontSize={15} style={{color:"white"}}>Portfolio Value: <span>₹{(e?.portfolioValue).toLocaleString()}</span> </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                            <MDTypography fontSize={15} style={{color:"white"}}>Current Value: <span>₹{netPnl ? (e?.portfolioValue + netPnl).toFixed(0): e?.portfolioValue.toFixed(0)}</span> </MDTypography>
                        </Grid>

                        {/* <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                            <MDTypography fontSize={15} style={{color:"white",fontWeight:800}}>₹{(e?.portfolioValue).toLocaleString()}</MDTypography>
                        </Grid> */}

                        <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{color:"white"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{color:"white"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>
                </MDBox>
                </Grid>
                
              )
              })}
            </Grid>
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">You do not have any portfolio to join the contest</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default MyPortfolioCard;