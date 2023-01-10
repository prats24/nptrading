import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../../../components/MDButton';
import { Box, Typography } from '@mui/material';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import SellModel from './SellModel';
import AMOSellModel from './AmoSellModel';

const HeaderSell = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MDButton variant="contained" color="error" onClick={handleClickOpen} fullWidth>
        BUY
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
          <DialogContentText>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Regular"
                //   icon={
                //     <CandlestickChartIcon fontSize="small" sx={{ mt: -0.25 }}/>
                //   }
                />
                <Tab
                  label="AMO"
                //   icon={
                //     <CandlestickChartIcon fontSize="small" sx={{ mt: -0.25 }}/>

                //   }
                />


              </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}><SellModel /></TabPanel>
            <TabPanel value={tabValue} index={1}><AMOSellModel /></TabPanel>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton autoFocus variant="contained" color="error" onClick={handleClose}>
            Sell
          </MDButton>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
            Close
          </MDButton>

        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HeaderSell

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <>
      {
        value === index &&
        <h1>{children}</h1>
      }
      {/* <TableOne/> */}
    </>
  )
}
