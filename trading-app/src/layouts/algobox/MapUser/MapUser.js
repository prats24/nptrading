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

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  let date = new Date();
  const getDetails = useContext(userContext);
  let modifiedOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  let modifiedBy = getDetails.userDetails.name;

  const [userNam, setUserNam] = useState();
  const [entrading, setEntrading] = useState();
  const [reTrading, setreTrading] = useState();


  
  const [reRender, setReRender] = useState(true);
  const [permissionData, setPermissionData] = useState([]);
  console.log(permissionData);
  
  const [modal, setModal] = useState(false);
  const [addUser, setAddUser] = useState([]);

  let permissionDataUpdated = permissionData.filter((elem)=>{
      return elem.algoName === algoName;
  })

  console.log("addUser", addUser, "permissionDataUpdated", permissionDataUpdated, permissionData);
  let newData = addUser.concat(permissionDataUpdated);
  console.log("this is add usere", newData);

  const[algoData, setAlgoData] = useState({
      name:"",
      tradingEnable:"",
      realTrading:"",
  });

  function formbtn(e, id) {
      e.preventDefault();
      // setModal(!modal);
      let flag = true;
      let newDataUpdated = newData.filter((elem)=>{
          return elem._id === id
      })
      algoData.name=newDataUpdated[0].userName;
      algoData.tradingEnable = entrading;
      algoData.realTrading = reTrading;
      setAlgoData(algoData);
      console.log(algoData, newDataUpdated);

      if(permissionDataUpdated.length){
          for(let elem of permissionDataUpdated){
              if(elem.userId === newDataUpdated[0].userId){
                  console.log("put request");
                  patchReq(id);
                  flag = false;
              }
          }
          if(flag){
              console.log("post request");
              postReq(newDataUpdated);
          }
      } else{
          console.log("post request");
          postReq(newDataUpdated);
      }

      setAddUser([]);
      reRender ? setReRender(false) : setReRender(true)
  }

  async function deletehandler(id){
      const response = await fetch(`${baseUrl}api/v1/readpermission/${id}`, {
          method: "DELETE",
      });
      const permissionData = await response.json();

      if(permissionData.status === 422 || permissionData.error || !permissionData){
          window.alert(permissionData.error);
          console.log("Failed to Delete");
      }else {
          console.log(permissionData);
          window.alert("Delete succesfull");
          console.log("Delete succesfull");
      }

      reRender ? setReRender(false) : setReRender(true)
  }

  async function postReq(newDataUpdated){
      const {name, tradingEnable, realTrading} = algoData;
      const {userId} = newDataUpdated[0];
      const response = await fetch(`${baseUrl}api/v1/permission`, {
          method: "POST",
          headers: {
              "content-type" : "application/json"
          },
          body: JSON.stringify({
            modifiedOn, modifiedBy, userName:name, userId, 
            isTradeEnable:tradingEnable, isRealTradeEnable:realTrading, algoName
          })
      });

      const permissionData = await response.json();

      if(permissionData.status === 422 || permissionData.error || !permissionData){ 
          window.alert(permissionData.error);
          console.log("invalid entry");
      }else{
          // window.alert("entry succesfull");
          console.log("entry succesfull");
      }
  }

  async function patchReq(id){
      const {name, tradingEnable, realTrading} = algoData;
      console.log("algoData", algoData);
      const response = await fetch(`${baseUrl}api/v1/readpermissionadduser/${id}`, {
          method: "PATCH",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              modifiedOn, modifiedBy, isTradeEnable:tradingEnable, isRealTradeEnable:realTrading
          })
      });

      const permissionData = await response.json();

      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
          console.log("Failed to Edit");
      }else {
          console.log(permissionData);
          window.alert("Edit succesfull");
          console.log("Edit succesfull");
      }
  }


  newData.map(()=>{
    let obj = {};
    obj.name = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
          {elem.name}
        </MDTypography>
    );

    obj.tradeEnable = (
      <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Trading Enable</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Trading Enable"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{algoData.tradingEnable = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>
      </MDTypography>
    ); 

    obj.realTrade = (
      <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Real Trading</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Real Trading"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{algoData.realTrading = e.target.value}}
              >
                <MenuItem value="TRUE">TRUE</MenuItem>
                <MenuItem value="FALSE">FALSE</MenuItem>
              </Select>
            </FormControl>
      </MDTypography>
    );

    obj.action = (
      <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
          <MDButton variant="outlined" onClick={(e)=>formbtn(e, elem._id)}>
            OK
          </MDButton>
          <MDButton variant="outlined" onClick={(e)=>deletehandler((elem._id))}>🗑️
          </MDButton>
      </MDTypography>
    );

  })


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






                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={1}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                      }}>

                                    <MDTypography variant="h6" color="white" py={2.5}>
                                        Active Instruments
                                    </MDTypography>
                                    <TradingAlgoModel/>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid> 
                </MDBox> 

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

export default MapUser