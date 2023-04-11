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
import { Typography } from "@mui/material";
import { HiUserGroup } from "react-icons/hi";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";
 
// Data
import data from "./data";
import ViewTradeDetail from "./ViewTradeDetail";
import ViewOrderDetail from "./MockTraderwiseOrders";

function MockTraderwiseCompantPNL(props) {
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

  let [latestLive, setLatestLive] = useState({
    tradeTime: "",
    tradeBy: "",
    tradeSymbol: "",
    tradeType: "",
    tradeQuantity: "",
    tradeStatus: ""
  })

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        //console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    props.socket.on("tick", (data) => {
      //console.log("this is live market data", data);
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
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
        //console.log('closing');
        props.socket.close();
    }
  }, [])


  

  useEffect(()=>{
          // Get Lastest Trade timestamp
          axios.get(`${baseUrl}api/v1/getlastestmocktradecompany`)
          // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
          .then((res)=>{
            latestLive.tradeTime = (res.data.trade_time) ;
            latestLive.tradeBy = (res.data.createdBy) ;
            latestLive.tradeType = (res.data.buyOrSell) ;
            latestLive.tradeQuantity = (res.data.Quantity) ;
            latestLive.tradeSymbol = (res.data.symbol) ;
            latestLive.tradeStatus = (res.data.status)
      
            setLatestLive(latestLive)
          }).catch((err) => {
            return new Error(err);
          })
  }, [marketData])

  let mapForParticularUser = new Map();
    //console.log("Length of All Trade Array:",allTrade.length);
    for(let i = 0; i < allTrade.length; i++){
      // //console.log(allTrade[i])
      if(mapForParticularUser.has(allTrade[i]._id.traderId)){
        //console.log(marketData, "marketData")
        let marketDataInstrument = marketData.filter((elem)=>{
          //console.log("market Data Instrument",elem.instrument_token)
          return elem.instrument_token == Number(allTrade[i]._id.symbol)
        })

        let obj = mapForParticularUser.get(allTrade[i]._id.traderId)
        //console.log(marketDataInstrument, "marketDataInstrument")
        obj.totalPnl += ((allTrade[i].amount+((allTrade[i].lots)*marketDataInstrument[0]?.last_price)));
        //console.log("Total P&L: ",allTrade[i]._id.traderId, allTrade[i].amount,Number(allTrade[i]._id.symbol),marketDataInstrument[0]?.instrument_token,marketDataInstrument[0]?.last_price,allTrade[i].lots);
        obj.lotUsed += Math.abs(allTrade[i].lotUsed)
        obj.runninglots += allTrade[i].lots;
        obj.brokerage += allTrade[i].brokerage;
        obj.noOfTrade += allTrade[i].trades

      } else{
        //console.log(marketData, "marketData")
        //console.log(Number(allTrade[i]._id.symbol) ,Number(allTrade[i]._id.symbol), "symbol")
        let marketDataInstrument = marketData.filter((elem)=>{
          return elem !== undefined && elem.instrument_token === Number(allTrade[i]._id.symbol)
        })
        ////console.log(marketDataInstrument)
        //console.log(marketDataInstrument, "marketDataInstrument")
        mapForParticularUser.set(allTrade[i]._id.traderId, {
          name : allTrade[i]._id.traderName,
          totalPnl : ((allTrade[i].amount+((allTrade[i].lots)*marketDataInstrument[0]?.last_price))),
          lotUsed : Math.abs(allTrade[i].lotUsed),
          runninglots : allTrade[i].lots,
          brokerage: allTrade[i].brokerage,
          noOfTrade: allTrade[i].trades,
          userId: allTrade[i]._id.traderId,
          algoName: allTrade[i]._id.algoName
        }) 
      }

    }

    //console.log("mapForParticularUser", mapForParticularUser)

    let finalTraderPnl = [];
    for (let value of mapForParticularUser.values()){
      finalTraderPnl.push(value);
    }

    finalTraderPnl.sort((a, b)=> {
      return (b.totalPnl-b.brokerage)-(a.totalPnl-a.brokerage)
    });

    //console.log("finalTraderPnl", finalTraderPnl)



let totalGrossPnl = 0;
let totalTransactionCost = 0;
let totalNoRunningLots = 0;
let totalTrades = 0;
let totalLotsUsed = 0;
let totalTraders = 0;

