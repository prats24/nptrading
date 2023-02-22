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
import {useState, useContext} from "react";
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid"

const TradingARTokenModel = ({Render}) => {
  const {reRender, setReRender} = Render
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let generatedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModified = generatedOn;
  let createdBy = getDetails.userDetails.name

  const [formstate, setformstate] = useState({
      AccountID: "",
      AccesToken: "",
      RequestToken: "",
      Status: ""
  });

  async function formbtn() {
      setformstate(formstate);
      setOpen(false);

      const { AccountID, AccesToken, RequestToken, Status } = formstate;

      const res = await fetch(`${baseUrl}api/v1/requestToken`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              accountId: AccountID, accessToken: AccesToken, requestToken: RequestToken, status: Status, uId, createdBy, generatedOn, lastModified
          })
      });

      const data = await res.json();
      console.log(data);
      if (data.status === 422 || data.error || !data) {
          window.alert(data.error);
          console.log("invalid entry");
      } else {
          window.alert("entry succesfull");
          console.log("entry succesfull");
      }
      reRender ? setReRender(false) : setReRender(true)
  }

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Generate Access & Request Token
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
              id="outlined-basic" label="Account ID" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.AccountID = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Access Token" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.AccesToken = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Request Token" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{ formstate.RequestToken = e.target.value}}/>

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

export default TradingARTokenModel