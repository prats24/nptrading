import * as React from 'react';
import {useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import { IoMdAddCircle } from 'react-icons/io';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDTypography from '../../components/MDTypography';


function CreateReward({createRewardForm, setCreateRewardForm}) {
const [isSubmitted,setIsSubmitted] = useState(false);
const [contestData,setContestData] = useState([]);
const [id,setId] = useState();
const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
const [isLoading,setIsLoading] = useState(id ? true : false)
const [editing,setEditing] = useState(false)
const [saving,setSaving] = useState(false)
const [creating,setCreating] = useState(false)
const [newObjectId,setNewObjectId] = useState()
const [addRuleObject,setAddRuleObject] = useState(false);
const [formState,setFormState] = useState({
    rankStart: '',
    rankEnd: '',
    rankIcon: '',
    reward: '',
    currency: '',
});

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
console.log("Inside Child Component",isSubmitted)
React.useEffect(()=>{

  axios.get(`${baseUrl}api/v1/contest/${id}`)
  .then((res)=>{
          setContestData(res.data[0]);
          console.log(res.data[0])
          setId(res.data[0]._id)
          setFormState({
            contestName: res.data[0]?.contestName || '',
            rewards:[{
                rankStart : res.data[0]?.rewards?.rankStart || '',
                rankEnd: res.data[0]?.rewards?.rankEnd || '',
                reward: res.data[0]?.rewards?.reward || '',
                currency: res.data[0]?.rewards?.currency || '',
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

},[createRewardForm])

async function onAddReward(e,childFormState,setChildFormState){
  e.preventDefault()
  setSaving(true)
  console.log(childFormState)
  console.log(newObjectId)
  if(!childFormState?.rankStart || !childFormState?.rankEnd || !childFormState?.reward 
    || !childFormState?.currency
    )
  {
      setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
      return openErrorSB("Missing Field","Please fill all the mandatory fields")
  }
  const {rankStart, rankEnd, reward, currency} = childFormState;

  const res = await fetch(`${baseUrl}api/v1/contest/${newObjectId}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        rewards:{rankStart, rankEnd, reward, currency}
      })
  });
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

    return (
    <> 
        <MDBox mt={-3.5}>
        <Grid container spacing={1} mt={0.5} mb={0}>
          
        <Grid item xs={12} md={6} xl={2}>
            <MDTypography fontSize={10} mt={2} fontWeight="bold" display="flex" flex="1" justifyContent="center" alignItems="center">Add Rewards for this Contest</MDTypography>
          </Grid>
          
          <Grid item xs={12} md={6} xl={1.5}>
            <TextField
                id="outlined-required"
                label='Rank Start *'
                fullWidth
                type="number"
                value={formState?.rankStart}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankStart: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={1.5}>
            <TextField
                id="outlined-required"
                label='Rank End *'
                defaultValue={formState?.rankEnd}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankEnd: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                id="outlined-required"
                label='Reward *'
                defaultValue={formState?.reward}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    reward: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={2}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.currency}
                onChange={(e) => {setFormState(prevState => ({
                  ...prevState,
                  currency: e.target.value
                }))}}
                label="Currency"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="CREDOS">CREDOS</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={2} mt={-0.7}>
            <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddReward(e,formState,setFormState)}} />
          </Grid>

          </Grid>
      
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    </>
    )
}
export default CreateReward;