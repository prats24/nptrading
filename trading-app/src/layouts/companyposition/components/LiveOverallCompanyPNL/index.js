/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
//
// import Styles from "../Dashboard.module.css";

//
import {useState, useEffect} from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";

// function OverallCompantPNL({socket}) {
function LiveOverallCompantPNL({socket}) {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let date = new Date();
  let totalTransactionCost = 0;
  const [overallPnlArr, setOverallPnlArr] = useState([]);
  const [liveDetail, setLiveDetail] = useState([]);
  const [avgPrice, setAvgPrice] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [instrumentData, setInstrumentData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [lastAvgPriceArr, setLastAvgPriceArr] = useState([]);



  var Total = 0;
  let avgPriceArr = [];
  let liveDetailsArr = [];
  let overallPnl = [];
  let totalGrossPnl = 0;
  
  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        //console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      //console.log("this is live market data", data);
      setMarketData(data);
      // setDetails.setMarketData(data);
    })
  }, [])

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
    .then((res) => {
        let dataArr = (res.data).filter((elem) => {
            return elem.status === "Active"
        })
        setInstrumentData(dataArr)
    }).catch((err) => {
        return new Error(err);
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getavgpricelivetradecompany`)
    .then((res) => {
      setLastAvgPriceArr(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/getoverallpnllivetradecompanytoday`)
    .then((res) => {
        setTradeData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

      // let AvgPriceHash = new Map();
      // avgPriceArr.push(tradeData[0])
      // for(let i = 0; i < tradeData.length; i++){
      //     if(avgPriceArr[avgPriceArr.length-1]._id.symbol !== tradeData[i]._id.symbol){
      //         avgPriceArr.push(tradeData[i]);
      //         break;
      //     }
      // }
      // setAvgPrice(avgPriceArr)

      let hash = new Map();

      for(let i = tradeData.length-1; i >= 0 ; i--){ 
          if(hash.has(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product)){
              let obj = hash.get(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product);
              if(tradeData[i]._id.buyOrSell === "BUY"){
                  if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                      obj.totalBuy = Number(tradeData[i].amount)
                      obj.totalBuyLot = (Number(tradeData[i].lots))
                  } else{
                      obj.totalBuy = obj.totalBuy + Number(tradeData[i].amount)
                      obj.totalBuyLot = obj.totalBuyLot + (Number(tradeData[i].lots)) 
                  }

                  //console.log("obj.totalBuy", obj.totalBuy, "totalBuyLot", obj.totalBuyLot)
              } if(tradeData[i]._id.buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(tradeData[i].amount)
                      obj.totalSellLot = (Number(tradeData[i].lots)) 
                  } else{

                      obj.totalSell = obj.totalSell + Number(tradeData[i].amount)
                      obj.totalSellLot = obj.totalSellLot + (Number(tradeData[i].lots)) 
                  }

                  //console.log("obj.totalSell", obj.totalSell, "totalSellLot", obj.totalSellLot)
              }
          }  else{
              if(tradeData[i]._id.buyOrSell === "BUY"){
                  hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                      totalBuy : Number(tradeData[i].amount),
                      totalBuyLot : (Number(tradeData[i].lots)),
                      totalSell: 0,
                      totalSellLot: 0,
                      symbol: tradeData[i]._id.symbol,
                      Product: tradeData[i]._id.Product
                  });
                  // hashForProduct.set(tradeData[i]._id.Product);

              }if(tradeData[i]._id.buyOrSell === "SELL"){
                  hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                      totalSell : Number(tradeData[i].amount),
                      totalSellLot : (Number(tradeData[i].lots)),
                      totalBuy : 0,
                      totalBuyLot: 0,
                      symbol: tradeData[i]._id.symbol,
                      Product: tradeData[i]._id.Product
                  });
                  // hashForProduct.set(data[i].Product);
                  
              }
          }
      }

      
      for (let value of hash.values()){
          overallPnl.push(value);
      }

      
      overallPnl.map((elem)=>{
          //console.log("52");
          instrumentData.map((element)=>{
              //console.log("53");
              if(element.symbol === elem.symbol){
                  //console.log("line 54");
                  marketData.map((subElem)=>{
                      if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                          //console.log(subElem);
                          liveDetailsArr.push(subElem)
                      }
                  })
              }
          })
      })


      setOverallPnlArr(overallPnl);

      setLiveDetail(liveDetailsArr);

  }, [marketData])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

  tradeData.map((elem)=>{
      totalTransactionCost += Number(elem.brokerage);
  })

    overallPnlArr.map((subelem, index)=>{
      let obj = {};
      let tempavgPriceArr = lastAvgPriceArr.filter((element)=>{
        return (subelem.symbol === element._id.symbol) && (subelem.Product === element._id.product);
      })

      let updatedValue = (-(subelem.totalBuy+subelem.totalSell-(subelem.totalBuyLot+subelem.totalSellLot)*liveDetail[index]?.last_price));
      totalGrossPnl += updatedValue;

      const instrumentcolor = subelem.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.Quantity >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[index]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem.Product === "NRML" ? "info" : subelem.Product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem.Product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem.totalBuyLot + subelem.totalSellLot}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹"+tempavgPriceArr[0].average_price.toFixed(2)}
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
      //console.log(obj)
      rows.push(obj);
    })


    let obj = {};

    const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
    const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

    obj.Product = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {}
      </MDTypography>
    );
  
    obj.symbol = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {}
      </MDTypography>
    );
  
    obj.Quantity = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        Transaction Cost
      </MDTypography>
    );
  
    obj.avgPrice = (
      <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        {"₹"+(totalTransactionCost).toFixed(2)}
      </MDTypography>
    );
  
    obj.last_price = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
       Gross P&L
      </MDTypography>
    );
  
  
    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
      </MDTypography>
    );
  
    obj.change = (
      <MDTypography component="a" variant="caption" color={totalnetPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Net P&L : {(totalGrossPnl-totalTransactionCost) > 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
      </MDTypography>
    );
  
    //console.log(obj)
    rows.push(obj);
  


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



  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Overall Company P&L(Live)
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>last order at</strong> 11:10:23
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}
export default LiveOverallCompantPNL;
