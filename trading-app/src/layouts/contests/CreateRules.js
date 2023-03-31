import * as React from 'react';
import {useContext, useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import {userContext} from "../../AuthContext";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CreateContestRule from './createContestRule'

//Icons

import { GrFormNextLink } from 'react-icons/gr';

//Data
import RuleData from './data/ruleData'



function CreateContest({createRuleForm, setCreateRuleForm, id}) {

const [isSubmitted,setIsSubmitted] = useState(false);
const getDetails = useContext(userContext);
const [ruleData,setRuleData] = useState([]);
const [formState,setFormState] = useState();
const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
const [isLoading,setIsLoading] = useState(id ? true : false)
const [editing,setEditing] = useState(false)
const [saving,setSaving] = useState(false)
const [creating,setCreating] = useState(false)
const [newObjectId,setNewObjectId] = useState()
const [rules,setRules] = useState([]);
const [rulesArray,setRulesArray] = useState([])

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

React.useEffect(()=>{

    axios.get(`${baseUrl}api/v1/contestrule/${id}`)
    .then((res)=>{
        setRuleData(res.data[0]);
        // console.log(res.data[0])
        setFormState({
            ruleName: res.data[0]?.ruleName || '',
            contestRules:[{
                orderNo : res.data[0]?.contestRules?.orderNo || '',
                rule: res.data[0]?.contestRules?.rule || ''
            }],
            status: res.data[0]?.status || '',
            createdBy: res.data[0]?.createdBy || '',
            lastModifiedBy: res.data[0]?.lastModifiedBy || '',
            lastModifiedOn: res.data[0]?.lastModifiedOn || '',
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
    if(
        !formState?.ruleName || !formState?.contestRules?.orderNo || 
        !formState?.contestRules?.rule){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    
    }
    const { ruleName, contestRules:{orderNo,rule}, status} = formState;

    const res = await fetch(`${baseUrl}api/v1/contestrules/${id ? id : newObjectId}`, {
        method: "PUT",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          ruleName, contestRules:{orderNo,rule}, status
        })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error","data.error")
    } else {
        openSuccessSB("Index Edited",data.ruleName + " rule is created with status " + data.status)
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        console.log("Entry Succesfull");
    }
  }

function pushToArray(e){
    setRulesArray(prevState => ([
        ...prevState,
        e
    ]))
    window.alert("Added")
}

async function onNext(e,formState){
e.preventDefault()
setCreating(true)
console.log(formState)

if(
  !formState?.ruleName || !formState?.status){

  setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
  return openErrorSB("Missing Field","Please fill all the mandatory fields")

}

setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)

// const {ruleName, status} = formState;
// const res = await fetch(`${baseUrl}api/v1/contestrule`, {
//     method: "POST",
//     credentials:"include",
//     headers: {
//         "content-type" : "application/json",
//         "Access-Control-Allow-Credentials": true
//     },
//     body: JSON.stringify({
//       ruleName, status
//     })
// });

// const data = await res.json();
// console.log(data);
// if (data.status === 422 || data.error || !data) {
//     setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
//     console.log("Invalid Entry");
// } else {
//     openSuccessSB("Contest Created",data.status)
//     setNewObjectId(data.data)
//     setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
// }
}
const date = new Date(ruleData.lastModifiedOn);

const formattedLastModifiedOn = `${date.getUTCDate()}/${date.toLocaleString('default', { month: 'short' })}/${String(date.getUTCFullYear())} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;



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



console.log(rulesArray)


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
          Rule Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>

          <Grid item xs={12} md={6} xl={4}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Rule Name *'
                fullWidth
                value={formState?.ruleName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    ruleName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={4}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.status}
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
   

          {!isSubmitted && <Grid item xs={12} md={6} xl={2} mt={-0.7}>
            <GrFormNextLink cursor="pointer" onClick={(e)=>{onNext(e,formState)}}/>
          </Grid>}

          {isSubmitted && <Grid item xs={12} mt={2} md={6} xl={12}>
                <CreateContestRule rulesArray={rulesArray} setRulesArray={setRulesArray}/>
          </Grid>}

          {isSubmitted && <Grid item xs={12} md={6} xl={12}>
                {/* <MDTypography>Added Rules will show up here</MDTypography> */}
                <MDBox>
                    <RuleData />
                </MDBox>
          </Grid>}

          {/* <Grid item xs={12} md={6} xl={6}>
            {isObjectNew &&
            <>
            <MDBox style={{fontSize:10}}>
                Last Modified By: {ruleData?.lastModifiedBy?.first_name} {ruleData?.lastModifiedBy?.last_name}
            </MDBox>
            <MDBox style={{fontSize:10}}>
                Last Modified On: {formattedLastModifiedOn}
            </MDBox>
            </>}
          </Grid> */}
          

          {/* <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateRuleForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                    Edit
                </MDButton>
                <MDButton variant="contained" color="info" size="small" onClick={()=>{setCreateRuleForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateRuleForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid> */}
            
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
export default CreateContest;