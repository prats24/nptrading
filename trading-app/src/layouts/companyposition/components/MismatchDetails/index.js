import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";
import { useEffect } from "react";
import axios from "axios";


function MismatchDetails({socket}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { columns, rows, MismatchData } = data();
  const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [OpenPositionData, setOpenPositionData] = useState([]);
  // const [liveDetail, setLiveDetail] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  let liveDetailsArr = [];
  
  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      setMarketData(data);
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getOpenPositions`)
    .then((res) => {
        setOpenPositionData(res.data);

    }).catch((err) => {
        return new Error(err);
    })
  }, [marketData])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getoverallpnllivetradecompanytoday`)
    .then((res) => {
        setTradeData(res.data);

    }).catch((err) => {
        return new Error(err);
    })
}, [marketData])

useEffect(() => {
  return () => {
      socket.close();
  }
}, [])



// res.data.map((elem)=>{
//   marketData.map((subElem)=>{
//       if(subElem !== undefined && subElem.instrument_token == elem.instrument_token){
//           liveDetailsArr.push(subElem)
//       }
//   })
// })
// setLiveDetail(liveDetailsArr);


OpenPositionData.map((elem)=>{
  let appPnlData = tradeData.filter((element)=>{
    return element._id.symbol === elem.tradingsymbol;
  })

  let liveDetail = marketData.filter((element)=>{
    return element !== undefined && element.instrument_token == elem.instrument_token
  })



  let updatedValue = (appPnlData[0]?.amount+(appPnlData[0]?.lots)*liveDetail[0]?.last_price);

  let obj = {};

  obj.instrument = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {elem.tradingsymbol}
    </MDTypography>
  );
  obj.product = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {elem.product}
    </MDTypography>
  );
  obj.appgrosspnl = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">

      {updatedValue ? updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2)) : "+₹0"}
    </MDTypography>
  );
  obj.zerodhagrosspnl = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {elem.pnl >= 0.00 ? "+₹" + (elem.pnl.toFixed(2)): "-₹" + ((-elem.pnl).toFixed(2))}
    </MDTypography>
  );
  obj.apprunninglots = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {appPnlData[0] ? appPnlData[0]?.lots : 0}
    </MDTypography>
  );
  obj.zerodharunninglots = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {elem.buy_quantity - elem.sell_quantity}
    </MDTypography>
  );

  rows.push(obj)

})
  //console.log("marketData", marketData)
  let ltpArr = [];
  
  // rows.map((elem)=>{
  //   let ltpObj = {};
  //   marketData.map((subelem)=>{
      
  //     const percentagechangecolor = (((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "success" : "error"
  //     const percentagechangecolor1 = (subelem.change) >= 0 ? "success" : "error"

  //     if(elem.instrumentToken.props.children === subelem.instrument_token){
  //       elem.last_price = (
  //           <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
  //             {"₹"+(subelem.last_price).toFixed(2)}
  //           </MDTypography>
  //         );
  //         if(subelem.change){
  //           elem.change = (
  //             <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
  //               {(subelem.change) >= 0 ? "+" + ((subelem.change).toFixed(2))+"%" : ((subelem.change).toFixed(2))+"%"}
  //             </MDTypography>
  //           );
  //         } else{
  //           elem.change = (
  //             <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
  //               {(((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "+" + (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%" : (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%"}
  //             </MDTypography>
  //           );
  //         }
  //     }
  //   })
  //   ltpArr.push(ltpObj);
  // })

  // const newRows = rows.concat(ltpArr);
  //console.log("row", rows, ltpArr, newRows)

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

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Mismatch Details
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <CheckCircleIcon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
            
            </CheckCircleIcon>
            <MDTypography variant="button" fontWeight="regular" color="success">
              {/* &nbsp;<strong>{isAppLive ? "System Live" : "System Offline"}</strong> */}
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

export default MismatchDetails;


