//import React from 'react'
import {useState, useContext, useEffect} from "react"
import TextField from '@mui/material/TextField';
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import { Typography } from "@mui/material";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";

// Data
import DailyPNLMaxMinData from './data/dailyPnlMaxMinData';



const PnlMaxMinData = () => {

    
    const { columns, rows } = DailyPNLMaxMinData();
    const [newrows, setNewRows] = useState([]);
    const [Data, setData] = useState([]);
    const [FDPNLData, setFDPNLData] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    const [firstDate, setFirstDate] = useState(valueInDate);

    useEffect(()=>{

      axios.get(`${baseUrl}api/v1/dailypnlmaxmindata`)
      .then((res)=>{
                console.log("First Date PNL Data: "+res.data)
                setFDPNLData(JSON.parse(JSON.stringify(res.data)));
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
    },[firstDate])
    console.log("FD PNL Data Update: "+FDPNLData)

    let pnlvalue = [];

    FDPNLData?.map((elem1)=>{
      let pnldata = {}
      pnlvalue.push(elem1.pnl);
      const date = new Date(elem1._id);
      const dayOfWeek = date.getDay();
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      
      const gpnlcolor = (elem1.lastTimestampSum) >= 0 ? "success" : "error"
      const maxgpnlcolor = elem1.maxgpnl >= 0 ? "success" : "error"
      const mingpnlcolor = elem1.mingpnl >= 0 ? "success" : "error"

        pnldata.date = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem1._id}
          </MDTypography>
        );
        pnldata.weekday = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {weekday}
            </MDTypography>
          );
        pnldata.gpnl = (
          <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
            {(elem1.lastTimestampSum) >= 0.00 ? "+₹" + ((elem1.lastTimestampSum).toFixed(0)) : "-₹" + ((-(elem1.lastTimestampSum)).toFixed(0))}
          </MDTypography>
        );
        pnldata.maxpnl = (
        <MDTypography component="a" variant="caption" color={maxgpnlcolor} fontWeight="medium">
          {elem1.maxgpnl >= 0 ? "+₹" +elem1.maxgpnl.toFixed(0) : "-₹" + (-elem1.maxgpnl).toFixed(0)}
        </MDTypography>
      );
      pnldata.minpnl = (
        <MDTypography component="a" variant="caption" color={mingpnlcolor} fontWeight="medium">
          {elem1.mingpnl >= 0 ? "+₹" +elem1.mingpnl.toFixed(0) : "-₹" + (-elem1.mingpnl).toFixed(0)}
        </MDTypography>
      );

        rows.push(pnldata);
      })
      
    return (
        <>

            <MDBox pt={6} pb={3}>
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
                                <MDTypography variant="h6" color="white" py={2.5}>
                                  Gross, Max & Min P&L Data (Mock)
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
            </MDBox>
        </>
    )
}

export default PnlMaxMinData