import * as React from 'react';
import {useState, useContext} from "react"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { userContext } from '../../AuthContext';
import uniqid from "uniqid";
// import axios from "axios"


const TradingAlgoModel = ({Render}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  let [formData, setFormData] = useState({
    algoName: "",
    transaction: "",
    instrument: "",
    exchange: "",
    product: "",
    lotMultiplier: "",
    accountName: "",
    status: ""

  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  let lastModified = createdOn;
  let createdBy = getDetails.userDetails.name

  const {reRender, setReRender} = Render;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formSubmit = async () => {
    
    setFormData(formData);
    console.log(formData)

    const {algoName, transaction, instrument, exchange, product, lotMultiplier, accountName, status} = formData;

    const res = await fetch(`${baseUrl}api/v1/tradingalgo`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          algoName: algoName, transactionChange: transaction, instrumentChange: instrument, status, exchangeChange: exchange, 
          lotMultipler: lotMultiplier, productChange: product, tradingAccount: accountName, lastModified, uId, createdBy, 
          createdOn, realTrade:false, marginDeduction: false
        })
    });
    
    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){
        window.alert(data.error);
        console.log("invalid entry");
    }else{
        window.alert("entry succesfull");
        console.log("entry succesfull");
    }
    reRender ? setReRender(false) : setReRender(true)


    setOpen(false);
  };

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Trading Alog
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic" label="Algo Name" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.algoName = e.target.value}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Transaction</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Transaction"
                // value={formData.transaction}
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formData.transaction = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Instrument</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Instrument"
                // value={formData.instrument}
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formData.instrument = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Exchange</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Exchange"
                // value={formData.exchange}
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formData.exchange = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Product</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Product"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                // value={formData.product}
                onChange={(e)=>{formData.product = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="outlined-basic" label="Multipler" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.lotMultiplier = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Trading Account" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.accountName = e.target.value}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formData.status = e.target.value}}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formSubmit}>
            OK
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TradingAlgoModel