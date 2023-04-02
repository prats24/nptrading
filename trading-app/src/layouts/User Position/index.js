import React, { useEffect, useState, useRef,useContext, useMemo, useReducer, useCallback } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import InstrumentDetails from "./components/InstrumentDetails";
import OverallGrid from "./OverallP&L/OverallGrid";
import MarginGrid from "./MarginDetails/MarginGrid";
import TradableInstrument from "./components/TradableInstrument/TradableInstrument";
import StockIndex from "./components/StockIndex/StockIndex";
import { userContext } from "../../AuthContext";




function UserPosition() {

  console.log("user position rendering")
  const [reRender, setReRender] = useState(true);
  const [text,setText] = useState('');
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

  const [timeoutId, setTimeoutId] = useState(null);



  function sendSearchReq(e) {
    // let newData += data
    // clear previous timeout if there is one
    const value = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        // sendRequest(value);
      }, 400)
    );
  }

  // let textRef = useRef(null);

  let writeText ;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0}>

        <StockIndex socket={socket}/>

        {/* <MemoizedTradableInstrument /> */}
        <TradableInstrument socket={socket} reRender={reRender} setReRender={setReRender} isGetStartedClicked={isGetStartedClicked} setIsGetStartedClicked={setIsGetStartedClicked}/>


        <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <InstrumentDetails socket={socket} Render={{ reRender, setReRender }} setIsGetStartedClicked={setIsGetStartedClicked} />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
             <OverallGrid socket={socket} Render={{ reRender, setReRender }} setIsGetStartedClicked={setIsGetStartedClicked}/>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MarginGrid/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;





