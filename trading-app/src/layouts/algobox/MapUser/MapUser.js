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

  async function tradeEnableChange(e, userId){
    // valueForEnableTrade = undefined;
    // setvalueForEnableTrade(e.target.value);
    // valueForEnableTrade.current = e.target.value
    algoData.tradingEnable = e.target.value
    console.log("in enable", valueForEnableTrade, e.target.value, e, userId)
    const response = await fetch(`${baseUrl}api/v1/updatetradeenable/${userId}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            modifiedOn, modifiedBy, isTradeEnable:e.target.value
        })
    });

    const permissionData = await response.json();

    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
        //console.log("Failed to Edit");
    }else {
        window.alert("Edit succesfull");
    }
    reRender ? setReRender(false) : setReRender(true)

  }

  async function realTradeChange(e, userId){
    // valueForRealTrade = undefined;

    // setvalueForRealTrade(e.target.value)
    algoData.realTrading = e.target.value;
    console.log("in real", valueForRealTrade, e.target.value, e, userId)
    const response = await fetch(`${baseUrl}api/v1/updaterealtradeenable/${userId}`, {
      method: "PATCH",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
          modifiedOn, modifiedBy, isRealTradeEnable:e.target.value
      })
    });

    const permissionData = await response.json();

    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
        //console.log("Failed to Edit");
    }else {
        window.alert("Edit succesfull");
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

  //console.log("newData", newData)
  newData.map((elem)=>{
    if(valueForEnableTrade === "" && valueForRealTrade === ""){
      setvalueForEnableTrade(elem.isTradeEnable);
      setvalueForRealTrade(elem.isRealTradeEnable)
    }

    console.log(valueForEnableTrade, valueForRealTrade)
    let obj = {};
    obj.name = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
          {elem.userName}
        </MDTypography>
    );

    if(elem.isTradeEnable){
      obj.tradeEnable = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel  id="demo-simple-select-standard-label">Trading Enable</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Trading Enable"
                  sx={{ margin: 1, padding: 1, width: "50px" }}
                  onChange={(e)=>{tradeEnableChange(e, elem.userId)}}
                  // {elem.isTradeEnable && 
                  value={elem.isTradeEnable}
                  // value={disable}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
        </MDTypography>
      ); 

    } else {
      obj.tradeEnable = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel  id="demo-simple-select-standard-label">Trading Enable</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Trading Enable"
                  sx={{ margin: 1, padding: 1, width: "50px" }}
                  onChange={(e)=>{tradeEnableChange(e, elem.userId)}}
                  // {elem.isTradeEnable && 
                  // value={elem.isTradeEnable}
                  // value={disable}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
        </MDTypography>
      ); 

    }

    if(elem.isRealTradeEnable){
      obj.realTrade = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Real Trading</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Real Trading"
                  sx={{ margin: 1, padding: 1, width: "50px" }}
                  onChange={(e)=>{realTradeChange(e, elem.userId)}}
                  value={elem.isRealTradeEnable}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
        </MDTypography>
      );
    } else{
      obj.realTrade = (
        <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Real Trading</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Real Trading"
                  sx={{ margin: 1, padding: 1, width: "50px" }}
                  onChange={(e)=>{realTradeChange(e, elem.userId)}}
                  // value={elem.isRealTradeEnable}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
        </MDTypography>
      );

    }



    // obj.realTrade = (
    //   <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
    //         <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
    //           <InputLabel id="demo-simple-select-standard-label">Real Trading</InputLabel>
    //           <Select
    //             labelId="demo-simple-select-standard-label"
    //             id="demo-simple-select-standard"
    //             label="Real Trading"
    //             sx={{ margin: 1, padding: 1, width: "50px" }}
    //             onChange={(e)=>{realTradeChange(e, elem.userId)}}
    //             value={elem.isRealTradeEnable}
    //           >
    //             <MenuItem value="true">True</MenuItem>
    //             <MenuItem value="false">False</MenuItem>
    //           </Select>
    //         </FormControl>
    //   </MDTypography>
    // );

    obj.action = (
      <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
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

      <MDButton variant="outlined" bgColor="blue" onClick={handleClickOpen}>
        MapUser
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