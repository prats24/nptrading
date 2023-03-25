
import React, {useEffect, useState, useContext} from 'react'
import Card from "@mui/material/Card";
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import { Typography } from "@mui/material";
// Material Dashboard 2 React components

import { GrAnchor } from "react-icons/gr";


// Data

import OverallPL from './Overall P&L';
import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { userContext } from '../../../AuthContext';
import MDButton from '../../../components/MDButton';
import ExitPosition from './ExitPosition';
import Buy from "../components/InstrumentDetails/data/BuyModel";
import Sell from "../components/InstrumentDetails/data/SellModel"
// import Button from '@mui/material/Button';

function OverallGrid({socket, Render, handleClick}) {
  const { netPnl, updateNetPnl } = useContext(NetPnlContext);
  const { columns, rows } = OverallPL();
  const [menu, setMenu] = useState(null);

  const closeMenu = () => setMenu(null);

  const getDetails = useContext(userContext);
  const { reRender, setReRender } = Render
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [liveDetail, setLiveDetail] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [render, setRender] = useState(true);
  const [instrumentData, setInstrumentData] = useState([]);

  let liveDetailsArr = [];
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;


    useEffect(()=>{

      let abortController;
      (async () => {
           abortController = new AbortController();
           let signal = abortController.signal;    

           // the signal is passed into the request(s) we want to abort using this controller
           const { data } = await axios.get(
            `${baseUrl}api/v1/getliveprice`,
               { signal: signal }
           );
           setMarketData(data);
      })();

      axios.get(`${baseUrl}api/v1/getInstrument/${getDetails.userDetails._id}`)
      .then((res) => {
          //console.log("live price data", res)
          setInstrumentData(res.data);
          // setDetails.setMarketData(data);
      }).catch((err) => {
          return new Error(err);
      })

      // socket.on("tick", (data) => {
      //   setMarketData(prevInstruments => {
      //     const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
      //     data.forEach(instrument => {
      //       instrumentMap.set(instrument.instrument_token, instrument);
      //     });
      //     return Array.from(instrumentMap.values());
      //   });
      // })

      return () => abortController.abort();
    }, [])



    useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/getoverallpnlmocktradeparticularusertoday/${getDetails.userDetails.email}`)
      // .then((res) => {
      //     setTradeData(res.data);
      //     res.data.map((elem)=>{
      //       marketData.map((subElem)=>{
      //           if(subElem !== undefined && subElem.instrument_token == elem._id.instrumentToken){
      //               liveDetailsArr.push(subElem)
      //           }
      //       })
      //     })

      //   setLiveDetail(liveDetailsArr);

                 

      // }).catch((err) => {
      //     return new Error(err);
      // })

      let abortController;
      (async () => {
           abortController = new AbortController();
           let signal = abortController.signal;    

           // the signal is passed into the request(s) we want to abort using this controller
           const { data } = await axios.get(
            `${baseUrl}api/v1/getoverallpnlmocktradeparticularusertoday/${getDetails.userDetails.email}`,
              { signal: signal }
           );

           setTradeData(data);
           data.map((elem)=>{
             marketData.map((subElem)=>{
                  console.log(subElem.instrument_token , elem._id.instrumentToken)
                 if(subElem !== undefined && subElem.instrument_token == elem._id.instrumentToken){
                     liveDetailsArr.push(subElem)
                 }
             })
           })
 
         setLiveDetail(liveDetailsArr);

      })();

      reRender ? setRender(false) : setRender(true);
      return () => abortController.abort();
    }, [marketData, render])


    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])

    console.log("tradeData", tradeData, instrumentData)

    tradeData.map((subelem, index)=>{
      let obj = {};
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[index]?.last_price);
      totalGrossPnl += updatedValue;

      totalTransactionCost += Number(subelem.brokerage);

      let perticularInstrumentData = instrumentData.filter((elem)=>{
        console.log("elem", elem, subelem)
        return subelem._id.instrumentToken == elem.instrumentToken;
      })

      updateNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots);
      const instrumentcolor = subelem._id.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[index]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem._id.product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem._id.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem.lots}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹"+subelem.lastaverageprice.toFixed(2)}
        </MDTypography>
      );

      if((liveDetail[index]?.last_price)){
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price).toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[index]?.change)){
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[index]?.change).toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%"}
          </MDTypography>
        );
      }
      obj.exit = (
        < ExitPosition product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity= {subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange}/>
      );
      obj.buy = (
        <Buy Render={{ reRender, setReRender }} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={perticularInstrumentData[0]?.instrument} lotSize={perticularInstrumentData[0]?.lotSize} maxLot={perticularInstrumentData[0]?.maxLot} ltp={(liveDetail[index]?.last_price)?.toFixed(2)}/>
      );
      
      obj.sell = (
        <Sell Render={{ reRender, setReRender }} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={perticularInstrumentData[0]?.instrument} lotSize={perticularInstrumentData[0]?.lotSize} maxLot={perticularInstrumentData[0]?.maxLot} ltp={(liveDetail[index]?.last_price)?.toFixed(2)}/>
      );


      //console.log(obj)
      rows.push(obj);
    })


    let obj = {};

    const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
    const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

    obj.symbol = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
       {}
      </MDTypography>
    );
  
    obj.Quantity = (
      <MDTypography component="a" variant="caption" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Running Lots : {totalRunningLots}
      </MDTypography>
    );
  
    obj.avgPrice = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
       {}
      </MDTypography>
    );
  
    obj.last_price = (
      <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}
      </MDTypography>
    );
  
  
    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
       Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
      </MDTypography>
    );
  
    obj.change = (
      <MDTypography component="a" variant="caption" color={totalnetPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
      </MDTypography>
    );
    
  
    rows.push(obj);
  

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Positions
          </MDTypography>
        </MDBox>
      </MDBox>
      {rows.length === 1 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <GrAnchor style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px', color:"grey"}}>No open positions yet</Typography>
        <Typography mb={2} fontSize={15} color="grey">Add instruments and start trading.</Typography>
        <MDButton variant="outlined" size="small" color="info" onClick={handleClick}>Get Started</MDButton>
      </MDBox>)
      :
      (<MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      )}
    </Card>
  );

}
export default OverallGrid;
