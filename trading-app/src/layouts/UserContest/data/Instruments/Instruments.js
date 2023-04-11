import React,{useState, useEffect, useContext} from 'react'
// import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
// import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import { useLocation } from 'react-router-dom';
import axios from "axios";
import { marketDataContext } from '../../../../MarketDataContext';
import BuyModel from "./BuyModel";
import SellModel from "./SellModel";


function InstrumentsData({contestId, socket, portfolioId}){

    const marketDetails = useContext(marketDataContext)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [instrumentData, setInstrumentData] = useState([]);

    useEffect(()=>{
        // console.log("contestId", contestId)
        axios.get(`${baseUrl}api/v1/contestInstrument/${contestId}`,{
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
    }, [socket])

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/getliveprice`)
        .then((res) => {
          marketDetails.setMarketData(res.data);
        }).catch((err) => {
            return new Error(err);
        })
        socket.on('check', (data)=>{
          console.log("data from socket in instrument in parent", data)
        })
    
        // socket.on("tick", (data) => {
        socket.on("contest-ticks", (data) => {
          console.log('data from socket in instrument in parent', data);
          marketDetails.setMarketData(prevInstruments => {
            const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
            data.forEach(instrument => {
              instrumentMap.set(instrument.instrument_token, instrument);
            });
            return Array.from(instrumentMap.values());
          });
    
        })
    }, [])
    
      console.log("instrument", contestId, instrumentData)

return (
    <>
        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} color="light">Instruments</MDTypography>
            </Grid>
        </Grid>

        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Contract Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Symbol</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>LTP</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Change(%)</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Buy</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Sell</MDTypography>
            </Grid>

        </Grid>

        {instrumentData.map((elem)=>{
            let perticularInstrumentMarketData = marketDetails.marketData.filter((subelem)=>{
            return elem.instrumentToken === subelem.instrument_token
            })
            return(
            <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
                <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>{elem.contractDate}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>{elem.symbol}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>{"₹"+(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>
                        {perticularInstrumentMarketData[0]?.change >= 0 ? "+" + ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%" : ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%"}
                    </MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                {/* <MDButton variant="contained" color="info" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>B</MDButton> */}
                    <BuyModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId}/>
                </Grid>
                {/* reRender={reRender} setReRender={setReRender} */}
                <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
                
                </Grid>
    
                <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                {/* <MDButton variant="contained" color="error" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>S</MDButton> */}
                    <SellModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId}/>
                </Grid>
    
            </Grid>
            )
        })}
        </>
);
}

export default InstrumentsData;