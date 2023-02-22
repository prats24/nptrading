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
import { userContext } from '../../../AuthContext';
// import UserList from "./UserList"
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Data from "../data/TradeSwitchData";
import DataTable from "../../../examples/Tables/DataTable";
import Switch from "@mui/material/Switch";
import MapUsersIcon from '@mui/icons-material/GroupAddSharp';
import MockRealSwitch from "./MockRealSwitch";




// import axios from "axios"


const TradeSwitchButton = ({tradeData, props}) => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  
  const { columns, rows } = Data();

  let date = new Date();
  const getDetails = useContext(userContext);
  let modifiedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let modifiedBy = getDetails.userDetails.name;


  
  const [reRender, setReRender] = useState(true);
  const [permissionData, setPermissionData] = useState([]);
  
  const [addUser, setAddUser] = useState([]);

  console.log("permissionData", permissionData)


  tradeData.sort((a,b)=>{
    if(a.name > b.name){
        return 1;
    }
    else if(a.name < b.name){
        return -1;
    }
    else{
        return 0
    }

  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


tradeData.map((elem)=>{

    let obj = {};
    let tradercolor = ((elem.totalPnl)-(elem.brokerage)) >= 0 ? "success" : "error"
    let gpnlcolor = (elem.totalPnl) >= 0 ? "success" : "error"
    let runninglotscolor = elem.runninglots > 0 ? "info" : (elem.runninglots < 0 ? "error" : "dark")
    let traderbackgroundcolor = elem.runninglots != 0 ? "white" : "#e0e1e5"
    let runninglotsbgcolor = elem.runninglots > 0 ? "#ffff00" : ""

    obj.traderName = (
        <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
          {(elem.name)}
        </MDTypography>
      );

      obj.runningLots = (
        <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
          {elem.runninglots}
        </MDTypography>
      );

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {(elem.totalPnl) > 0.00 ? "+₹" + ((elem.totalPnl).toFixed(2)): "-₹" + (-elem.totalPnl).toFixed(2)}
        </MDTypography>
      );

      obj.realOrMock = (
        <MockRealSwitch props={props} userId={elem.userId} algoName={elem.algoName}/>
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



              {/* <UserList reRender={reRender} algoName={algoName} addUser={addUser} setAddUser={setAddUser} setPermissionData={setPermissionData}/> */}



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
                                        entriesPerPage={true}
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

export default TradeSwitchButton