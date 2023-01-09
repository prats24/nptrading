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

      let overallPnl = [];
      for (let value of hash.values()){
          overallPnl.push(value);
      }


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
