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
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';



function Index({createIndexForm, setCreateIndexForm, id}) {
    // console.log("Create Index Form: ",createIndexForm,setCreateIndexForm,id)
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const getDetails = useContext(userContext);
    const [indexData,setIndexData] = useState([]);
    const [formState,setFormState] = useState();
    const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const [newObjectId,setNewObjectId] = useState()
    
    React.useEffect(()=>{

        axios.get(`${baseUrl}api/v1/stockindex/${id}`)
        .then((res)=>{
            setIndexData(res.data[0]);
            // console.log(res.data[0])
            setFormState({
                displayName: res.data[0]?.displayName || '',
                instrumentSymbol: res.data[0]?.instrumentSymbol || '',
                exchange: res.data[0]?.exchange || '',
                status: res.data[0]?.status || '',
                createdBy: res.data[0]?.createdBy || '',
                lastModifiedBy: res.data[0]?.lastModifiedBy || '',
                lastModifiedOn: res.data[0]?.lastModifiedOn || '',
                createdBy: res.data[0]?.createdBy || getDetails.userDetails._id,
                lastModifiedBy: res.data[0]?.lastModifiedBy || getDetails.userDetails._id,
                lastModifiedOn: new Date()
              });
                setTimeout(()=>{setIsLoading(false)},500) 
            // setIsLoading(false)
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })

    },[])

        async function onEdit(e,formState){
            e.preventDefault()
            setSaving(true)
            console.log(formState)
            if(!formState?.displayName || !formState?.instrumentSymbol || !formState?.exchange || !formState?.status){
                setTimeout(()=>{setSaving(false);setEditing(true)},500)
                return openErrorSB("Missing Field","Please fill all the mandatory fields")
            }
            const { displayName, instrumentSymbol, exchange, status } = formState;
    
            const res = await fetch(`${baseUrl}api/v1/stockindex/${id ? id : newObjectId}`, {
                method: "PUT",
                credentials:"include",
                headers: {
                    "content-type" : "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    displayName, instrumentSymbol, exchange, status
                })
            });
      
            const data = await res.json();
            console.log(data);
            if (data.status === 422 || data.error || !data) {
                openErrorSB("Error","data.error")
            } else {
                openSuccessSB("Index Edited",data.displayName + " | " + data.instrumentSymbol + " | " + data.exchange + " | " + data.status)
                setTimeout(()=>{setSaving(false);setEditing(false)},500)
                console.log("entry succesfull");
            }
          }
    


    async function onSubmit(e,formState){
        e.preventDefault()
        setCreating(true)
        console.log(formState)
        
        if(!formState?.displayName || !formState?.instrumentSymbol || !formState?.exchange || !formState?.status){
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { displayName, instrumentSymbol, exchange, status } = formState;
        const res = await fetch(`${baseUrl}api/v1/stockindex`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                displayName, instrumentSymbol, exchange, status
            })
        });
  
        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            // window.alert(data.error);
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            console.log("invalid entry");
        } else {
            openSuccessSB("Index Created",data.status)
            setNewObjectId(data.data)
            setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        }
      }
  const date = new Date(indexData.lastModifiedOn);

  const formattedLastModifiedOn = `${date.getUTCDate()}/${date.toLocaleString('default', { month: 'short' })}/${String(date.getUTCFullYear())} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;

//   console.log(formattedLastModifiedOn); // Output: "30/Mar/23 20:32:27"

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  // console.log("Title, Content, Time: ",title,content,time)


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

    console.log("Saving: ",saving)
    console.log("Editing: ",editing)
    console.log("Id:",id)

    return (
    <>
    {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
        </MDBox>
    )
        :
      ( 
        <MDBox pl={2} pr={2} mt={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Index Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Display Name *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.displayName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    displayName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Instrument Symbol *'
                defaultValue={indexData?.instrumentSymbol}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    instrumentSymbol: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Exchange *"
                defaultValue={formState?.exchange}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    exchange: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                defaultValue={indexData?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          {/* <Grid item xs={12} md={6} xl={3}></Grid>
          <Grid item xs={12} md={6} xl={3}></Grid> */}
          <Grid item xs={12} md={6} xl={6}>
            {isObjectNew &&
            <>
            <MDBox style={{fontSize:10}}>
                Last Modified By: {indexData?.lastModifiedBy?.first_name} {indexData?.lastModifiedBy?.last_name}
            </MDBox>
            <MDBox style={{fontSize:10}}>
                Last Modified On: {formattedLastModifiedOn}
            </MDBox>
            </>}
          </Grid>
          

          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateIndexForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                    Edit
                </MDButton>
                <MDButton variant="contained" color="info" size="small" onClick={()=>{setCreateIndexForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateIndexForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid>
            
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
export default Index;