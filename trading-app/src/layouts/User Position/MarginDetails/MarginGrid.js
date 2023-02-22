import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../AuthContext";

// Data

import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MarginDetails from './MarginDetails';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import AvailableIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const MarginGrid = () => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [marginDetails, setMarginDetails] = useState([]);
  const { columns, rows } = MarginDetails();
//   const { columns: pColumns, rows: pRows } = MarginDetails();
  const [lifetimePNL, setLifetimePNL] = useState([]);
  const [availableMarginPNL, setAvailableMarginPNL] = useState([]);
  const [payIn, setPayIn] = useState([]);
  const getDetails = useContext(userContext);

  useEffect(()=>{
      console.log(getDetails.userDetails.email)
      axios.get(`${baseUrl}api/v1/getUserMarginDetails/${getDetails.userDetails.email}`)
        .then((res)=>{
                console.log(res.data);
                setMarginDetails(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Margin Details");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/gettraderpnlformargin/${getDetails.userDetails.email}`)
        .then((res)=>{
                console.log(res.data);
                setLifetimePNL(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching P&L Details for Margin");
            return new Error(err);
        })
        
        axios.get(`${baseUrl}api/v1/gettraderpnlforavailablemargin/${getDetails.userDetails.email}`)
        .then((res)=>{
                console.log(res.data);
                setAvailableMarginPNL(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching P&L Details for Available Margin");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/getUserPayInDetails/${getDetails.userDetails.email}`)
        .then((res)=>{
                console.log(res.data);
                setPayIn(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching PayIn Data");
            return new Error(err);
        })
  },[])

  let totalCredit = 0;
  marginDetails?.map((elem)=>{
    totalCredit =+ totalCredit + elem.amount
  })

  let totalCreditString = totalCredit >= 0 ? "+₹" + totalCredit.toLocaleString() : "-₹" + ((-totalCredit).toLocaleString())
  let lifetimenetpnl = lifetimePNL[0] ? Number((lifetimePNL[0].npnl).toFixed(0)) : 0;
  console.log(lifetimenetpnl)
  let runninglotnumber = 50;
  let runningPnl = -3000;
  let openingBalance = (totalCredit + lifetimenetpnl);
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance).toLocaleString() : "₹" + (-Number(openingBalance)).toLocaleString()
  let availableMarginpnl = availableMarginPNL[0] ? Number((availableMarginPNL[0].npnl).toFixed(0)) : 0;
  let availableMargin = (totalCredit + availableMarginpnl)
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin).toLocaleString() : "₹" + (-Number(availableMargin)).toLocaleString()
  rows.OpeningBalance = openingBalance
  let usedMargin = runninglotnumber == 0 ? openingBalance - availableMargin : openingBalance - availableMargin + runningPnl
  let usedMarginString = usedMargin >= 0 ? "+₹" + Number(usedMargin).toLocaleString() : "-₹" + (-Number(usedMargin)).toLocaleString()
  let payInAmount = payIn[0] ? Number(payIn[0].totalCredit) : 0
  let payInString = payInAmount >= 0 ? "+₹" + Number(payInAmount).toLocaleString() : "-₹" + (-Number(payInAmount)).toLocaleString()
  
  

    // const { columns, rows } = authorsTableData();
    
    return (<>
                {/* <MDBox pt={2} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={1}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                      }}>

                                    <MDTypography variant="h6" color="white" py={1}>
                                        Margin Details
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid> 
                </MDBox>  */}
                <MDBox mt={0.5}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid> */}
                <Grid item xs={16} md={6} xl={2.4}>
                  <DefaultInfoCard
                    icon={<AvailableIcon/>}
                    title="total credit"
                    description="Total funds added by ninepointer"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<AvailableIcon/>}
                    title="available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<ShoppingCartIcon/>}
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<CurrencyRupeeIcon/>}
                    title="Payin"
                    description="Funds added in your trading account today"
                    value={payInString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<AccountBalanceWalletIcon/>}
                    title="opening balance"
                    description="Cash available at the beginning of the day"
                    value={openingBalanceString}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
                </>
    )
}

export default MarginGrid;