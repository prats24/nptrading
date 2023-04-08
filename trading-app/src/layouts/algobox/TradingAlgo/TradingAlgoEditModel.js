import * as React from 'react';
import {useState, useEffect} from "react"
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from "axios"


const TradingAlgoModel = ({ data, id, Render }) => {
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

  let date = new Date();
  let lastModified = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

  const { reRender, setReRender } = Render;
  const [editData, setEditData] = useState(data);

  const [algoName, setAlgoName] = useState();
  const [lotMultipler, setLotMultipler] = useState();
  const [tradingAccount, setTradingAccount] = useState();
  const [status, setStatus] = useState();

  const [mappedUser, setMappedUser] = useState([]);
 
  useEffect(() => {
      let updatedData = data.filter((elem) => {
          return elem._id === id
      })
      setEditData(updatedData)

      axios.get(`${baseUrl}api/v1/readpermission`)
      .then((res)=>{
          let mappedUserUpdate = (res.data).filter((elem)=>{
              //console.log(elem.algoName, updatedData[0].algoName);
              return elem.algoName === updatedData[0].algoName
          })
          setMappedUser(mappedUserUpdate);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  }, [])

  useEffect(() => {
      //console.log("edit data", editData);


      setAlgoName(editData[0].algoName)
      setLotMultipler(editData[0].lotMultipler);
      setTradingAccount(editData[0].tradingAccount);
      setStatus(editData[0].status);

  }, [editData, reRender])
  //console.log(editData, id);
  //console.log("mappedUser", mappedUser);

  const [formstate, setformstate] = useState({
      algo_Name: "",
      Status : "",
      lot_Multipler:"",
      trading_Account:""
  });

  //console.log(formstate);

  async function formbtn() {

      formstate.algo_Name = algoName;
      formstate.lot_Multipler = lotMultipler;
      formstate.trading_Account = tradingAccount;
      formstate.Status = status;

      setformstate(formstate);

      const {algo_Name, Status, lot_Multipler, trading_Account } = formstate;

      const res = await fetch(`${baseUrl}api/v1/readtradingAlgo/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            algo_Name, Status, lot_Multipler, trading_Account, lastModified
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

      mappedUser.map((elem)=>{
          patchReqMappedUser(elem._id, algo_Name);
      })

      reRender ? setReRender(false) : setReRender(true)
      setOpen(false);
  }

  async function Ondelete() {
      //console.log(editData)
      const res = await fetch(`${baseUrl}api/v1/readtradingAlgo/${id}`, {
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

      mappedUser.map((elem)=>{
          deleteReqMappedUser(elem._id);
      })

      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }

  async function patchReqMappedUser(id, algo_Name){
      
      const response = await fetch(`${baseUrl}api/v1/readpermissionalgo/${id}`, {
          method: "PATCH",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              algo_Name
          })
      });

      const permissionData = await response.json();

      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
          //console.log("Failed to Edit");
      }else {
          //console.log(permissionData);
          // window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }
  }

  async function deleteReqMappedUser(id){

      const response = await fetch(`${baseUrl}api/v1/readpermission/${id}`, {
          method: "DELETE",
      });
      const permissionData = await response.json();

      if(permissionData.status === 422 || permissionData.error || !permissionData){
          window.alert(permissionData.error);
          //console.log("Failed to Delete");
      }else {
          //console.log(permissionData);
          // window.alert("Delete succesfull");
          //console.log("Delete succesfull");
      }
  }






  return (
    <div>
      <Button variant="" color="black" onClick={handleClickOpen}>
        <EditSharpIcon/>
      </Button>
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
              id="outlined-basic" label="Algo Name" variant="standard" value={algoName}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setAlgoName( e.target.value)}}/>


            <TextField
              id="outlined-basic" label="Multipler" variant="standard" value={lotMultipler} type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setLotMultipler( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Trading Account" variant="standard" value={tradingAccount}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setTradingAccount( e.target.value)}}/>

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

export default TradingAlgoModel