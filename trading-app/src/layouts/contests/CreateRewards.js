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


function CreateReward() {

const [formState,setFormState] = useState({
    rankStart: '',
    rankEnd: '',
    rankIcon: '',
    reward: '',
    currency: '',
});

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

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
          <Grid item xs={12} md={6} xl={2.5}>
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

          <Grid item xs={12} md={6} xl={2.5}>
            <TextField
                id="outlined-required"
                label='Rank End *'
                defaultValue={formState?.rankEnd}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankEnd: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={2.5}>
            <TextField
                id="outlined-required"
                label='Reward *'
                defaultValue={formState?.reward}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankEnd: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={2.5}>
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
            <IoMdAddCircle cursor="pointer" />
          </Grid>

          </Grid>
      
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    </>
    )
}
export default CreateReward;