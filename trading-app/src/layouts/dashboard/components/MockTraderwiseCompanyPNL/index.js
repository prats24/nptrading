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

    axios.get(`${baseUrl}api/v1/readmocktradecompanyDate`)
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

  userDetail.map((elem)=>{

      let data = allTrade.filter((element)=>{
          return elem.email === element.userId;
      })


      let hash = new Map();

      for(let i = data.length-1; i >= 0 ; i--){
          numberOfTrade += 1;
          transactionCost += Number(data[i].brokerage);
          if(hash.has(data[i].symbol)){
              let obj = hash.get(data[i].symbol);
              if(data[i].buyOrSell === "BUY"){
                  if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                      obj.totalBuy = Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalBuyLot = (Number(data[i].Quantity))
                  } else{
                      obj.totalBuy = obj.totalBuy + Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].Quantity)) 
                  }

              } if(data[i].buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalSellLot = (Number(data[i].Quantity)) 
                  } else{

                      obj.totalSell = obj.totalSell + Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity)) 
                  }

              }
          }  else{
              if(data[i].buyOrSell === "BUY"){
                  hash.set(data[i].symbol, {
                      totalBuy : Number(data[i].average_price) * (Number(data[i].Quantity)),
                      totalBuyLot : (Number(data[i].Quantity)) ,
                      totalSell: 0,
                      totalSellLot: 0,
                      symbol: data[i].symbol,
                      Product: data[i].Product,
                      name: data[0].createdBy
                  })
              }if(data[i].buyOrSell === "SELL"){
                  hash.set(data[i].symbol, {
                      totalSell : Number(data[i].average_price) * (Number(data[i].Quantity)),
                      totalSellLot : (Number(data[i].Quantity)) ,
                      totalBuy : 0,
                      totalBuyLot: 0,
                      symbol: data[i].symbol,
                      Product: data[i].Product,
                      name: data[0].createdBy
                  })
              }
          }
      }

      let overallPnl = [];
      for (let value of hash.values()){
          overallPnl.push(value);
      }
      console.log("overallpnl arr", overallPnl)
      let liveDetailsArr = [];
      overallPnl.map((elem)=>{
          tradeData.map((element)=>{
              if(element.symbol === elem.symbol){
                  marketData.map((subElem)=>{
                      if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                          liveDetailsArr.push(subElem)
                      }
                  })
              }
          })
      })

      
      let name = "";
      overallPnl.map((elem, index)=>{
          name = elem.name;
          console.log(elem.totalBuy,elem.totalSell,elem.totalBuyLot,elem.totalSellLot, liveDetailsArr[index]?.last_price)
          totalPnl += (-(elem.totalBuy+elem.totalSell-(elem.totalBuyLot+elem.totalSellLot)*liveDetailsArr[index]?.last_price))
          lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
          runninglots += elem.totalBuyLot + elem.totalSellLot;
          console.log(runninglots);
      })

      let newObj = {
          brokerage: transactionCost,
          pnl: totalPnl,
          name: name,
          numberOfTrade: numberOfTrade,
          lotUsed: lotUsed,
          runninglots: runninglots
      }
      console.log(transactionCost, totalPnl, name, runninglots);
      detailPnl.push(JSON.parse(JSON.stringify(newObj)));
      transactionCost = 0;
      totalPnl = 0;
      numberOfTrade = 0;
      lotUsed = 0;
      runninglots = 0;
      // runninglots = 0;
  })

  detailPnl.sort((a, b)=> {
  return (b.pnl-b.brokerage)-(a.pnl-a.brokerage)
  });

  console.log(detailPnl);


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
