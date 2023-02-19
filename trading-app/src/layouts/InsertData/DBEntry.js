//import React from 'react'
import {useState, useContext, useEffect} from "react"
import TextField from '@mui/material/TextField';
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";

import MDTypography from "../../components/MDTypography";
import { Typography } from "@mui/material";
import { userContext } from "../../AuthContext";
import uniqid from "uniqid"


const DBEntry = () => {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    const [enterDate, setDate] = useState(valueInDate);
    const [instrument, setInstrument] = useState();
    const [algoData, setAlgoData] = useState([]);
    const getDetails = useContext(userContext);
    const userId = getDetails.userDetails.email;
    const createdBy = getDetails.userDetails.name;
    const uId = uniqid();
    useEffect(()=>{

      axios.get(`${baseUrl}api/v1/readTradingAlgo`)
      .then((res)=>{
          let defaultAlgo = (res.data).filter((elem)=>{
            return elem.isDefault;
          })
          setAlgoData(defaultAlgo);
      }).catch((err)=>{
          return new Error(err);
      })

    },[])

    async function saveData(){
      const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault } = algoData[0];
      console.log(algoData, instrument, enterDate)
      const res = await fetch(`${baseUrl}api/v1/enterDataInDB`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              
              algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
              productChange, tradingAccount, _id, marginDeduction, isDefault, instrument, enterDate,
              userId, createdBy, uId

          })
      });
      const dataResp = await res.json();
      //console.log("dataResp", dataResp)
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          //console.log(dataResp.error)
          window.alert(dataResp.error);
          ////console.log("Failed to Trade");
      } else {
          window.alert(dataResp.message); 
      }

    }
    
    return (
        <>
        <MDBox mt={2} mb={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} >
            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Select Trade Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{setDate(e.target.value)}} value={enterDate}/>
              <TextField
                id="outlined-basic" variant="standard"  placeholder="Instrument"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{setInstrument(e.target.value)}}/>
              <MDButton onClick={saveData}>
                OK
              </MDButton>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={12} xl={12} >
            <Card sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', marginTop: 1 }}>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={gpnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{FDPNLData[0] ? (-FDPNLData[0].amount >= 0 ? "+₹" + (-FDPNLData[0].amount).toFixed(0) : "-₹" + (FDPNLData[0].amount).toFixed(0)) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Brokerage</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>₹{FDPNLData[0] ? (FDPNLData[0].brokerage).toFixed(0) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Net P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" color={npnlcolor} py={1}>{FDPNLData[0] ? (((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)) >= 0 ? "+₹" + ((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)).toFixed(0) : "-₹" + -((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)).toFixed(0)) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Total Trades</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{FDPNLData[0] ? FDPNLData[0].trades : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Max Gross P&L</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={maxPnlValuecolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{maxPnlValue >= 0 ? "+₹" + maxPnlValue.toFixed(0) : "-₹" + (-maxPnlValue).toFixed(0)}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Min Gross P&L</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={minPnlValuecolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{minPnlValue >= 0 ? "+₹" + minPnlValue.toFixed(0) : "-₹" + (-minPnlValue).toFixed(0)}</MDTypography>
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>

            {/* <MDBox mb={1} pt={1}> 
                <ReportsLineChart
                  color="warning"
                  colorheight="25rem"
                  title="Gross P&L - 1 Minute Timeframe (Mock)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: graphy,
                      datasets: { label: "Gross P&L", data: graphx },
                    }
                  }
                />
              </MDBox> */}

            {/* <MDBox pt={5} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={2.5}>
                                   P&L Data - 1 Minute Timeframe (Mock)
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox> */}
        </>
    )
}

export default DBEntry