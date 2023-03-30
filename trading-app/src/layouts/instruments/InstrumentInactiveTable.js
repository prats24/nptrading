import React, {useEffect, useState} from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";
import InstrumentEditModel from "./InstrumentEditModel";
import MDButton from "../../components/MDButton";
import axios from "axios";

// Data
import inactiveinstrumentsData from "./data/inactiveInstrumentsData";
// import companyOrdersmock from "./data/companyOrdersmock";

const InstrumentInactiveTable = () => {
    const [reRender, setReRender] = useState(true);

    const { columns, rows } = inactiveinstrumentsData();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [inactiveData, setInactiveData] = useState([]);
  
    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
        .then((res)=>{
          let data = res.data;
                  let inActive = data.filter((elem) => {
                      return elem.status === "Inactive"
                  })
                  setInactiveData(inActive);
                  console.log(inactiveData);
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
    },[reRender, inactiveData])
  
    inactiveData.map((elem)=>{
      let inactiveinstruments = {}
      const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
      const statuscolor = elem.status == "Active" ? "success" : "error"
      const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
      
      inactiveinstruments.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <InstrumentEditModel data={inactiveData} id={elem._id} Render={{setReRender, reRender}}/>
          </MDButton>
        );
      inactiveinstruments.instruments = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.symbol}
        </MDTypography>
      );
      inactiveinstruments.contractdate = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.contractDate}
        </MDTypography>
      );
      inactiveinstruments.exchange = (
        <MDTypography component="a" href="#" variant="caption" color={exchangecolor} fontWeight="medium">
          {elem.exchange}
        </MDTypography>
      );
      inactiveinstruments.lotsize = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.lotSize}
        </MDTypography>
      );
      inactiveinstruments.maxquantity = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.maxLot}
        </MDTypography>
      );
      inactiveinstruments.status = (
        <MDTypography component="a" href="#" variant="caption" color={statuscolor} fontWeight="medium">
          {elem.status}
        </MDTypography>
      );
      inactiveinstruments.createdon = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {elem.createdOn}
        </MDTypography>
      );
      inactiveinstruments.otm_p1 = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.otm_p1}
        </MDTypography>
      );

      inactiveinstruments.otm_p2 = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.otm_p2}
        </MDTypography>
      );

      inactiveinstruments.otm_p3 = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.otm_p3}
        </MDTypography>
      );
     
     
      
      rows.push(inactiveinstruments)
    })
    return (
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
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
                                        Inactive Instruments
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
    )
}

export default InstrumentInactiveTable;