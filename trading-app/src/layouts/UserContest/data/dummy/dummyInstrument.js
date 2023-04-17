import React,{useState, useEffect, useContext, memo} from 'react'
// import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'

function InstrumentsData(){

return (

    <>
    <Grid  style={{ filter: 'blur(2px)' }}>


        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} color="light">Instruments</MDTypography>
            </Grid>
        </Grid>

        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Contract Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Symbol</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>LTP</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Change(%)</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Buy</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Sell</MDTypography>
            </Grid>

        </Grid>

        <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
        <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>2023-04-11</MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023CE</MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>₹140</MDTypography>
        </Grid>


        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>
            +2.00%
            </MDTypography>
        </Grid>


        <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
        <MDButton variant="contained" color="info" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>B</MDButton>
            {/* <BuyModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId} portfolioId={portfolioId}/> */}
        </Grid>
        {/* reRender={reRender} setReRender={setReRender} */}
        <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
        
        </Grid>

        <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
        <MDButton variant="contained" color="error" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>S</MDButton>
            {/* <SellModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId} portfolioId={portfolioId}/> */}
        </Grid>

        </Grid>

        <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
        <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>2023-04-11</MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023CE</MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>₹140</MDTypography>
        </Grid>


        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>
            +2.00%
            </MDTypography>
        </Grid>


        <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
        <MDButton variant="contained" color="info" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>B</MDButton>
            {/* <BuyModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId} portfolioId={portfolioId}/> */}
        </Grid>
        {/* reRender={reRender} setReRender={setReRender} */}
        <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
        
        </Grid>

        <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
        <MDButton variant="contained" color="error" style={{fontSize:12,minWidth:"80%",padding:'none',cursor:"pointer"}}>S</MDButton>
            {/* <SellModel  symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} contestId={contestId} portfolioId={portfolioId}/> */}
        </Grid>

        </Grid>

    </Grid>
        <Grid  container mt={2} zIndex={1} position={'relative'}>
        <Grid item xs={12} md={12} lg={12} style={{ position: "absolute", top: "-65px", left: "35%" }}>
          <MDTypography fontSize={20} fontWeight={900} color="light">Your Instruments will show here</MDTypography>
        </Grid>
      </Grid>
    </>

);
}

export default memo(InstrumentsData);