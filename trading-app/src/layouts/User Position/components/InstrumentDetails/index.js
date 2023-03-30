import { useCallback, useContext, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiStockFill } from "react-icons/ri";
import { TiMediaRecord } from "react-icons/ti";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// import td from '@mui/material/td';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';



// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";
import MDSnackbar from "../../../../components/MDSnackbar";


// Data
// import data from "./data";
import { useEffect, useMemo } from "react";
import axios from "axios";
import BuyModel from "./data/BuyModel";
import SellModel from "./data/SellModel";
import { Typography } from "@mui/material";
import InstrumentComponent from "./InstrumentComponent";
import { marketDataContext } from "../../../../MarketDataContext";





function InstrumentDetails({socket, Render, handleClick, setMarketDataInPosition}) {
  // const marketDetails = useContext(marketDataContext)
  console.log("socket print", socket)

  let styleTD = {
    textAlign: "center",
    fontSize: "15px",
    fontColor: "grey"
  }

  // console.log("data from socket socket", socket)

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { reRender, setReRender } = Render;
  const [menu, setMenu] = useState(null);
  // const [marketDetails.marketData, setMarketData] = useState([]);
  const [isAppLive, setisAppLive] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  // const [instrumentTokenArr, setInstrumentTokenArr] = useState([]);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  // let instrumentTokenArr = [];

  useEffect(()=>{

    // console.log("in socket useeffect")
    // axios.get(`${baseUrl}api/v1/getliveprice`)
    // .then((res) => {
    //     setMarketData(res.data);
    // }).catch((err) => {
    //     return new Error(err);
    // })
    socket.on('check', (data)=>{
      console.log("data from socket check", data)
    })

    // socket.on("tick", (data) => {
      socket.on("tick-room", (data) => {

      console.log('data from socket in instrument in parent', data);
      // console.log("marketdata", data)
      // marketDetails.setMarketData(prevInstruments => {
      //   const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
      //   data.forEach(instrument => {
      //     instrumentMap.set(instrument.instrument_token, instrument);
      //   });
      //   return Array.from(instrumentMap.values());
      // });

      // setMarketDataInPosition(prevInstruments => {
      //   const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
      //   data.forEach(instrument => {
      //     instrumentMap.set(instrument.instrument_token, instrument);
      //   });
      //   return Array.from(instrumentMap.values());
      // });
    })

  }, [])

  console.log("rendering in userPosition: instruemntGrid")


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`)
      .then((res) => {
        setisAppLive(res.data[0].isAppLive);
      });
  }, [reRender]);

  // useEffect(() => {    
  //   return () => {
  //     socket.close();
  //   }
  // }, []);

  const [instrumentData, setInstrumentData] = useState([]);
  // // const [marketDetails.marketData, setMarketData] = useState([]);
  // // const [livedata, setLiveData] = useState([]);

  // // const Company = ({ image, name }) => (
  // //   <MDBox display="flex" alignItems="center" lineHeight={1}>
  // //     <MDAvatar src={image} name={name} size="sm" />
  // //     <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
  // //       {name}
  // //     </MDTypography>
  // //   </MDBox>
  // // );

  // console.log(reRender)

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

        console.log("inside of", res.data)
        let instrumentTokenArr = [];
        (res.data).map((elem)=>{
          instrumentTokenArr.push(elem.instrumentToken)
        })

        socket.emit("subscribeToken", instrumentTokenArr);
        setInstrumentData(res.data)
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender])



  const instrumentDetailArr = useMemo(() => {
    const arr = [];
    instrumentData.map((elem)=>{
      let instrumentDetailObj = {}

      // console.log("inside of instruemt memo", marketDetails.marketData)

      const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
      // const percentagechangecolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
      // let perticularInstrumentMarketData = marketDetails.marketData.filter((subelem)=>{
      //   return elem.instrumentToken === subelem.instrument_token
      // })

      // const percentagechangecolor = perticularInstrumentMarketData[0]?.change >= 0 ? "success" : "error"
      // const percentagechangecolor1 = (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "success" : "error"


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

      // instrumentDetailObj.last_price = (
      //   <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      //     {"₹"+(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}
      //   </MDTypography>
      // );
      // if(perticularInstrumentMarketData[0]?.change !== undefined){
      //   instrumentDetailObj.change = (
      //     <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
      //       {perticularInstrumentMarketData[0]?.change >= 0 ? "+" + ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%" : ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%"}
      //     </MDTypography>
      //   );ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)
// ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)
      // } else{
      //   instrumentDetailObj.change = (
      //     <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
      //       {(((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "+" + (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%" : (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%"}
      //     </MDTypography>
      //   );
      // }

      instrumentDetailObj.buy = (
        <BuyModel reRender={reRender} setReRender={setReRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} /> 
      );
      
      instrumentDetailObj.sell = (
        <SellModel reRender={reRender} setReRender={setReRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} />
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

      arr.push(instrumentDetailObj)
    })

    console.log("arr in memo")
    return arr;
  }, [reRender, socket]);

  console.log("instrumentDetailArr", instrumentDetailArr)



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


  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

    // let title = "App " + appstatus
  // let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = "Instrument Removed"
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

  const memoizedInstrumentComponent = useMemo(() => (
    <InstrumentComponent data={instrumentDetailArr}/>
  ), [ instrumentDetailArr]);

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
        <MDButton variant="outlined" size="small" color="info" onClick={handleClick}>Add Instrument</MDButton>
      </MDBox>)
      :
      (<MDBox>
        {/* <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        /> */}
        <TableContainer component={Paper}>
          <table style={{borderCollapse: "collapse", width: "auto"}}>
            <thead>
              <tr style={{borderBottom: "1px solid grey"}}>
                <td style={styleTD}>CONTRACT DATE</td>
                <td style={styleTD} >SYMBOL</td>
                <td style={styleTD} >INSTRUMENT</td>
                <td style={styleTD} >LTP</td>
                <td style={styleTD} >CHANGE(%)</td>
                <td style={styleTD} >CHART</td>
                <td style={styleTD} >BUY</td>
                <td style={styleTD} >SELL</td>
                <td style={styleTD} >REMOVE</td>
              </tr>
            </thead>
            <tbody>

              {instrumentDetailArr.map((elem)=>{
                return(
                  // {memoizedInstrumentComponent}
                  
                  // {<InstrumentComponent data={elem}/> }

              <tr
              style={{borderBottom: "1px solid grey"}}
              >
                  {/* <td style={styleTD} >
                  {elem.contractDate.props.children}
                  </td>
                  <td style={styleTD} >{elem.symbol.props.children}</td>
                  <td style={styleTD} >{elem.instrument.props.children}</td>
                  <td style={styleTD} >{elem.last_price.props.children}</td>
                  <td style={styleTD} >{elem.change.props.children}</td>
                  <td style={styleTD} >{elem.chart.props.children}</td> */}
                  <InstrumentComponent 
                    contractDate={elem.contractDate.props.children}
                    symbol={elem.symbol.props.children}
                    instrument={elem.instrument.props.children}
                    // last_price={elem.last_price.props.children}
                    // change={elem.change.props.children}
                    instrumentToken={elem.instrumentToken.props.children}
                    // chart={elem.chart.props.children}
                    // data={elem}
                    socket={socket}
                  />
                  <td style={styleTD} >{elem.chart.props.children}</td>
                  <td style={styleTD} >{elem.buy}</td>
                  <td style={styleTD} >{elem.sell}</td>
                  <td style={styleTD} >{elem.remove}</td>
      
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
















