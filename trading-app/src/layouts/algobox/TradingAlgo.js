import React, {useState, useEffect} from 'react'
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
// import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";
import AlgoHeader from "./Header";
import TradingAlgoModel from './TradingAlgoModel';
import TradingAlgoData from './data/TradingAlgoData';
import MapUser from "./MapUser/MapUser"
import RealTrade from "./RealTrade/RealTrade"
import TradingAlgoEditModel from "./TradingAlgoEditModel";

const TradingAlgo = () => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const { columns, rows } = TradingAlgoData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [algoData, setAlgoData] = useState([]);
  const [reRender, setReRender] = useState(true);


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readtradingAlgo`)
        .then((res)=>{
            setAlgoData(res.data)
            console.log(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])


    async function marginDeduction(id, marginDeduction){
        const res = await fetch(`${baseUrl}api/v1/updatemargindeduction/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                marginDeduction
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function transactionChange(id, transactionChange){
        if(transactionChange === "TRUE"){
            transactionChange = "FALSE"
        } else{
            transactionChange = "TRUE";
        }
        const res = await fetch(`${baseUrl}api/v1/updatetransactionChange/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                transactionChange
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function instrumentChange(id, instrumentChange){
        if(instrumentChange === "TRUE"){
            instrumentChange = "FALSE"
        } else{
            instrumentChange = "TRUE";
        }
        const res = await fetch(`${baseUrl}api/v1/updateinstrumentChange/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                instrumentChange
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function exchangeChange(id, exchangeChange){
        if(exchangeChange === "TRUE"){
            exchangeChange = "FALSE"
        } else{
            exchangeChange = "TRUE";
        }
        const res = await fetch(`${baseUrl}api/v1/updateexchangeChange/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                exchangeChange
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function productChange(id, productChange){
        if(productChange === "TRUE"){
            productChange = "FALSE"
        } else{
            productChange = "TRUE";
        }
        const res = await fetch(`${baseUrl}api/v1/updateproductChange/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                productChange
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    algoData.map((subelem)=>{
        let obj = {};
        obj.edit = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                <TradingAlgoEditModel data={algoData} id={subelem._id} Render={{setReRender, reRender}}/>
            </MDButton>
        );
        obj.algoName = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.algoName)}
            </MDTypography>
        );
        obj.mapUser = (
            <MDButton variant="outlined" bgColor="white" color="dark" fontWeight="medium">
              <MapUser color="white" algoName={subelem.algoName}/>
            </MDButton>
        );
        obj.lotMultipler = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.lotMultipler)}
            </MDTypography>
        );
        obj.transactionChange = (
            // <MDTypography component="a" variant="caption" fontWeight="medium">
            //   {(subelem.transactionChange)}
            // </MDTypography>
                        <MDBox mt={0.5}>
                        <Switch checked={subelem.transactionChange === "TRUE"} onChange={() => {transactionChange(subelem._id, subelem.transactionChange)}} />
                      </MDBox>
        );
        obj.marginDeduction = (
            // <MDButton variant="outlined" bgColor="white" onClick={()=>{marginDeduction(subelem._id, subelem.marginDeduction)}} fullWidth>
            //     {(subelem.marginDeduction) ? "ON" : "OFF"}
            // </MDButton>
            <MDBox mt={0.5}>
            <Switch checked={subelem.marginDeduction} onChange={() => {marginDeduction(subelem._id, subelem.marginDeduction)}} />
          </MDBox>
        );
        obj.instrumentChange = (
            // <MDTypography component="a" variant="caption" fontWeight="medium">
            //   {(subelem.instrumentChange)}
            // </MDTypography>
                        <MDBox mt={0.5}>
                        <Switch checked={subelem.instrumentChange === "TRUE"} onChange={() => {instrumentChange(subelem._id, subelem.instrumentChange)}} />
                      </MDBox>
        );
        obj.status = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.status)}
            </MDTypography>
        );
        obj.exchangeChange = (
            // <MDTypography component="a" variant="caption" fontWeight="medium">
            //   {(subelem.exchangeChange)}
            // </MDTypography>
            <MDBox mt={0.5}>
            <Switch checked={subelem.exchangeChange === "TRUE"} onChange={() => {exchangeChange(subelem._id, subelem.exchangeChange)}} />
          </MDBox>
        );
        obj.productChange = (
            // <MDTypography component="a" variant="caption" fontWeight="medium">
            //   {(subelem.productChange)}
            // </MDTypography>
            <MDBox mt={0.5}>
            <Switch checked={subelem.productChange === "TRUE"} onChange={() => {productChange(subelem._id, subelem.productChange)}} />
            </MDBox>
        );
        obj.tradingAccount = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.tradingAccount)}
            </MDTypography>
        );
        obj.isRealTrade = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                <RealTrade id={subelem._id} Render={{reRender, setReRender}} tradingAlgo={algoData} buttonTextBool={subelem.isRealTrade} />
            </MDTypography>
        );

        rows.push(obj);
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
                                        Active Algo(s)
                                    </MDTypography>
                                    <TradingAlgoModel/>
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
                                        Inactive Algo(s)
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

export default TradingAlgo