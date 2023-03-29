import * as React from 'react';
import {useContext, useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Tooltip } from '@mui/material';
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import {userContext} from "../../AuthContext";



function Index({createIndexForm, setCreateIndexForm}) {
    console.log("Create Index Form")
    const [isSubmitted,setIsSubmitted] = useState(false);
    const [formState,setFormState] = React.useState(
        {
          displayName:'',
          instrumentSymbol: '',
          exchange: '',
          status: '',
          createdBy: '',
          lastModifiedBy: '',
        })
    
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const getDetails = useContext(userContext);
    formState.createdBy = getDetails.userDetails._id
    formState.lastModifiedBy = getDetails.userDetails._id

    async function onSubmit(formState){

        console.log(formState)
        const { displayName, instrumentSymbol, exchange, status, createdBy, lastModifiedBy } = formState;

        const res = await fetch(`${baseUrl}api/v1/stockindex`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                displayName, instrumentSymbol, exchange, status, createdBy, lastModifiedBy
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
      }


    return (

    <MDBox pl={2} pr={2} mt={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Index Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={isSubmitted}
                id="outlined-required"
                label="Display Name"
                defaultValue=""
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    displayName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={isSubmitted}
                id="outlined-required"
                label="Instrument Symbol"
                defaultValue=""
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    instrumentSymbol: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={isSubmitted}
                id="outlined-required"
                label="Exchange"
                defaultValue=""
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    exchange: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={isSubmitted}
                id="outlined-required"
                label="Status"
                defaultValue=""
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                  }))}}
              />
          </Grid>

          {/* <Grid item xs={12} md={6} xl={3}></Grid>
          <Grid item xs={12} md={6} xl={3}></Grid>
          <Grid item xs={12} md={6} xl={3}></Grid> */}

          <Grid item display={"flex"} justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} onClick={()=>{onSubmit(formState);setIsSubmitted(true)}}>
                    Create
                </MDButton>
                <MDButton variant="contained" color="error" size="small" onClick={()=>{setCreateIndexForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {isSubmitted && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setCreateIndexForm(false)}}>
                    Edit
                </MDButton>
                <MDButton variant="contained" color="error" size="small" onClick={()=>{setCreateIndexForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
          </Grid>
            
          </Grid>
    </MDBox>
    )
}
export default Index;