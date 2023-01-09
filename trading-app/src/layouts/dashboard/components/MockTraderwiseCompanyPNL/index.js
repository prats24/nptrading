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
    
  const [userDetail, setUserDetail] = useState([]);
  const [allTrade, setAllTrade] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [instrumentData, setInstrumentData] = useState([]);
  const [tradeData, setTradeData] = useState([]);


  let detailPnl = [];

  let date = new Date();
  let todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  // let fake_date = "2022-12-16";
  let fake_date = "16-12-2022";
  let totalPnl = 0;
  let transactionCost = 0;
  let numberOfTrade = 0;
  let lotUsed = 0;
  let runninglots = 0;
  let totalOverAllPnl = 0;
  let totalNumberTrade = 0;
  let totalLotsUsed = 0;
  let totalrunninglots = 0;
  let totalTransCost = 0;
  let totalNetPnl = 0;
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
    axios.get(`${baseUrl}api/v1/readuserdetails`)
    .then((res) => {
        setUserDetail(res.data);
    }).catch((err)=>{
        return new Error(err);
    })

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

  // userDetail.map((elem)=>{

  //     let data = allTrade.filter((element)=>{
  //         return elem.email === element.userId;
  //     })

 console.log("allTrade", allTrade)
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

              } if(allTrade[i]._id.buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(allTrade[i].amount)
                      obj.totalSellLot = (Number(allTrade[i].lots))
                  } else{

                      obj.totalSell = obj.totalSell + Number(allTrade[i].amount)
                      obj.totalSellLot = obj.totalSellLot + (Number(allTrade[i].lots))
                  }
                  obj.noOfTrade += allTrade[i].trades

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

      console.log("hash", hash)
      let overallPnl = [];
      for (let value of hash.values()){
          overallPnl.push(value);
      }
      console.log("overallpnl arr", overallPnl, )
      console.log("marketData", marketData)
      let liveDetailsArr = [];
      // overallPnl.map((elem)=>{
      //     // tradeData.map((element)=>{
      //     //     if(element.symbol === elem.symbol){
      //             marketData.map((subElem)=>{
      //                 if(subElem !== undefined && subElem.instrument_token == elem.symbol){
      //                     liveDetailsArr.push(subElem)
      //                 }
      //             })
      //     //     }
      //     // })
      // })

      // console.log(liveDetailsArr)
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
      let name = "";
      // overallPnl.map((elem, index)=>{
      //     name = elem.name;
      //     console.log(elem.totalBuy,elem.totalSell,elem.totalBuyLot,elem.totalSellLot, liveDetailsArr[index]?.last_price)
      //     totalPnl += (-(elem.totalBuy+elem.totalSell-(elem.totalBuyLot+elem.totalSellLot)*liveDetailsArr[index]?.last_price))
      //     lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
      //     runninglots += elem.totalBuyLot + elem.totalSellLot;
      //     console.log(runninglots);
      // })
      let finalTraderPnl = [];
      for (let value of mapForParticularUser.values()){
        finalTraderPnl.push(value);
      }

      finalTraderPnl.sort((a, b)=> {
        return (b.totalPnl-b.brokerage)-(a.totalPnl-a.brokerage)
      });

      console.log(finalTraderPnl)

 
  finalTraderPnl.map((subelem, index)=>{
    let obj = {};
 
    obj.traderName = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {(subelem.name)}
      </MDTypography>
    );

    obj.grossPnl = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {(subelem.totalPnl) > 0.00 ? "+₹" + ((subelem.totalPnl).toFixed(2)): "-₹" + ((-(subelem.totalPnl)).toFixed(2))}
      </MDTypography>
    );

    obj.noOfTrade = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {subelem.noOfTrade}
      </MDTypography>
    );

    obj.runningLots = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {subelem.runninglots}
      </MDTypography>
    );

    obj.lotUsed = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {subelem.lotUsed}
      </MDTypography>
    );

    obj.brokerage = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {"₹"+(subelem.brokerage).toFixed(2)}
      </MDTypography>
    );

    obj.netPnl = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {((subelem.totalPnl)-(subelem.brokerage)) > 0.00 ? "+₹" + (((subelem.totalPnl)-(subelem.brokerage)).toFixed(2)): "-₹" + ((-((subelem.totalPnl)-(subelem.brokerage))).toFixed(2))}
      </MDTypography>
    );

    //console.log(obj)
    rows.push(obj);
  })



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
export default MockTraderwiseCompantPNL;
