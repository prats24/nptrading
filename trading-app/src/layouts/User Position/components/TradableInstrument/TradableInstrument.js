import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDButton";

import Card from "@mui/material/Card";
import MDTypography from "../../../../components/MDButton";
import DataTable from "../../../../examples/Tables/DataTable";
// import MDButton from "../";
import MDButton from "../../../../components/MDButton";
import MDSnackbar from "../../../../components/MDSnackbar";
import { userContext } from "../../../../AuthContext";


import SearchTableData from "./data/data";


function TradableInstrument({instrumentsData, reRender, setReRender, uId}) {

  const getDetails = useContext(userContext);

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  let [addOrRemoveCheck, setAddOrRemoveCheck]  = useState();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [userInstrumentData, setUserInstrumentData] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getInstrument/${getDetails.userDetails._id}`)
    .then((res) => {
        //console.log("live price data", res)
        setUserInstrumentData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender])


  async function subscribeInstrument(instrumentData, addOrRemove){
    const {instrument_token, tradingsymbol, name, strike, lot_size, instrument_type, exchange, expiry} = instrumentData

    if(addOrRemove === "Add"){
      setAddOrRemoveCheck(true);
      console.log(instrumentData)
      const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          instrument: `${strike} ${instrument_type}`, exchange, status: "Active", symbol: tradingsymbol, lotSize: lot_size, instrumentToken: instrument_token, uId, contractDate: expiry, maxLot: 1800
        })
      });
    
      const data = await res.json();
      //console.log(data);
      if(data.status === 422 || data.error || !data){
          window.alert(data.error);
          // setInvalidDetail(`Email or Password is incorrect`);
      }else{
  
        // this function is extracting data of user who is logged in
        // await userDetail();
        openSuccessSB();
        console.log(data.message)
        
        
      }
      // const id = instrument_token;
      // const currentButtonState = buttonStates[id];
      // setButtonStates({
      //   ...buttonStates,
      //   [id]: !currentButtonState,
      // });
      
    } else{
      setAddOrRemoveCheck(false);
      const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrument_token}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
          isAddedWatchlist: false
        })
      });
  
      const permissionData = await response.json();
      console.log("remove", permissionData)
      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
          //console.log("Failed to Edit");
      }else {
        // window.alert(permissionData.massage);
          //console.log(permissionData);
          // window.alert("Edit succesfull");
          //console.log("Edit succesfull");
          openSuccessSB();
      }
      
    }

    reRender ? setReRender(false) : setReRender(true);
  }

  // let title = "App " + appstatus
  // let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = addOrRemoveCheck ? "Added" : "Removed"
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      // title={title}
      content={content}
      // dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

 

  return (
        <MDBox>
        { instrumentsData?.length > 0 &&
          (instrumentsData.map((elem)=>{
            let perticularInstrumentData = userInstrumentData.filter((subElem)=>{
              return subElem.instrumentToken === elem.instrument_token
            })
            const id = elem.instrument_token;
            const date = new Date(elem.expiry);
            const day = date.getDate();
            const options = { month: 'short' };
            const month = new Intl.DateTimeFormat('en-US', options).format(date);
            const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}`;

            function getOrdinalSuffix(day) {
              const suffixes = ['th', 'st', 'nd', 'rd'];
              const v = day % 100;
              return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
            } //justifyContent = "space-around" border= "1px solid grey"
            // const isAdded = buttonStates[id] || false;
            return(
              <>
                <Grid container lg={12} key={elem._id}
                sx={{
                  fontSize:13,
                  display:"flex",
                  gap:"10px",
                  alignItems:"center",
                  flexDirection:"row",
                  justifyContent:"space-between",
                  border:"0.25px solid white",
                  borderRadius:2,
                  color:"white",
                  padding:"0.5px",
                  '&:hover': {
                    backgroundColor: 'lightgray',
                    cursor: 'pointer',
                    fontWeight: 600
                  }
                }}
                >
                  <Grid sx={{color:"white", textAlign:"center", display: { xs: 'none', lg: 'block' }}} xs={0} lg={2.2}>{elem.name}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{formattedDate}</Grid>
                  <Grid xs={5} lg={2.2}>{elem.tradingsymbol}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{elem.exchange}</Grid>
                  <Grid xs={5} lg={2} mr={4} display="flex" justifyContent="space-between">
                    <Grid><MDButton size="small" color="info" ml={1} onClick={()=>{subscribeInstrument(elem)}}>
                      B
                      {/* <BuyModel Render={{ reRender, setReRender }} symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/> */}
                    </MDButton></Grid>
                    <Grid><MDButton size="small" color="error" ml={1} onClick={()=>{subscribeInstrument(elem)}}>
                      S
                      {/* <SellModel Render={{ reRender, setReRender }} symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/> */}
                    </MDButton></Grid>
                    {/* <Grid><MDButton size="small" color="warning" ml={1} onClick={()=>{subscribeInstrument(elem)}}>+</MDButton></Grid>  */}
                    {perticularInstrumentData.length ?
                    <Grid lg={2.2}><MDButton size="small" color="secondary" ml={1} onClick={()=>{subscribeInstrument(elem, "Remove")}}>-</MDButton></Grid>//{isAdded ? "Remove" : "Add"}
                    :
                    <Grid lg={2.2}><MDButton size="small" color="warning" ml={1} onClick={()=>{subscribeInstrument(elem, "Add")}}>+</MDButton></Grid>
                    }
                  </Grid>


                  
                </Grid>
                {renderSuccessSB}
              </>
            )
          }))
        }
        </MDBox>
)
}

export default TradableInstrument;
