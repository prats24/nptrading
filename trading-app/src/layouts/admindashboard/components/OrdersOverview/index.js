import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon  from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "../../../../examples/Timeline/TimelineItem";

function OrdersOverview() {

  const [LastFiveTrades, setLastFiveTrades] = useState([]);
  const [CreatedBy, setCreatedBy] = useState([]);
  const [Quantity, setQuantity] = useState([]);
  const [Type, setType] = useState([]);
  const [Symbol, setSymbol] = useState([]);
  const [TradeTime, setTradeTime] = useState([]);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

//   useEffect(()=>{
//     axios.get(`${baseUrl}api/v1/getlastfivemocktradecompany`)
//     .then((res)=>{
//         setLastFiveTrades(res.data) 
//         console.log(res.data)
//         for(let item of res.data)
//         {
//           setCreatedBy((prev)=>{return[...prev,(item.createdBy)]})
//           setQuantity((prev)=>{return[...prev,item.Quantity]})
//           setType((prev)=>{return[...prev,item.buyOrSell]})
//           setSymbol((prev)=>{return[...prev,item.symbol]})
//           setTradeTime((prev)=>{return[...prev,item.trade_time]})
//         }
//     })
// },[])

// setLastFiveTrades(CreatedBy[0]);
let buysell1 = Type[0] == "BUY" ? "bought" : "sold"
let title1 = `${CreatedBy[0]} ${buysell1} ${Quantity[0]} ${Symbol[0]}`
let title1_time = String(TradeTime[0]).split(" ")
title1_time = title1_time[1]
console.log(Symbol[0])
let instrumentcolor1 = Symbol[0].slice(-2) == "CE" ? "success" : "error"

let buysell2 = Type[1] == "BUY" ? "bought" : "sold"
let title2 = `${CreatedBy[1]} ${buysell2} ${Quantity[1]} ${Symbol[1]}`
let title2_time = String(TradeTime[1]).split(" ")
title2_time = title2_time[1]
let instrumentcolor2 = Symbol[1].slice(-2) == "CE" ? "success" : "error"

let buysell3 = Type[2] == "BUY" ? "bought" : "sold"
let title3 = `${CreatedBy[2]} ${buysell3} ${Quantity[2]} ${Symbol[2]}`
let title3_time = String(TradeTime[2]).split(" ")
title3_time = title3_time[1]
let instrumentcolor3 = Symbol[2].slice(-2) == "CE" ? "success" : "error"

let buysell4 = Type[3] == "BUY" ? "bought" : "sold"
let title4 = `${CreatedBy[3]} ${buysell4} ${Quantity[3]} ${Symbol[3]}`
let title4_time = String(TradeTime[3]).split(" ")
title4_time = title4_time[1]
let instrumentcolor4 = Symbol[3].slice(-2) == "CE" ? "success" : "error"

let buysell5 = Type[4] == "BUY" ? "bought" : "sold"
let title5 = `${CreatedBy[4]} ${buysell5} ${Quantity[4]} ${Symbol[4]}`
let title5_time = String(TradeTime[4]).split(" ")
title5_time = title5_time[1]
let instrumentcolor5 = Symbol[4].slice(-2) == "CE" ? "success" : "error"

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Latest Orders (Today)
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              130
            </MDTypography>{" "}
            orders so far
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color={instrumentcolor1}
          icon="notifications"
          title= {title1}
          dateTime={title1_time}
        />
        <TimelineItem
          color={instrumentcolor2}
          icon="notifications"
          title={title2}
          dateTime={title2_time}
        />
        <TimelineItem
          color={instrumentcolor3}
          icon="notifications"
          title={title3}
          dateTime={title3_time}
        />
        <TimelineItem
          color={instrumentcolor4}
          icon="notifications"
          title={title4}
          dateTime={title4_time}
        />
        <TimelineItem
          color={instrumentcolor5}
          icon="notifications"
          title={title5}
          dateTime={title5_time}
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
