import * as React from 'react';
import {useState, useContext, useEffect} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import uniqid from "uniqid";
import {userContext} from "../../AuthContext"


const CategoryModel = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
// id, sub-catgry, catagry, createdon, createdby, lastmodon, lastmodby, isCatagry, 
//          3         2                                                     1
// if isCatagry true then disable sub-catgery
  const [checkIsCategory, setCheckIsCategory] = useState(false);
  const [formstate, setformstate] = useState({
    isCategory : "",
    category : "",
    sub_category : "",
  });

  function isCategory(e){
    formstate.isCategory = e.target.value;
    setCheckIsCategory(e.target.value);
    setformstate(formstate)
  }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  let lastmodifiedOn = createdOn;
  let created_by = getDetails.userDetails.name
  let lastmodified_by = created_by;

  const [reRender, setReRender] = useState(true);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    const { isCategory, category, sub_category } = formstate;

    const res = await fetch(`${baseUrl}api/v1/category`, {
      
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          isCategory, category, sub_category, created_by, createdOn, lastmodified_by, lastmodifiedOn, uId
        })
    });


    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("Category Created Successfully");
        console.log("Category Entry Succesfull");
    }
    setOpen(false);
    reRender ? setReRender(false) : setReRender(true)

  }

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Category
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
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Is Category</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Is Category"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{isCategory(e)}}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>

            {/* {!formstate.isCategory ? */}
            <TextField
              id="outlined-basic" label="Sub Category" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.sub_category = e.target.value}} />
            {/* : <TextField />} */}

            <TextField
              id="outlined-basic" label="Category" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.category = e.target.value}} />

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

export default CategoryModel;