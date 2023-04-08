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
import {useState, useContext, useEffect} from "react";
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid"
import axios from "axios";
import LoginIcon from '@mui/icons-material/Login';

const AutoLogin = ({data}) => {
  // const {reRender, setReRender} = Render
  // const [open, setOpen] = React.useState(false);
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let generatedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModified = generatedOn;
  let createdBy = getDetails.userDetails.name

  // const [activeApiKey, setActiveApiKey] = useState([]);
  // const [formstate, setformstate] = useState({
  //     AccountID: "",
  // });
  const [accessAndRequest, setAccessAndRequest] = useState([])

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/readRequestToken`)
    .then((res)=>{
      let data = res.data;
      let active = data.filter((elem) => {
          return elem.status === "Active" && elem.generatedOn !== generatedOn;
      })
      setAccessAndRequest(active);

    }).catch((err)=>{
        return new Error(err);
    })
  }, [])

  // let optionData = [];
  // for(let i =0; i< activeApiKey.length; i++){
  //     optionData.push( <MenuItem value={activeApiKey[i].accountId}>{activeApiKey[i].accountId}</MenuItem>)      
  // }

  // console.log("option data", optionData, activeApiKey)

  async function formbtn() {

      const res = await fetch(`${baseUrl}api/v1/autologin`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              accountId: data.accountId, apiKey: data.apiKey, apiSecret: data.apiSecret, status: "Active", uId, createdBy, generatedOn, lastModified
          })
      });

      const resp = await res.json();
      console.log(resp);
      if (resp.status === 422 || resp.error || !resp) {
          window.alert(resp.error);
          console.log("invalid entry");
      } else {
          window.alert("entry succesfull");
          console.log("entry succesfull");
      }

      console.log("accessAndRequest", accessAndRequest)

      accessAndRequest.map(async (elem)=>{

        const res2 = await fetch(`${baseUrl}api/v1/inactiveRequestToken/${elem._id}`, {
          method: "PATCH",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              lastModified, status: "Inactive"
          })
        });
  
        const data2 = await res2.json();
        console.log(data2);
        if (data2.status === 422 || data2.error || !data2) {
            window.alert("Error in inactivating access token");
            console.log("invalid entry");
        } else {
            // window.alert("Inactive succesfull");
            console.log("entry succesfull");
        }

      })

      // reRender ? setReRender(false) : setReRender(true)
  }

  return (
    <>
      <MDButton variant="" color="black"  onClick={formbtn}>
        <LoginIcon />
      </MDButton>
      {/* <Dialog
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
            {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Select Account </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Select Account"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{ formstate.AccountID = e.target.value}}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl> */}

            {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                <InputLabel id="demo-simple-select-standard-label">Select Account </InputLabel>
                <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Select Account"
                onChange={(e) => { { formstate.AccountID = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, }}
                >
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="150">150</MenuItem>
                {optionData.map((elem)=>{
                    return(
                        <MenuItem value={elem.props.value}>
                        {elem.props.children}
                        </MenuItem>
                    )
                }) 
                }
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
      </Dialog>  */}
    </>
  );
}

export default AutoLogin