import React, {useState, useContext, useRef} from "react"
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
import UserList from "./UserList"
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Data from "./MapUserData";
import DataTable from "../../../examples/Tables/DataTable";
import Switch from "@mui/material/Switch";
import MapUsersIcon from '@mui/icons-material/GroupAddSharp';




// import axios from "axios"


const MapUser = ({algoName}) => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  
  const { columns, rows } = Data();
  // let valueForRealTrade = useRef(0);
  // let valueForEnableTrade = useRef(0);
  const [valueForEnableTrade, setvalueForEnableTrade] = useState("");
  const [valueForRealTrade, setvalueForRealTrade] = useState("");

  let date = new Date();
  const getDetails = useContext(userContext);
  let modifiedOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  let modifiedBy = getDetails.userDetails.name;

  const [userNam, setUserNam] = useState();
  const [entrading, setEntrading] = useState();
  const [reTrading, setreTrading] = useState();


  
  const [reRender, setReRender] = useState(true);
  const [permissionData, setPermissionData] = useState([]);
  //console.log(permissionData);
  
  const [modal, setModal] = useState(false);
  const [addUser, setAddUser] = useState([]);

  async function tradeEnableChange(e, userId, tradeEnable, userName){

    if(tradeEnable !== undefined){
      if(tradeEnable){
        tradeEnable = false;
      } else{
        tradeEnable = true;
      }
      algoData.tradingEnable = tradeEnable
      // console.log("in enable", valueForEnableTrade, tradeEnable, e, userId)
      const response = await fetch(`${baseUrl}api/v1/updatetradeenable/${userId}`, {
          method: "PATCH",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              modifiedOn, modifiedBy, isTradeEnable: tradeEnable
          })
      });

      const permissionData = await response.json();

      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
          //console.log("Failed to Edit");
      }else {
          if(tradeEnable){
            window.alert(`Trade is enabled for ${userName}`);
          } else{
            window.alert(`Trade is disabled for ${userName}`);
          }
          
      }
    } else{
      console.log("tradeEnable", tradeEnable,e)
      if(algoData.tradingEnable){
        tradeEnable = false;
      } else{
        tradeEnable = true;
      }
      algoData.tradingEnable = tradeEnable
      setAlgoData(algoData)
    }
    reRender ? setReRender(false) : setReRender(true)

  }

  async function realTradeChange(e, userId, realTrade, userName){
    console.log(userId, realTrade)
    if(realTrade !== undefined){
      if(realTrade){
        realTrade = false;
      } else{
        realTrade = true;
      }
      algoData.realTrading = realTrade;
    console.log("in real", valueForRealTrade, realTrade, e, userId)
    const response = await fetch(`${baseUrl}api/v1/updaterealtradeenable/${userId}`, {
      method: "PATCH",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
          modifiedOn, modifiedBy, isRealTradeEnable: realTrade
      })
    });

    const permissionData = await response.json();

    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
        //console.log("Failed to Edit");
    }else {
      if(realTrade){
        window.alert(`Real Trade is enabled for ${userName}`);
      } else{
        window.alert(`Real Trade is disabled for ${userName}`);
      }
    }

    } else{
      if(algoData.realTrading){
        realTrade = false;
      } else{
        realTrade = true;
      }
      algoData.realTrading = realTrade
      setAlgoData(algoData)
    }
    
    reRender ? setReRender(false) : setReRender(true)

  }

  let permissionDataUpdated = permissionData.filter((elem)=>{
      return elem.algoName === algoName;
  })

  let newData = [];
  //console.log("addUser", addUser, "permissionDataUpdated", permissionDataUpdated);
  if(addUser.length !== 0 && permissionDataUpdated.length !== 0){
    for(let i = 0; i < addUser.length; i++){
      for(let j = 0; j < permissionDataUpdated.length; j++){
          if(addUser[i].userId === permissionDataUpdated[j].userId){
              addUser.splice(i, 1);
              j = -1;
          }
      }
    }

    newData = addUser.concat(permissionDataUpdated);

  } else{
    newData = addUser.concat(permissionDataUpdated);
  }
  //console.log("this is add usere", newData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const[algoData, setAlgoData] = useState({
      name:"",
      tradingEnable: false,
      realTrading: false,
  });

  function formbtn(e, id) {
      e.preventDefault();
      // setModal(!modal);
      let flag = true;
      let newDataUpdated = newData.filter((elem)=>{
          return elem._id === id
      })
      algoData.name=newDataUpdated[0].userName;
      setEntrading(algoData.tradingEnable);
      setreTrading(algoData.realTrading)
      setAlgoData(algoData);
      //console.log(algoData, newDataUpdated);

      if(permissionDataUpdated.length){
          for(let elem of permissionDataUpdated){
              if(elem.userId === newDataUpdated[0].userId){
                  //console.log("put request");
                  patchReq(id);
                  flag = false;
              }
          }
          if(flag){
              //console.log("post request");
              postReq(newDataUpdated);
          }
      } else{
          //console.log("post request");
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
          //console.log("Failed to Delete");
      }else {
          //console.log(permissionData);
          window.alert("Delete succesfull");
          //console.log("Delete succesfull");
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
          //console.log("invalid entry");
      }else{
          // window.alert("entry succesfull");
          //console.log("entry succesfull");
      }
  }

  async function patchReq(id){
      const {name, tradingEnable, realTrading} = algoData;
      //console.log("algoData", algoData);
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
          //console.log("Failed to Edit");
      }else {
          //console.log(permissionData);
          window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }
  }

  newData.map((elem)=>{

    console.log(elem.isTradeEnable, valueForRealTrade)
    let obj = {};
    obj.name = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
          {elem.userName}
        </MDTypography>
    );

    if(elem.isTradeEnable !== undefined){
      obj.tradeEnable = (

        <MDBox mt={0.5}>
          <Switch checked={elem.isTradeEnable} onChange={(e) => {tradeEnableChange(e, elem.userId, elem.isTradeEnable, elem.userName)}} />
        </MDBox>
      ); 

    } else {
      obj.tradeEnable = (

        <MDBox mt={0.5}>
          <Switch checked={algoData.tradingEnable} onChange={(e) => {tradeEnableChange(e, elem.userId, elem.isTradeEnable, elem.userName)}} />
        </MDBox>
      ); 

    }

    if(elem.isRealTradeEnable !== undefined){
      obj.realTrade = (

          <MDBox mt={0.5}>
            <Switch checked={elem.isRealTradeEnable} onChange={(e) => {realTradeChange(e, elem.userId, elem.isRealTradeEnable, elem.userName)}} />
          </MDBox>
      );
    } else{
      obj.realTrade = (
        <MDBox mt={0.5}>
            <Switch checked={algoData.realTrading} onChange={(e)=>{realTradeChange(e, elem.userId, elem.isRealTradeEnable, elem.userName)}} />
        </MDBox>
      );

    }

    obj.action = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
          <MDButton variant="outlined" color="info" onClick={(e)=>formbtn(e, elem._id)}>
            OK
          </MDButton>
          <MDButton variant="outlined" color="info" sx={{ marginLeft: 1 }} onClick={(e)=>deletehandler((elem._id))}>🗑️
          </MDButton>
      </MDTypography>
    );

    rows.push(obj)
  })


  return (
    <div>

      <Button variant="" color="black" onClick={handleClickOpen}>
        <MapUsersIcon/>
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



              <UserList reRender={reRender} algoName={algoName} addUser={addUser} setAddUser={setAddUser} setPermissionData={setPermissionData}/>



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
          {/* <Button autoFocus onClick={formSubmit}>
            OK
          </Button> */}
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MapUser