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
import { useNavigate, useLocation } from "react-router-dom";



function Index() {

    const location = useLocation();
    const  id  = location?.state?.data;
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // const getDetails = useContext(userContext);
    // const [indexData,setIndexData] = useState([]);
    const [formState,setFormState] = useState();
    // const [id,setIsObjectNew] = useState(id ? true : false)
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const [portfolioData,setPortfolioData] = useState({})
    const navigate = useNavigate();

    console.log("id is", location)

    React.useEffect(()=>{

        axios.get(`${baseUrl}api/v1/portfolio/${id}`)
        .then((res)=>{
            setPortfolioData(res.data.data);
            console.log("portfolio data is", res.data)
            setFormState({
                portfolioName: res.data.data?.portfolioName || '',
                portfolioValue: res.data.data?.portfolioValue || '',
                portfolioType: res.data.data?.portfolioType || '',
                status: res.data.data?.status || '',
                portfolioAccount: res.data.data?.portfolioAccount || '',
                status: res.data.data?.status || '',
                // lastModifiedOn: res.data[0]?.lastModifiedOn || '',
                // createdBy: res.data[0]?.createdBy || getDetails.userDetails._id,
                // lastModifiedBy: res.data[0]?.lastModifiedBy || getDetails.userDetails._id,
                // lastModifiedOn: new Date()
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
        if(!formState?.portfolioName || !formState?.portfolioValue || !formState?.portfolioType || !formState?.status || !formState?.portfolioAccount){
            setTimeout(()=>{setSaving(false);setEditing(true)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { portfolioName, portfolioValue, portfolioType, status, portfolioAccount } = formState;

        const res = await fetch(`${baseUrl}api/v1/portfolio`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                portfolioName, portfolioValue, portfolioType, status, portfolioAccount            })
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
        
        if(!formState?.portfolioName || !formState?.portfolioValue || !formState?.portfolioType || !formState?.status || !formState?.portfolioAccount){
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { portfolioName, portfolioValue, portfolioType, status, portfolioAccount } = formState;
        const res = await fetch(`${baseUrl}api/v1/portfolio`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                portfolioName, portfolioValue, portfolioType, status, portfolioAccount
            })
        });
  
        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            // window.alert(data.error);
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            console.log("invalid entry");
        } else {
            openSuccessSB("Portfolio Created",data.status)
            // setNewObjectId(data.data)
            setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        }
    }

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
    // console.log("Id:",id)

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
          Fill Portfolio Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Portfolio Name *'
                fullWidth
                defaultValue={portfolioData?.portfolioName}
                value={formState?.portfolioName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    portfolioName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                labelId="demo-simple-select-autowidth-label"
                label='Portfolio Value *'
                type="number"
                // defaultValue={indexData?.portfolioValue}
                defaultValue={portfolioData?.portfolioValue}
                value={formState?.portfolioValue}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    portfolioValue: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Portfolio Type *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                // value={oldObjectId ? contestData?.portfolioType : formState?.portfolioType}
                value={formState?.portfolioType}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    portfolioType: e.target.value
                }))}}
                label="Portfolio Type"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Contest">Contest</MenuItem>
                <MenuItem value="Trading">Trading</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Portfolio Account *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                // value={oldObjectId ? contestData?.portfolioType : formState?.portfolioType}
                value={formState?.portfolioAccount}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    portfolioAccount: e.target.value
                }))}}
                label="Portfolio Account"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.status}
                // value={oldObjectId ? contestData?.status : formState?.status}
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
            
        </Grid>
        <Grid>
            <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                    {!isSubmitted && !id && (
                    <>
                    <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                        {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/portfolio")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{id ? navigate("/portfolio") : setIsSubmitted(false)}}>
                        Back
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setEditing(false)}}>
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