import * as React from 'react';
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
import {useState, useRef, useEffect} from "react"
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { GrFormView } from 'react-icons/gr';

import axios from "axios";




const SignedUpUserModel = ({data, id, Render}) => {

return (
  <div>
    <MDButton variant="text" color="info" >
      <GrFormView/>
    </MDButton>
  </div>
)}

export default SignedUpUserModel;