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

  useEffect(()=>{
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
  }, [marketData])


    allTrade.sort((a, b)=> {
      return (b.amount-b.brokerage)-(a.amount-a.brokerage)
    });

    // console.log(finalTraderPnl)

let totalGrossPnl = 0;
let totalTransactionCost = 0;
let totalNoRunningLots = 0;
let totalTrades = 0;
let totalLotsUsed = 0;

allTrade.map((subelem, index)=>{
  let obj = {};
  let npnlcolor = ((subelem.amount)-(subelem.brokerage)) >= 0 ? "success" : "error"
  let tradercolor = ((subelem.amount)-(subelem.brokerage)) >= 0 ? "success" : "error"
  let gpnlcolor = (subelem.amount) >= 0 ? "success" : "error"
  let runninglotscolor = subelem.runninglots != 0 ? "info" : "dark"
  let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5"

  totalGrossPnl += (subelem.amount);
  totalTransactionCost += (subelem.brokerage);
  totalNoRunningLots += (subelem.lots);
  totalLotsUsed += (subelem.lotUsed);
  totalTrades += (subelem.trades);

  obj.traderName = (
    <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
      {(subelem._id.traderName)}
    </MDTypography>
  );

  obj.grossPnl = (
    <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
      {(subelem.amount) >= 0.00 ? "+₹" + ((subelem.amount).toFixed(2)): "-₹" + ((-(subelem.amount)).toFixed(2))}
    </MDTypography>
  );

  obj.noOfTrade = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {subelem.trades}
    </MDTypography>
  );

  obj.runningLots = (
    <MDTypography component="a" variant="caption" color={runninglotscolor} fontWeight="medium">
      {subelem.lots}
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
      {((subelem.amount)-(subelem.brokerage)) > 0.00 ? "+₹" + (((subelem.amount)-(subelem.brokerage)).toFixed(2)): "-₹" + ((-((subelem.amount)-(subelem.brokerage))).toFixed(2))}
    </MDTypography>
  );

  rows.push(obj);
})

let obj = {};

const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

obj.traderName = (
  <MDTypography component="a" variant="caption" fontWeight="medium">
    {}
  </MDTypography>
);

obj.grossPnl = (
  <MDTypography component="a" variant="caption"  color={totalGrossPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
  </MDTypography>
);

obj.noOfTrade = (
  <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Total Trades : {totalTrades}
  </MDTypography>
);

obj.runningLots = (
  <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Running Lots : {totalNoRunningLots}
  </MDTypography>
);

obj.lotUsed = (
  <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Lots Used : {totalLotsUsed}
  </MDTypography>
);


obj.brokerage = (
  <MDTypography component="a" variant="caption"  color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}
  </MDTypography>
);

obj.netPnl = (
  <MDTypography component="a" variant="caption"  color={totalnetPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
   Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
  </MDTypography>
);

rows.push(obj);


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