function viewTraderFullReport(){
  
}

console.log("re rendering index mock")

finalTraderPnl.map((subelem, index)=>{
  let obj = {};
  let npnlcolor = ((subelem.totalPnl)-(subelem.brokerage)) >= 0 ? "success" : "error"
  let tradercolor = ((subelem.totalPnl)-(subelem.totalPnl)) >= 0 ? "success" : "error"
  let gpnlcolor = (subelem.totalPnl) >= 0 ? "success" : "error"
  let runninglotscolor = subelem.runninglots > 0 ? "info" : (subelem.runninglots < 0 ? "error" : "dark")
  let runninglotsbgcolor = subelem.runninglots > 0 ? "#ffff00" : ""
  let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5"

  totalGrossPnl += (subelem.totalPnl);
  totalTransactionCost += (subelem.brokerage);
  totalNoRunningLots += (subelem.runninglots);
  totalLotsUsed += (subelem.lotUsed);
  totalTrades += (subelem.noOfTrade);
  totalTraders += 1;

  obj.userId = (
    <MDTypography component="a" variant="caption" fontWeight="medium">
      {subelem.userId}
    </MDTypography>
  );

  obj.traderName = (
    <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
      {(subelem.name)}
    </MDTypography>
  );

  obj.grossPnl = (
    <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
      {(subelem.totalPnl) >= 0.00 ? "+₹" + ((subelem.totalPnl).toFixed(2)): "-₹" + ((-(subelem.totalPnl)).toFixed(2))}
    </MDTypography>
  );

  obj.noOfTrade = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {subelem.noOfTrade}
    </MDTypography>
  );

  obj.runningLots = (
    <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
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
      {((subelem.totalPnl)-(subelem.brokerage)) >= 0.00 ? "+₹" + (((subelem.totalPnl)-(subelem.brokerage)).toFixed(2)): "-₹" + ((-((subelem.totalPnl)-(subelem.brokerage))).toFixed(2))}
    </MDTypography>
  );
  obj.view = (
    <ViewTradeDetail socket={props.socket} userId={subelem.userId}/>
  );
  obj.orders = (
    <ViewOrderDetail userId={subelem.userId}/>
  );

  rows.push(obj);
})

let obj = {};

const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"



obj.traderName = (
  <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    Traders : {totalTraders}
  </MDTypography>
);

obj.grossPnl = (
  <MDTypography component="a" variant="caption"  color={totalGrossPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
  </MDTypography>
);

obj.noOfTrade = (
  <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    {totalTrades}
  </MDTypography>
);

obj.runningLots = (
  <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    {totalNoRunningLots}
  </MDTypography>
);

obj.lotUsed = (
  <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    {totalLotsUsed}
  </MDTypography>
);


obj.brokerage = (
  <MDTypography component="a" variant="caption"  color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
    {"₹"+(totalTransactionCost).toFixed(2)}
  </MDTypography>
);

obj.netPnl = (
  <MDTypography component="a" variant="caption"  color={totalnetPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
   {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
  </MDTypography>
);

rows.push(obj);

//console.log("traderwise row", rows)


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>

        <MDBox display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
          <MDTypography variant="h6" gutterBottom>
            Traders Company Position(Mock Trade)
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0} textAlign="right">
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: 0,
              }}
            >
              {latestLive.tradeBy ? 'done' : 'stop'}
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
            {latestLive.tradeBy ? 
              <span>
                <strong> last trade </strong>
                {latestLive.tradeBy} {latestLive.tradeType === "BUY" ? "bought " : "sold "}  
                {Math.abs(latestLive.tradeQuantity)} quantity of 
                {latestLive.tradeSymbol} at {latestLive.tradeTime} - {latestLive.tradeStatus}
              </span>
              : "No trades today"
            }
            </MDTypography>
          </MDBox>
        </MDBox>

        {renderMenu}
      </MDBox>

      {rows.length === 1 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <HiUserGroup style={{fontSize: '30px', color:"#1A73E8"}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15} color="grey">Trader wise active mock trades will show up here.</Typography> 
      </MDBox>)
      :
        (<MDBox>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
          />
        </MDBox>
      )}
    </Card>
  );
            }
export default MockTraderwiseCompantPNL;
