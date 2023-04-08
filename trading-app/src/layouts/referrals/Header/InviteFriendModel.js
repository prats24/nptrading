import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import MDTypography from '../../../components/MDTypography';
import MDSnackbar from "../../../components/MDSnackbar";
import { useAsyncError } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
//   border: '2px solid #000',
  borderRadius:2,
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [invited,setInvited] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false);setInvited(false)};
  const [formData,setFormData] = useState({name:'',email:'',mobile:''});
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  async function onInvite(e) {
   
    setFormData(formData);
    console.log("Form Data: ",formData)

    const { 
      name,  
      email, 
      mobile, 
    } = formData;

    const res = await fetch(`${baseUrl}api/v1/invite`, {
      
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          name:name, 
          email:email, 
          mobile:mobile, 
        })
    });

    const response = await res.json();
    console.log(response)
    if(response.message && response.status === 201)
    { 
        setInvited(true)
        // return openSuccessSB("Invitation Sent",response.message); 
    }
    if(response.data || response.error)
    {
        return openErrorSB("Error",response.error)
    }
    
}

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [time,setTime] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
        setTitle(value);
        setContent(content);
        setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const [infoSB, setInfoSB] = useState(false);
  const openInfoSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setInfoSB(true);
  }
  const closeInfoSB = () => setInfoSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setInfoSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="success"
    />
  );    

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title={title}
      content={content}
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );
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
    <div>
      <MDButton variant="contained" color="dark" size="small" onClick={handleOpen}>
        Invite Friends
      </MDButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Box>
            
                <Grid container mb={2} backgroundColor="lightgrey" style={{borderRadius:5}}>
                    <Grid item xs={12} md={12} lg={12} pt={1.5} display="flex" justifyContent="center" alignItems="center">
                        <Typography fontSize={13} fontWeight={700}>Hurry up to refer only 5 days 3 hrs 20 mins left</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} pb={1.5} display="flex" justifyContent="center" alignItems="center">
                        <Typography fontSize={13} fontWeight={700}>Your referral Code : ABCDEF</Typography>
                    </Grid>
                </Grid>
                
            </Box>
            {!invited ? 
            <Box>
            <Grid container spacing={1}>
                 <Grid item xs={12} md={12} xl={12}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{formData.name = e.target.value}}
                      />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12} mt={1}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Mobile No."
                        type="mobile"
                        fullWidth
                        onChange={(e)=>{formData.mobile = e.target.value}}
                      />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <MDTypography fontSize={10} display="flex" justifyContent="center">Or</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                  <TextField
                        required
                        id="outlined-required"
                        type="email"
                        label="Email"
                        fullWidth
                        onChange={(e)=>{formData.email = e.target.value}}
                      />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12} mt={2} display="flex" justifyContent="center">
                    <MDButton variant="contained" color="dark" size="small" onClick={onInvite}>Invite</MDButton>
                  </Grid>
            </Grid>
            </Box>
            
            :

            <Box>
                <Box display="flex" justifyContent="center" flexDirection="column" p={1}>
                    <Typography fontSize={14} p={1}>Thanks for inviting {formData.name} to StoxHero. He will recieve an email with your referral code. Please ask him to signup using your referral code.</Typography>
                    <Box display="flex" justifyContent="space-between" mt={3}>
                    <MDButton variant="contained" color="dark" size="small" onClick={()=>{setInvited(false)}}>Invite Another Friend</MDButton>
                    <MDButton variant="contained" color="dark" size="small" onClick={()=>{handleClose()}}>Close</MDButton>
                    </Box>
                </Box>
            </Box>
            }
            {renderSuccessSB}
            {renderInfoSB}
            {renderErrorSB}
        </Box>
      </Modal>
    </div>
  );
}