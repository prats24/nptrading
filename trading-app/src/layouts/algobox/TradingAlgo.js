import React, {useState, useEffect} from 'react'
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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
        // const res = await fetch(`${baseUrl}api/v1/updatemargindeduction/${id}`, {
        //     method: "PATCH",
        //     headers: {
        //         "Accept": "application/json",
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         marginDeduction
        //     })
        // });
        // const dataResp = await res.json();
        // console.log(dataResp);
        // if (dataResp.status === 422 || dataResp.error || !dataResp) {
        //     window.alert(dataResp.error);
        //     // console.log("Failed to Edit");
        // } else {
        //     // console.log(dataResp);
        //     window.alert("Switched succesfull");
        //     // console.log("Edit succesfull");
        // }
        // reRender ? setReRender(false) : setReRender(true)
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
            <MDButton fontWeight="medium">
              <MapUser algoName={subelem.algoName}/>
            </MDButton>
        );
        obj.transactionChange = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.transactionChange)}
            </MDTypography>
        );
        obj.instrumentChange = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.instrumentChange)}
            </MDTypography>
        );
        obj.status = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.status)}
            </MDTypography>
        );
        obj.exchangeChange = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.exchangeChange)}
            </MDTypography>
        );
        obj.lotMultipler = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.lotMultipler)}
            </MDTypography>
        );
        obj.productChange = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.productChange)}
            </MDTypography>
        );
        obj.tradingAccount = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.tradingAccount)}
            </MDTypography>
        );
        obj.isRealTrade = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
                <RealTrade id={subelem._id} Render={{reRender, setReRender}} tradingAlgo={algoData} buttonTextBool={subelem.isRealTrade} />
            </MDTypography>
        );
        obj.marginDeduction = (
            <MDButton variant="outlined" bgColor="blue" onClick={()=>{marginDeduction(subelem._id, subelem.marginDeduction)}} fullWidth>
                {(subelem.marginDeduction) ? "ON" : "OFF"}
            </MDButton>
        );
        obj.createdOn = (
            <MDTypography component="a" href="#" variant="caption" fontWeight="medium">
              {(subelem.createdOn)}
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
                                        Active Instruments
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
                        {/* <Grid item xs={12} md={12} lg={12}>
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
                                        Histroical Traders Orders(Mock)
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
                        </Grid>*/}
                    </Grid> 
                </MDBox> 
                </>
  )
}

export default TradingAlgo