import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";

// Data
// import authorsTableData from "./data/authorsTableData";
import activeInstrumentsData from "./data/activeInstrumentsData";
import InstrumentModel from './InstrumentModel';
import InstrumentEditModel from "./InstrumentEditModel";
import MDButton from "../../components/MDButton";
import axios from "axios";


const InstrumentActiveTable = () => {
    const [reRender, setReRender] = useState(true);

    const { columns, rows } = activeInstrumentsData();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [activeData, setActiveData] = useState([]);
  
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
        .then((res)=>{
          let data = res.data;
                  let active = data.filter((elem) => {
                      return elem.status === "Active"
                  })
                  setActiveData(active);
                  console.log(active);
          }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])
  
      
    activeData.map((elem)=>{
      let activeinstruments = {}
      const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
      const statuscolor = elem.status == "Active" ? "success" : "error"
      const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
  
      activeinstruments.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <InstrumentEditModel data={activeData} id={elem._id} Render={{setReRender, reRender}}/>
            
          </MDButton>
        );
      activeinstruments.instruments = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.symbol}
        </MDTypography>
      );
      activeinstruments.contractdate = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.contractDate}
        </MDTypography>
      );
      activeinstruments.exchange = (
        <MDTypography component="a" href="#" variant="caption" color={exchangecolor} fontWeight="medium">
          {elem.exchange}
        </MDTypography>
      );
      activeinstruments.lotsize = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.lotSize}
        </MDTypography>
      );
      activeinstruments.maxquantity = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.maxLot}
        </MDTypography>
      );
      activeinstruments.status = (
        <MDTypography component="a" href="#" variant="caption" color={statuscolor} fontWeight="medium">
          {elem.status}
        </MDTypography>
      );
      activeinstruments.createdon = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.createdOn}
        </MDTypography>
      );
      activeinstruments.otm = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.otm}
        </MDTypography>
      );
     
      rows.push(activeinstruments)
    })

    return (<>
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
                                   <InstrumentModel Render={{reRender, setReRender}}/>
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

export default InstrumentActiveTable;