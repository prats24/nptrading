import React, { useState, useEffect } from 'react'
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

// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import AlgoHeader from "../Header";
import AccountsModel from './AccountsModel';
import AccountsData from '../data/ApiKey/AccountsData';
import AccountsDataInactive from '../data/ApiKey/AccountsDataInactive';
import AccountEditModel from "./AccountEditModel"

const Accounts = () => {
  const { columns, rows } = AccountsData();
  const { columns: pColumns, rows: pRows } = AccountsDataInactive();

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);
  const [reRender, setReRender] = useState(true);

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/readAccountDetails`)
      .then((res)=>{
        let data = res.data;
                let active = data.filter((elem) => {
                    return elem.status === "Active"
                })
                setActiveData(active);
                console.log(active);

                let inActive = data.filter((elem) => {
                    return elem.status === "Inactive"
                })
                setInactiveData(inActive);
                console.log(inactiveData);
      }).catch((err)=>{
          return new Error(err);
      })
  },[reRender])

 
  activeData.map((elem)=>{
    let activeaccounts = {}
    const statuscolor = elem.status == "Active" ? "success" : "error"

    activeaccounts.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
            < AccountEditModel data={activeData} id={elem._id} Render={{setReRender, reRender}}/>
          
        </MDButton>
      );
    activeaccounts.broker = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerName}
      </MDTypography>
    );
    activeaccounts.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    activeaccounts.accountname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountName}
      </MDTypography>
    );
    activeaccounts.apikey = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiKey}
      </MDTypography>
    );
    activeaccounts.apisecret = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiSecret}
      </MDTypography>
    );
    activeaccounts.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    activeaccounts.createdon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );

    rows.push(activeaccounts)
  })

  inactiveData.map((elem)=>{
    let inactiveaccounts = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    inactiveaccounts.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          < AccountEditModel data={inactiveData} id={elem._id} Render={{setReRender, reRender}}/>
        </MDButton>
      );
    inactiveaccounts.broker = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerName}
      </MDTypography>
    );
    inactiveaccounts.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    inactiveaccounts.accountname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountName}
      </MDTypography>
    );
    inactiveaccounts.apikey = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiKey}
      </MDTypography>
    );
    inactiveaccounts.apisecret = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiSecret}
      </MDTypography>
    );
    inactiveaccounts.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    inactiveaccounts.createdon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );
   
    pRows.push(inactiveaccounts)
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
                                        Active Company Trading Account
                                    </MDTypography>
                                    <AccountsModel Render={{reRender, setReRender}}/>
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
                                        Inactive Company Trading Accounts
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

export default Accounts