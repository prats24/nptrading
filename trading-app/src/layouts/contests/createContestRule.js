import * as React from 'react';
import {useContext, useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
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
import { IoMdAddCircle } from 'react-icons/io';



function CreateRule({childFormState,setChildFormState}) {

const [formState,setFormState] = useState({
    orderNo: '',
    rule: '',
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
        {/* <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Add Rules Here
        </MDTypography>
        </MDBox> */}
        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={1.5}>
            <TextField
                id="outlined-required"
                label='Rule No *'
                fullWidth
                type="number"
                value={formState?.orderNo}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    orderNo: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={9.5}>
            <TextField
                id="outlined-required"
                label='Add rule here *'
                defaultValue={formState?.rule}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rule: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={1} mt={-0.7}>
            <IoMdAddCircle cursor="pointer" />
          </Grid>

          </Grid>
      
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    </>
    )
}
export default CreateRule;