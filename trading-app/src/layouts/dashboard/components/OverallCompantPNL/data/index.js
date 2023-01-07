/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// import for backend

// import Styles from "../Dashboard.module.css";

// bacend imports ends

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

// Images
import logoXD from "../../../../../assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "../../../../../assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "../../../../../assets/images/small-logos/logo-slack.svg";
import logoSpotify from "../../../../../assets/images/small-logos/logo-spotify.svg";
import logoJira from "../../../../../assets/images/small-logos/logo-jira.svg";
import logoInvesion from "../../../../../assets/images/small-logos/logo-invision.svg";
import team1 from "../../../../../assets/images/team-1.jpg";
import team2 from "../../../../../assets/images/team-2.jpg";
import team3 from "../../../../../assets/images/team-3.jpg";
import team4 from "../../../../../assets/images/team-4.jpg";

export default function data() {
    
  let date = new Date();
  let todayDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}` ;
  let fake_date = "1-12-2022"
  let totalTransactionCost = 0;
  const [overallPnlArr, setOverallPnlArr] = useState([]);
  const [liveDetail, setLiveDetail] = useState([]);
  const [avgPrice, setAvgPrice] = useState([]);

  var Total = 0;
  let avgPriceArr = [];
  let liveDetailsArr = [];
  let overallPnl = [];
  
  useEffect(()=>{

      console.log(data);
      let AvgPriceHash = new Map();
      avgPriceArr.push(data[0])
      for(let i = 0; i < data.length; i++){
          if(avgPriceArr[avgPriceArr.length-1].symbol !== data[i].symbol){
              avgPriceArr.push(data[i]);
              break;
          }
      }
      setAvgPrice(avgPriceArr)
      console.log("avgPriceArr", avgPriceArr);
      

      let hash = new Map();

      for(let i = data.length-1; i >= 0 ; i--){
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


                  console.log("obj.totalBuy", obj.totalBuy, "totalBuyLot", obj.totalBuyLot)
              } if(data[i].buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalSellLot = (Number(data[i].Quantity)) 
                  } else{

                      obj.totalSell = obj.totalSell + Number(data[i].average_price) * (Number(data[i].Quantity))
                      obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity)) 
                  }

                  console.log("obj.totalSell", obj.totalSell, "totalSellLot", obj.totalSellLot)
              }
          }  else{
              if(data[i].buyOrSell === "BUY"){
                  hash.set(data[i].symbol, {
                      totalBuy : Number(data[i].average_price) * (Number(data[i].Quantity)),
                      totalBuyLot : (Number(data[i].Quantity)) ,
                      totalSell: 0,
                      totalSellLot: 0,
                      symbol: data[i].symbol,
                      Product: data[i].Product
                  })
              }if(data[i].buyOrSell === "SELL"){
                  hash.set(data[i].symbol, {
                      totalSell : Number(data[i].average_price) * (Number(data[i].Quantity)),
                      totalSellLot : (Number(data[i].Quantity)) ,
                      totalBuy : 0,
                      totalBuyLot: 0,
                      symbol: data[i].symbol,
                      Product: data[i].Product
                  })
              }
          }
      }
      console.log(hash);
  
      
      for (let value of hash.values()){
          overallPnl.push(value);
      }

      
      overallPnl.map((elem)=>{
          console.log("52");
          tradeData.map((element)=>{
              console.log("53");
              if(element.symbol === elem.symbol){
                  console.log("line 54");
                  marketData.map((subElem)=>{
                      if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                          console.log(subElem);
                          liveDetailsArr.push(subElem)
                      }
                  })
              }
          })
      })


      setOverallPnlArr(overallPnl);
      console.log("details array", overallPnl);

      setLiveDetail(liveDetailsArr);

      console.log(liveDetailsArr);

      // reRender ? setReRender(false) : setReRender(true)

  }, [marketData, data])

  data.map((elem)=>{
      totalTransactionCost += Number(elem.brokerage);
  })
  console.log("totalTransactionCost", totalTransactionCost, avgPrice, liveDetail);


  return {
    columns: [
      { Header: "Product", accessor: "contractdate", width: "10%", align: "center" },
      { Header: "Instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "Quantity", accessor: "symbol", width: "10%", align: "center" },
      { Header: "Avg. Price", accessor: "avgprice", width: "10%", align: "center" },
      { Header: "LTP", accessor: "ltp", width: "10%", align: "center" },
      { Header: "Gross P&L", accessor: "gpnl", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "tcost", width: "10%", align: "center" },
      // { Header: "net p&l", accessor: "npnl", width: "10%", align: "center" },
    ],

    rows: [
      {
        contractdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            12-01-2023
          </MDTypography>
        ),
        instrument: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18500 CE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            NIFTY05JAN18500CE
          </MDTypography>
        ),
        avgprice: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹134.56
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹140.56
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,40,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹40,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,00,000.00
          </MDTypography>
        ),
      },

      {
        contractdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            12-01-2023
          </MDTypography>
        ),
        instrument: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18400 PE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            NIFTY05JAN18400PE
          </MDTypography>
        ),
        avgprice: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹164.76
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹145.43
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,20,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹20,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,00,000.00
          </MDTypography>
        ),
      },

    ],


  };
}
