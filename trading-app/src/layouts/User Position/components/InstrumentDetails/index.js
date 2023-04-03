import {useContext, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RiStockFill } from "react-icons/ri";
import { TiMediaRecord } from "react-icons/ti";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Tooltip } from '@mui/material';


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import MDSnackbar from "../../../../components/MDSnackbar";

import { useEffect } from "react";
import axios from "axios";
import BuyModel from "./data/BuyModel";
import SellModel from "./data/SellModel";
import { Typography } from "@mui/material";
import InstrumentComponent from "./InstrumentComponent";
import { marketDataContext } from "../../../../MarketDataContext";





function InstrumentDetails({socket, Render, setIsGetStartedClicked}) {
  const marketDetails = useContext(marketDataContext)
  console.log("socket print", socket)

  let styleTD = {
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "900",
    color: "#7b809a",
    opacity: 0.7
  }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { reRender, setReRender } = Render;
  const [menu, setMenu] = useState(null);
  const [isAppLive, setisAppLive] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(()=>{

    // console.log("in socket useeffect")
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
      marketDetails.setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })
    socket.on('check', (data)=>{
      console.log("data from socket check", data)
    })

    // socket.on("tick", (data) => {
    socket.on("tick-room", (data) => {

      console.log('data from socket in instrument in parent', data);
      // console.log("marketdata", data)
      marketDetails.setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });

    })



  }, [])

  console.log("rendering in userPosition: instruemntGrid")


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`)
      .then((res) => {
        setisAppLive(res.data[0].isAppLive);
      });
  }, [reRender]);

  useEffect(() => {    
    return () => {
      socket.close();
    }
  }, []);

  const [instrumentData, setInstrumentData] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/instrumentDetails`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res) => {
        setInstrumentData(res.data)
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender, socket])



  // const instrumentDetailArr = useMemo(() => {
    const instrumentDetailArr = [];
    instrumentData.map((elem)=>{
      let instrumentDetailObj = {}
      const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
      let perticularInstrumentMarketData = marketDetails.marketData.filter((subelem)=>{
        return elem.instrumentToken === subelem.instrument_token
      })

      const percentagechangecolor = perticularInstrumentMarketData[0]?.change >= 0 ? "success" : "error"
      const percentagechangecolor1 = (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "success" : "error"


      instrumentDetailObj.instrument = (
        <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.instrument}
        </MDTypography>
      );
      instrumentDetailObj.symbol = (
        <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.symbol}
        </MDTypography>
      );
      instrumentDetailObj.quantity = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {elem.Quantity}
        </MDTypography>
      );
      instrumentDetailObj.contractDate = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {elem.contractDate}
        </MDTypography>
      );

      instrumentDetailObj.last_price = (
        <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
          {"₹"+(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}
        </MDTypography>
      );
      if(perticularInstrumentMarketData[0]?.change !== undefined){
        instrumentDetailObj.change = (
          <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
            {perticularInstrumentMarketData[0]?.change >= 0 ? "+" + ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%" : ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%"}
          </MDTypography>
        );
      } else{
        instrumentDetailObj.change = (
          <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
            {(((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "+" + (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%" : (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%"}
          </MDTypography>
        );
      }

      instrumentDetailObj.buy = (
        <BuyModel reRender={reRender} setReRender={setReRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}/> 
      );
      
      instrumentDetailObj.sell = (
        <SellModel reRender={reRender} setReRender={setReRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}/>
      );

      instrumentDetailObj.remove = (
        <MDButton size="small" color="secondary" onClick={()=>{removeInstrument(elem.instrumentToken)}}>
          <RemoveCircleOutlineIcon  />
        </MDButton>
      );

      instrumentDetailObj.instrumentToken = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.instrumentToken}
        </MDTypography>
      );
      instrumentDetailObj.chart = (
        <MDTypography component="a" href="https://in.investing.com/indices/s-p-cnx-nifty-chart" target="_blank" variant="caption" color="text" fontWeight="medium">
          <TrendingUpIcon fontSize="medium"/>
        </MDTypography>
      );

      instrumentDetailArr.push(instrumentDetailObj)
    })

  //   console.log("arr in memo")
  //   return arr;
  // }, [reRender, socket, marketDetails.marketData]);


  async function removeInstrument(instrumentToken){
    console.log("in remove")
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
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
        let instrumentTokenArr = [];
        instrumentTokenArr.push(instrumentToken)
        socket.emit("unSubscribeToken", instrumentTokenArr);
        openSuccessSB();
    }
    reRender ? setReRender(false) : setReRender(true);
  }


  let content = "Instrument Removed"
  const renderSuccessSB = (
    <MDSnackbar
      color="error"
      icon="check"
      // title={title}
      content={content}
      // dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: '10px solid red', borderRadius: "15px" }}
    />
  );


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pl={2} pr={2} pt={2} pb={2}>
        <MDBox display="flex">
          <MDTypography variant="h6" gutterBottom>
            Market Watchlist
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={0}>
            <MDTypography 
            p={0}
            fontWeight="bold" 
            variant="button" 
            color={isAppLive ? "success" : "error"}
            style={{display:"flex",alignItems:"center"}}
            >
              <TiMediaRecord sx={{margin:10}}/> {isAppLive ? "System Live" : "System Offline"}
            </MDTypography>
        </MDBox>
      </MDBox>
      {instrumentDetailArr?.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <RiStockFill style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15} color="grey">Use the search bar to add instruments.</Typography>
        <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Add Instrument</MDButton>
      </MDBox>)
      :
      (<MDBox>
        <TableContainer component={Paper}>
          <table style={{borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                <td style={styleTD}>CONTRACT DATE</td>
                <td style={styleTD} >SYMBOL</td>
                <td style={styleTD} >INSTRUMENT</td>
                <td style={styleTD} >LTP</td>
                <td style={styleTD} >CHANGE(%)</td>
                {/* <td style={styleTD} >CHART</td> */}
                <td style={styleTD} >BUY</td>
                <td style={styleTD} >SELL</td>
                <td style={styleTD} >REMOVE</td>
              </tr>
            </thead>
            <tbody>

              {instrumentDetailArr.map((elem)=>{
                return(
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}} key={elem.instrumentToken.props.children}
              >
                  <InstrumentComponent 
                    contractDate={elem.contractDate.props.children}
                    symbol={elem.symbol.props.children}
                    instrument={elem.instrument.props.children}
                    last_price={elem.last_price.props.children}
                    change={elem.change.props.children}
                  />
                  {/* <td style={styleTD} >{elem.chart.props.children}</td> */}
                  <Tooltip title="Buy" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.buy}</td>
                  </Tooltip>
                  <Tooltip title="Sell" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.sell}</td>
                  </Tooltip>
                  <Tooltip title="Remove Instrument" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.remove}</td>
                  </Tooltip>
      
              </tr>

                )
              })}
            </tbody>
          </table>
        </TableContainer>

      </MDBox>
      )}
      {renderSuccessSB}
    </Card>
  );
}

export default InstrumentDetails;
















