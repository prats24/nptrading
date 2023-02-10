import * as React from 'react';
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
import {useContext, useState, useEffect} from "react";
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid";

const AccountsModel = ({Render}) => {
  const {reRender, setReRender} = Render;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const getDetails = useContext(userContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(()=>{

  }, [reRender])

  const handleClose = () => {
    setOpen(false);
  };

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let uId = uniqid();
  let date = new Date();
  let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModified = createdOn;
  let createdBy = getDetails.userDetails.name;

  const[formstate, setformstate] = useState({
      Broker: "",
      AccountID : "",
      AccountName : "",
      APIKey : "",
      APISecret : "",
      Status:""
  });

  async function formbtn(){
      setformstate(formstate);
      console.log(formstate)
      const {AccountID, Broker, AccountName, APIKey, APISecret, Status} = formstate;

      const res = await fetch(`${baseUrl}api/v1/account`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              accountId:AccountID, accountName:AccountName, apiKey:APIKey, apiSecret:APISecret, status:Status, brokerName:Broker, uId, createdBy, createdOn, lastModified
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
  }

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Add Company Trading Account
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
              id="outlined-basic" label="Broker" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.Broker = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Account ID" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.AccountID = e.target.value}}/>
            

            <TextField
              id="outlined-basic" label="Acccount Name" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.AccountName = e.target.value}}/>

            
            <TextField
              id="outlined-basic" label="API Key" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.APIKey = e.target.value}}/>

            <TextField
              id="outlined-basic" label="API Secret" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.APISecret = e.target.value}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{ formstate.Status = e.target.value}}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formbtn}>
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

export default AccountsModel