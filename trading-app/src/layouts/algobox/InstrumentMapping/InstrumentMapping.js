import React, {useState, useEffect} from 'react'
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from '@mui/material/Button';


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React example components
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";

// Data
import projectsTableData from "../data/projectsTableData";
// import AlgoHeader from "./Header";
import InstrumentMappingModel from './InstrumentMappingModel';
import InstrumentData from '../data/InstrumentData';
import InstrumentMappingEdit from './instrumentMappingEdit';


const InstrumentMapping = () => {
  const { columns, rows } = InstrumentData();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [mappingData, setMappingData] = useState([]);
  const [reRender, setReRender] = useState(true);


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readInstrumentAlgo`)
        .then((res)=>{
            setMappingData(res.data)
            console.log(res.data);
        }).catch((err)=>{
            return new Error(err);
        })
    },[reRender])

    mappingData.map((subelem)=>{
        let obj = {};
        let statuscolor = subelem.Status == "Active" ? "success" : "error"
        obj.edit = (
            <Button variant="" color="black" fontWeight="small">
                <InstrumentMappingEdit data={mappingData} id={subelem._id} Render={{setReRender, reRender}}/>
            </Button>
        );
        obj.createdOn = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.createdOn)}
            </MDTypography>
        );
        obj.incomingInstrument = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
             {subelem.InstrumentNameIncoming}
            </MDTypography>
        );
        obj.incomingInstrumentCode = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.IncomingInstrumentCode)}
            </MDTypography>
        );
        

        obj.outgoingInstrument = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.InstrumentNameOutgoing)}
            </MDTypography>
        );

        obj.outgoingInstrumentCode = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
              {(subelem.OutgoingInstrumentCode)}
            </MDTypography>
        );

        obj.status = (
            <MDTypography component="a" color={statuscolor} variant="caption" fontWeight="medium">
              {(subelem.Status)}
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
                        Instrument Mapping
                        </MDTypography>
                        <InstrumentMappingModel Render={{reRender, setReRender}}/>
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

export default InstrumentMapping