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

function MockTraderwiseCompantPNL({socket}) {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

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


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const [allTrade, setAllTrade] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [lastestTradeTimearr, setLatestTradeTimearr] = useState([]);
  const [lastestTradeTime, setLatestTradeTime] = useState([]);
  const [lastestTradeBy, setLatestTradeBy] = useState([]);
  const [lastestTradeSymbol, setLatestTradeSymbol] = useState([]);
  const [lastestTradeType, setLatestTradeType] = useState([]);
  const [lastestTradeQunaity, setLatestTradeQuantity] = useState([]);

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      console.log("this is live market data", data);
      setMarketData(data);
      // setDetails.setMarketData(data);
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/gettraderwisepnlmocktradecompanytoday`)
    .then((res) => {
        setAllTrade(res.data);
    }).catch((err)=>{
        return new Error(err);
    })

  }, [marketData])

  useEffect(() => {
    return () => {
        console.log('closing');
        socket.close();
    }
  }, [])



      let hash = new Map();

      for(let i = allTrade.length-1; i >= 0 ; i--){
          // numberOfTrade += 1;
          // transactionCost += Number(allTrade[i].brokerage);
          if(hash.has(allTrade[i]._id.symbol+" "+allTrade[i]._id.traderId)){
              let obj = hash.get(allTrade[i]._id.symbol+" "+allTrade[i]._id.traderId);
              if(allTrade[i]._id.buyOrSell === "BUY"){
                  if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                      obj.totalBuy = Number(allTrade[i].amount)
                      obj.totalBuyLot = (Number(allTrade[i].lots))
                  } else{
                      obj.totalBuy = obj.totalBuy + Number(allTrade[i].amount)
                      obj.totalBuyLot = obj.totalBuyLot + (Number(allTrade[i].lots))
                  }
                  obj.noOfTrade += allTrade[i].trades
                  obj.brokerage += allTrade[i].brokerage

              } if(allTrade[i]._id.buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(allTrade[i].amount)
                      obj.totalSellLot = (Number(allTrade[i].lots))
                  } else{

                      obj.totalSell = obj.totalSell + Number(allTrade[i].amount)
                      obj.totalSellLot = obj.totalSellLot + (Number(allTrade[i].lots))
                  }
                  obj.noOfTrade += allTrade[i].trades
                  obj.brokerage += allTrade[i].brokerage

              }
          }  else{
              if(allTrade[i]._id.buyOrSell === "BUY"){
                  hash.set(allTrade[i]._id.symbol+" "+allTrade[i]._id.traderId, {
                      totalBuy : Number(allTrade[i].amount),
                      totalBuyLot : (Number(allTrade[i].lots)) ,
                      totalSell: 0,
                      totalSellLot: 0,
                      symbol: allTrade[i]._id.symbol,
                      // Product: allTrade[i].Product,
                      name: allTrade[i]._id.traderName,
                      userId: allTrade[i]._id.traderId,
                      brokerage: allTrade[i].brokerage,
                      noOfTrade: allTrade[i].trades
                  })
              }if(allTrade[i]._id.buyOrSell === "SELL"){
                  hash.set(allTrade[i]._id.symbol+" "+allTrade[i]._id.traderId, {
                      totalSell : Number(allTrade[i].amount),
                      totalSellLot : (Number(allTrade[i].lots)) ,
                      totalBuy : 0,
                      totalBuyLot: 0,
                      symbol: allTrade[i]._id.symbol,
                      // Product: allTrade[i].Product,
                      name: allTrade[i]._id.traderName,
                      userId: allTrade[i]._id.traderId,
                      brokerage: allTrade[i].brokerage ,
                      noOfTrade: allTrade[i].trades                    
                  })
              }
          }
      }

      let overallPnl = [];
      for (let value of hash.values()){
          overallPnl.push(value);
      }

        // Get Lastest Trade timestamp
    axios.get(`${baseUrl}api/v1/getlastestmocktradecompany`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
        setLatestTradeTimearr(res.data);
        setLatestTradeTime(res.data.trade_time) ;
        setLatestTradeBy(res.data.createdBy) ;
        setLatestTradeType(res.data.buyOrSell) ;
        setLatestTradeQuantity(res.data.Quantity) ;
        setLatestTradeSymbol(res.data.symbol) ;
          console.log(lastestTradeTimearr);
    }).catch((err) => {
      return new Error(err);
  })

      // setLatestTradeTime(lastestTradeTime);


      let mapForParticularUser = new Map();
      for(let i = 0; i < overallPnl.length; i++){
        // console.log(overallPnl[i])
        if(mapForParticularUser.has(overallPnl[i].userId)){
          let marketDataInstrument = marketData.filter((elem)=>{
            return elem.instrument_token == overallPnl[i].symbol
          })

          let obj = mapForParticularUser.get(overallPnl[i].userId)
          // console.log(marketDataInstrument)
          obj.totalPnl += (-(overallPnl[i].totalBuy+overallPnl[i].totalSell-(overallPnl[i].totalBuyLot+overallPnl[i].totalSellLot)*marketDataInstrument[0]?.last_price));
          obj.lotUsed += Math.abs(overallPnl[i].totalBuyLot) + Math.abs(overallPnl[i].totalSellLot);
          obj.runninglots += overallPnl[i].totalBuyLot + overallPnl[i].totalSellLot;
          obj.brokerage += overallPnl[i].brokerage;
          obj.noOfTrade += overallPnl[i].noOfTrade

        } else{
          let marketDataInstrument = marketData.filter((elem)=>{
            return elem.instrument_token == overallPnl[i].symbol
          })
          // console.log(marketDataInstrument)
          mapForParticularUser.set(overallPnl[i].userId, {
            name : overallPnl[i].name,
            totalPnl : (-(overallPnl[i].totalBuy+overallPnl[i].totalSell-(overallPnl[i].totalBuyLot+overallPnl[i].totalSellLot)*marketDataInstrument[0]?.last_price)),
            lotUsed : Math.abs(overallPnl[i].totalBuyLot) + Math.abs(overallPnl[i].totalSellLot),
            runninglots : overallPnl[i].totalBuyLot + overallPnl[i].totalSellLot,
            brokerage: overallPnl[i].brokerage,
            noOfTrade: overallPnl[i].noOfTrade
  
          })
        }

      }

      console.log("mapForParticularUser", mapForParticularUser)

      let finalTraderPnl = [];
      for (let value of mapForParticularUser.values()){
        finalTraderPnl.push(value);
      }

      finalTraderPnl.sort((a, b)=> {
        return (b.totalPnl-b.brokerage)-(a.totalPnl-a.brokerage)
      });

      console.log(finalTraderPnl)

 let totalGrossPnl = 0;
 let totalTransactionCost = 0;
  finalTraderPnl.map((subelem, index)=>{
    let obj = {};
    let npnlcolor = ((subelem.totalPnl)-(subelem.brokerage)) >= 0 ? "success" : "error"
    let tradercolor = ((subelem.totalPnl)-(subelem.brokerage)) >= 0 ? "success" : "error"
    let gpnlcolor = (subelem.totalPnl) >= 0 ? "success" : "error"
    let runninglotscolor = subelem.runninglots != 0 ? "info" : "dark"
    let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5"
 
    totalGrossPnl += (subelem.totalPnl);
    totalTransactionCost += (subelem.brokerage);
    obj.traderName = (
      <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
        {(subelem.name)}
      </MDTypography>
    );

    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {(subelem.totalPnl) > 0.00 ? "+₹" + ((subelem.totalPnl).toFixed(2)): "-₹" + ((-(subelem.totalPnl)).toFixed(2))}
      </MDTypography>
    );

    obj.noOfTrade = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {subelem.noOfTrade}
      </MDTypography>
    );

    obj.runningLots = (
      <MDTypography component="a" variant="caption" color={runninglotscolor} fontWeight="medium">
        {subelem.runninglots}
      </MDTypography>
    );

    obj.lotUsed = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {subelem.lotUsed}
      </MDTypography>
    );

    obj.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {"₹"+(subelem.brokerage).toFixed(2)}
      </MDTypography>
    );

    obj.netPnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {((subelem.totalPnl)-(subelem.brokerage)) > 0.00 ? "+₹" + (((subelem.totalPnl)-(subelem.brokerage)).toFixed(2)): "-₹" + ((-((subelem.totalPnl)-(subelem.brokerage))).toFixed(2))}
      </MDTypography>
    );

    //console.log(obj)
    rows.push(obj);
  })

  let obj = {};

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

  obj.traderName = (
    <MDTypography component="a" variant="caption"  fontWeight="medium">
      {}
    </MDTypography>
  );

  obj.grossPnl = (
    <MDTypography component="a" variant="caption"  fontWeight="medium">
      {}
    </MDTypography>
  );

  obj.noOfTrade = (
    <MDTypography component="a" variant="caption"  fontWeight="medium">
      Transaction Cost
    </MDTypography>
  );

  obj.runningLots = (
    <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {"₹"+(totalTransactionCost).toFixed(2)}
    </MDTypography>
  );

  obj.lotUsed = (
    <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
      Gross P&L
    </MDTypography>
  );


  obj.brokerage = (
    <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
    </MDTypography>
  );

  obj.netPnl = (
    <MDTypography component="a" variant="caption" color={totalnetPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
    </MDTypography>
  );

  //console.log(obj)
  rows.push(obj);



  // console.log(detailPnl);


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Traderwise Company P&L(Mock)
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
            &nbsp;<strong>last trade</strong> {lastestTradeBy} {lastestTradeType === "BUY" ? "bought" : "sold"} {Math.abs(lastestTradeQunaity)} quantity of {lastestTradeSymbol} at {lastestTradeTime}
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
        />
      </MDBox>
    </Card>
  );
            }
export default MockTraderwiseCompantPNL;
