import * as React from 'react';
import {useState, useEffect} from "react";
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



const TradingARTokenEditModel = ({data, id, Render}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"

  let date = new Date();
  let lastModified = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

  const { reRender, setReRender } = Render;
  const [editData, setEditData] = useState(data);

  const [accountId, setaccountId] = useState();
  const [accessToken, setaccessToken] = useState();
  const [requestToken, setRequestToken] = useState();
  const [status, setStatus] = useState();
 
  useEffect(() => {
      let updatedData = data.filter((elem) => {
          return elem._id === id
      })
      setEditData(updatedData)
  }, [])

  useEffect(() => {
      setaccountId(editData[0].accountId)
      setaccessToken(editData[0].accessToken);
      setRequestToken(editData[0].requestToken);
      setStatus(editData[0].status);

  }, [editData, reRender])
  const [formstate, setformstate] = useState({
      AccountID: "",
      AccesToken: "",
      RequestToken: "",
      Status: ""
  });

  //console.log(formstate);


  async function formbtn() {

      formstate.AccountID = accountId;
      formstate.AccesToken = accessToken;
      formstate.RequestToken = requestToken;
      formstate.Status = status;
       
      setformstate(formstate);


      const { AccountID, AccesToken, RequestToken, Status} = formstate;
                                      
      const res = await fetch(`${baseUrl}api/v1/readRequestToken/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              AccountID, AccesToken, RequestToken, Status, lastModified
          })
      });
      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Edit");
      } else {
          //console.log(dataResp);
          window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }
       
      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }

  async function Ondelete() {
      //console.log(editData)
      const res = await fetch(`${baseUrl}api/v1/readRequestToken/${id}`, {
          method: "DELETE",
      });

      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Delete");
      } else {
          //console.log(dataResp);
          window.alert("Delete succesfull");
          //console.log("Delete succesfull");
      }

      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }




  return (
    <div>
      <MDButton variant="outlined" color="info" onClick={handleClickOpen}>
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
              id="outlined-basic" label="Account ID" variant="standard" value={accountId}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setaccountId( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Access Token" variant="standard" value={accessToken}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setaccessToken( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Request Token" variant="standard" value={requestToken}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setRequestToken( e.target.value)}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                value={status}
                onChange={(e)=>{setStatus( e.target.value)}}
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

export default TradingARTokenEditModel