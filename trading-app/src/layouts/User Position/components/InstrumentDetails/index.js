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
import BuyModel from "./data/BuyModel";
import SellModel from "./data/SellModel";

function InstrumentDetails({socket, Render}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { reRender, setReRender } = Render;
  const { columns, rows, instrumentData } = data();
  const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [isAppLive, setisAppLive] = useState('');


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

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`)
      .then((res) => {
        setisAppLive(res.data[0].isAppLive);
      });
  }, []);

  //console.log("marketData", marketData)
  let ltpArr = [];
  
  rows.map((elem)=>{
    let ltpObj = {};
    let pericularInstrument = instrumentData.filter((element)=>{
      return elem.instrumentToken.props.children == element.instrumentToken
    })
    marketData.map((subelem)=>{
      const percentagechangecolor = subelem.change >= 0 ? "success" : "error"
      const percentagechangecolor1 = (((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "success" : "error"
      if(elem.instrumentToken.props.children === subelem.instrument_token){
        elem.last_price = (
            <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
              {"₹"+(subelem.last_price).toFixed(2)}
            </MDTypography>
          );
          if(subelem.change){
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
                {subelem.change >= 0 ? "+" + ((subelem.change).toFixed(2))+"%" : ((subelem.change).toFixed(2))+"%"}
              </MDTypography>
            );
          } else{
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
                {(((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "+" + (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%" : (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%"}
              </MDTypography>
            );
          }

          elem.buy = (
            <BuyModel Render={{ reRender, setReRender }} symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/>
          );
          
          elem.sell = (
            <SellModel symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/>
          );

      }
    })
    ltpArr.push(ltpObj);
  })

  const newRows = rows.concat(ltpArr);
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
            Instrument Details
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
            <MDTypography variant="button" fontWeight="regular" color={isAppLive ? "success" : "error"}>
              &nbsp;<strong>{isAppLive ? "System Live" : "System Offline"}</strong>
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

export default InstrumentDetails;


