import React, {useEffect, useState} from 'react'
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";
import EditSharpIcon from '@mui/icons-material/EditSharp';


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import AlgoHeader from "../Header";
import TradingARTokenData from '../data/AccessTokenData/TradingARTokenData';
import TradingARTokenDataExpired from '../data/AccessTokenData/TradingARTokenDataExpired';
import TradingARTokenModel from './TradingARTokenModel';
import TradingAccessEditModel from "./TradingAccessEditModel";
import AutoLogin from './AutoLogin';

const TradingARToken = () => {
  const { columns, rows } = TradingARTokenData();
  const { columns: pColumns, rows: pRows } = TradingARTokenDataExpired();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);
  const [reRender, setReRender] = useState(true);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readRequestToken`)
      .then((res)=>{
        let data = res.data;
                let active = data.filter((elem) => {
                    return elem.status === "Active"
                })
                setActiveData(active);
                //console.log(active);

                let inActive = data.filter((elem) => {
                    return elem.status === "Inactive"
                })
                setInactiveData(inActive);
                //console.log(inactiveData);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[reRender])

  //console.log(activeData);
  
  activeData.map((elem)=>{
    let activeparameter = {}
    const statuscolor = elem.status == "Active" ? "success" : "error"

    activeparameter.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
            <TradingAccessEditModel data={activeData} id={elem._id} Render={{setReRender, reRender}}/>
        </MDButton>
      );
    activeparameter.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    activeparameter.accesstoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accessToken}
      </MDTypography>
    );
    activeparameter.requesttoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.requestToken}
      </MDTypography>
    );
    activeparameter.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    activeparameter.generatedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.generatedOn}
      </MDTypography>
    );
   
    
    //console.log(typeof(activeparameter));
    //console.log(activeparameter)
    rows.push(activeparameter)
  })

  inactiveData.map((elem)=>{
    let inactiveparameter = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    inactiveparameter.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <TradingAccessEditModel data={inactiveData} id={elem._id} Render={{setReRender, reRender}}/>
        </MDButton>
      );
    inactiveparameter.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    inactiveparameter.accesstoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accessToken}
      </MDTypography>
    );
    inactiveparameter.requesttoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.requestToken}
      </MDTypography>
    );
    inactiveparameter.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    inactiveparameter.generatedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.generatedOn}
      </MDTypography>
    );
   
    
    //console.log(typeof(inactiveparameter));
    //console.log(inactiveparameter)
    pRows.push(inactiveparameter)
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
                                        Active Access & Request Token
                                    </MDTypography>
                                    <AutoLogin Render={{reRender, setReRender}} />
                                    <TradingARTokenModel Render={{reRender, setReRender}}/>
                                    
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
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Expired Access & Request Token
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: pRows }}
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

export default TradingARToken;