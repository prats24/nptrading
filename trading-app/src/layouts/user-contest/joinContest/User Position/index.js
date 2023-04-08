import React, { useEffect, useState, useRef,useContext, useMemo, useReducer, useCallback } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import InstrumentDetails from "./components/InstrumentDetails";
import OverallGrid from "./OverallP&L/OverallGrid";
// import MarginGrid from "./MarginDetails/MarginGrid";
// import TradableInstrument from "./components/TradableInstrument/TradableInstrument";
import StockIndex from "./components/StockIndex/StockIndex";
import { userContext } from "../../../../AuthContext";
import RankTable from "./RankTable";




function UserPosition() {

  console.log("user position rendering")
  const [reRender, setReRender] = useState(true);
  const getDetails = useContext(userContext);
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }


  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("hi", true)
      socket.emit('userId', getDetails.userDetails._id)
    })
  }, []);

  const memoizedStockIndex = useMemo(() => {
    return <StockIndex socket={socket} />;
  }, [socket]);

  const handleSetIsGetStartedClicked = useCallback((value) => {
    setIsGetStartedClicked(value);
  }, []);

  const memoizedSetReRender = useCallback((value) => {
    setReRender(value);
  }, []);

  // const memoizedTradableInstrument = useMemo(() => {
  //   return <TradableInstrument
  //     socket={socket}
  //     reRender={reRender}
  //     setReRender={memoizedSetReRender}
  //     isGetStartedClicked={isGetStartedClicked}
  //     setIsGetStartedClicked={handleSetIsGetStartedClicked}
  //   />;
  // }, [socket, reRender, isGetStartedClicked, handleSetIsGetStartedClicked]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <InstrumentDetails
      socket={socket}
      reRender={reRender}
      setReRender={memoizedSetReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
    />;
  }, [socket, reRender, handleSetIsGetStartedClicked]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallGrid
      socket={socket}
      reRender={reRender}
      setReRender={memoizedSetReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
    />;
  }, [socket, reRender, handleSetIsGetStartedClicked]);

  // 

  return (
    <MDTypography  display='flex' justifyContent='space-between' gap="5px" >
      <MDTypography py={0} flex="70%">

        {memoizedStockIndex}

        <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedInstrumentDetails}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedOverallPnl}
            </Grid>
          </Grid>
        </MDBox>

      </MDTypography>
      <MDTypography flex="30%">
          
          <RankTable/>
      </MDTypography>
    </MDTypography>

  );
}

export default UserPosition;

// 
// width="100%"



