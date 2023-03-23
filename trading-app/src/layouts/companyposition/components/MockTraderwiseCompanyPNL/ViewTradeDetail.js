import {useState, useEffect} from "react"
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ViewTradeDetailData from "./ViewTradeDetailData";

 
// Data
// import data from "./data";


function ViewTradeDetail({userId, socket}) {
  const {columns, rows} = ViewTradeDetailData();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [menu, setMenu] = useState(null);

  const closeMenu = () => setMenu(null);


  const handleClickOpen = () => {

    setOpen(true);

  }; 

  const handleClose = (e) => {
    setOpen(false);
  };



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [liveDetail, setLiveDetail] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);

  let liveDetailsArr = [];
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;


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

      axios.get(`${baseUrl}api/v1/getoverallpnlmocktradeparticularusertodaycompanyside/${userId}`)
      .then((res) => {
          setTradeData(res.data);
          res.data.map((elem)=>{
            marketData.map((subElem)=>{
                if(subElem !== undefined && subElem.instrument_token == elem._id.instrumentToken){
                    liveDetailsArr.push(subElem)
                }
            })
          })

        setLiveDetail(liveDetailsArr);

                 

      }).catch((err) => {
          return new Error(err);
      })


    }, [marketData])


    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])

    tradeData.map((elem)=>{
        totalTransactionCost += Number(elem.brokerage);
    })

    tradeData.map((subelem, index)=>{
      let obj = {};
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[index]?.last_price);
      totalGrossPnl += updatedValue;

      const instrumentcolor = subelem._id.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[index]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem._id.product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem._id.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem.lots}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹"+subelem.lastaverageprice.toFixed(2)}
        </MDTypography>
      );

      if((liveDetail[index]?.last_price)){
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price).toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[index]?.change)){
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[index]?.change).toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%"}
          </MDTypography>
        );
      }
      
      rows.push(obj);
    })


    let obj = {};

    const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
    const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

    obj.symbol = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
       {}
      </MDTypography>
    );
  
    obj.Quantity = (
      <MDTypography component="a" variant="caption" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Running Lots : {totalRunningLots}
      </MDTypography>
    );
  
    obj.avgPrice = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
       {}
      </MDTypography>
    );
  
    obj.last_price = (
      <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}
      </MDTypography>
    );
  
  
    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
       Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
      </MDTypography>
    );
  
    obj.change = (
      <MDTypography component="a" variant="caption" color={totalnetPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
      </MDTypography>
    );
    
  
    rows.push(obj);
  

return (
  <div>


  <Button variant="" color="black" onClick={handleClickOpen} width="10px">
      <RemoveRedEyeIcon/>
  </Button>
  <div>
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
        {"Regular"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, width: "500px" }}>

          <MDBox>
            <DataTable
              table={{ columns, rows }}
              showTotalEntries={false}
              isSorted={false}
              noEndBorder
            />
          </MDBox>

        </DialogContentText>
      </DialogContent>

    </Dialog>
  </div >

</div >
);

}
export default ViewTradeDetail;
