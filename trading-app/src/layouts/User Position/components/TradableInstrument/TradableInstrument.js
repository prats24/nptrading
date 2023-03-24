import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDButton";

import Card from "@mui/material/Card";
import MDTypography from "../../../../components/MDButton";
import DataTable from "../../../../examples/Tables/DataTable";
// import MDButton from "../";
import MDButton from "../../../../components/MDButton";


import SearchTableData from "./data/data";


function TradableInstrument({data}) {

  const { columns, rows } = SearchTableData();

  data.map((elem)=>{
    let searchData = {}

    searchData.name = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          {elem.name}
        </MDButton>
      );
    searchData.symbol = (
      <MDTypography component="a" href="#" variant="caption" color="info" fontWeight="medium">
        {elem.tradingsymbol}
      </MDTypography>
    );
    searchData.expiry = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.expiry}
      </MDTypography>
    );
    searchData.add = (
      <MDTypography component="a" href="#" variant="caption" color="info" fontWeight="medium">
        
      </MDTypography>
    );
   
    rows.push(searchData)
  })

  return (<>
    <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={12}>
                <Card>
                    {/* <MDBox
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
                    </MDBox> */}
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

export default TradableInstrument;
