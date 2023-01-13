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
import MDButton from '../../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid";
// import axios from "axios"


const MapUser = () => {
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

  const [reRender, setReRender] = useState(true);

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
        headers: {
             Accept: "application/json",
            "Content-Type": "application/json",
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


    // setOpen(false);
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
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formData.transaction = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
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