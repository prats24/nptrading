
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
import EditSharpIcon from '@mui/icons-material/EditSharp';
import {useEffect, useState} from "react"


const  AccountEditModel = ({ data, id, Render }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let date = new Date();
  let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  const { reRender, setReRender } = Render;
  const [editData, setEditData] = useState(data);

  const [broker, setbroker] = useState();
  const [accountId, setAccountId] = useState();
  const [accountName, setAccountName] = useState();
  const [apiKey, setApiKey] = useState();
  const [apiSecret, setApiSecret] = useState();
  const [status, setStatus] = useState();
 
  useEffect(() => {
      let updatedData = data.filter((elem) => {
          return elem._id === id
      })
      setEditData(updatedData)
  }, [reRender])

  useEffect(() => {
      console.log("edit data", editData);

      setbroker(editData[0].brokerName)
      setAccountId(editData[0].accountId);
      setAccountName(editData[0].accountName);
      setApiKey(editData[0].apiKey);
      setApiSecret(editData[0].apiSecret);
      setStatus(editData[0].status);

  }, [editData, reRender])

  const [formstate, setformstate] = useState({
      Broker: "",
      AccountID : "",
      AccountName : "",
      APIKey : "",
      APISecret : "",
      Status:""
  });

  async function formbtn(e) {
      formstate.Broker = broker;
      formstate.AccountID = accountId;
      formstate.AccountName = accountName;
      formstate.APIKey = apiKey;
      formstate.APISecret = apiSecret;
      formstate.Status = status;

      setformstate(formstate);
      

      const { Broker, AccountID, AccountName, APIKey, APISecret, Status} = formstate;

      const res = await fetch(`${baseUrl}api/v1/readAccountDetails/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              Broker, AccountID, AccountName, APIKey, APISecret, Status, lastModified
          })
      });
      const dataResp = await res.json();
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          console.log("Failed to Edit");
      } else {
          console.log(dataResp);
          window.alert("Edit succesfull");
          console.log("Edit succesfull");
      }
      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }

  async function Ondelete() {
      console.log(editData)
      const res = await fetch(`${baseUrl}api/v1/readAccountDetails/${id}`, {
          method: "DELETE",
      });

      const dataResp = await res.json();
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          console.log("Failed to Delete");
      } else {
          console.log(dataResp);
          window.alert("Delete succesfull");
          console.log("Delete succesfull");
      }
      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }


  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        <EditSharpIcon/>
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
              id="outlined-basic" label="Broker" variant="standard" value={broker}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setbroker( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Account ID" variant="standard" value={accountId} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setAccountId( e.target.value)}} />
            

            <TextField
              id="outlined-basic" label="Acccount Name" variant="standard" value={accountName}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setAccountName( e.target.value)}} />

            
            <TextField
              id="outlined-basic" label="API Key" variant="standard" value={apiKey} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setApiKey( e.target.value)}} />

            <TextField
              id="outlined-basic" label="API Secret" variant="standard" value={apiSecret} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setApiSecret( e.target.value)}} />

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }} 
                onChange={(e)=>{setStatus( e.target.value)}}
                value={status} 
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
          <Button onClick={Ondelete} autoFocus>
            DELETE
          </Button>
          <Button onClick={handleClose} autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default  AccountEditModel