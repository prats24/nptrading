import React,{useState, useEffect, memo, useContext} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { userContext } from '../../../AuthContext';

function TradersRanking({contestId, socket}){

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [rankData, setRankData] = useState([]);
  const [myRank, setMyRank] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const getDetails = useContext(userContext)


  const fetchData = async () => {
    try {
      const [api1Response, api2Response] = await Promise.all([
        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/leaderboard`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          },
        }),
        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/myrank`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          },
        })
      ]);

      console.log("leaderboard", api1Response.data.data)
      setRankData(api1Response.data.data);
      if(api2Response.data.status == "success"){
        setMyRank(api2Response.data.data);
      }
      
      setTimeout(()=>{setIsLoading(false)},500)
    } catch (error) {
      console.error("leaderboard", error);
    }
  };
  
  useEffect(() => {
    const intervalId = setInterval(fetchData, 10000); // run every 10 seconds
    fetchData(); // run once on mount
    // socket.emit('hi')
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/getliveprice`)
  //   .then((res) => {
  //     setMarketData(res.data);
  //   }).catch((err) => {
  //       return new Error(err);
  //   })
  //   socket?.on('check', (data)=>{
  //     console.log("data from socket in instrument in parent", data)
  //   })

  //   // socket.on("tick", (data) => {
  //   socket?.on("contest-ticks", (data) => {
  //     console.log('data from socket in instrument in parent', data);
  //     setMarketData(prevInstruments => {
  //       const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
  //       data.forEach(instrument => {
  //         instrumentMap.set(instrument.instrument_token, instrument);
  //       });
  //       return Array.from(instrumentMap.values());
  //     });

  //   })
  // }, [])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

  console.log("in use effect", rankData, myRank)

  // let allRank = receiveFinalArr(rankData);
  // let myRankArr = receiveFinalArr(myRank?.data);


  // console.log("finalTraderRank", allRank, myRankArr);

  // let myNetPnl = myRankArr[0] && myRankArr[0].totalPnl - myRankArr[0].brokerage
  // let myProfitChange = myRankArr[0] && myNetPnl*100/myRankArr[0].investedAmount;


  // function receiveFinalArr(rankData){
  //   let finalTraderRank = [];
  //   if(rankData?.length !== 0){
  //     let mapForParticularUser = new Map();
  //     for(let i = 0; i < rankData?.length; i++){
  //       if(mapForParticularUser.has(rankData[i].userId.trader)){
  //         let marketDataInstrument = marketData.filter((elem)=>{
  //           return elem.instrument_token == Number(rankData[i].userId.instrumentToken)
  //         })
  
  //         let obj = mapForParticularUser.get(rankData[i].userId.trader)
  //         obj.totalPnl += ((rankData[i].totalAmount+((rankData[i].lots)*marketDataInstrument[0]?.last_price)));
  //         obj.runninglots += rankData[i].lots;
  //         obj.brokerage += rankData[i].brokerage;
  
  //       } else{
  //         let marketDataInstrument = marketData.filter((elem)=>{
  //           return elem !== undefined && elem.instrument_token === Number(rankData[i].userId.instrumentToken)
  //         })
  //         mapForParticularUser.set(rankData[i].userId.traderId, {
  //           name : rankData[i].userId.traderName,
  //           totalPnl : ((rankData[i].totalAmount+((rankData[i].lots)*marketDataInstrument[0]?.last_price))),
  //           runninglots : rankData[i].lots,
  //           brokerage: rankData[i].brokerage,
  //           name: rankData[i].userId.createdBy,
  //           investedAmount: rankData[i].investedAmount
  //         }) 
  //       }
  
  //     }
  
  
  //     for (let value of mapForParticularUser.values()){
  //       finalTraderRank.push(value);
  //     }
  
  //     finalTraderRank.sort((a, b)=> {
  //       return (b.totalPnl-b.brokerage)-(a.totalPnl-a.brokerage)
  //     });
  //   }
  //   return finalTraderRank;
  // }


return (
    <>
      
        <Grid item xs={12} md={6} lg={5} mb={2}>
            <MDBox color="light">

                <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700}}>
                    LeaderBoard
                </MDTypography>
                
                {isLoading ?
                <Grid mt={12} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                  <CircularProgress color="light" />
                </Grid>
      
                :
                <>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                      <MDTypography fontSize={13} color="light">My Rank</MDTypography>
                    </Grid>
                </Grid>

                <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                    
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Rank</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Name</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>P&L</MDTypography>
                    </Grid>
                    {/* <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Profit(%)</MDTypography>
                    </Grid> */}

                </Grid>

                <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                    
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light">{myRank?.rank}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light">{getDetails?.userDetails?.name}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={myRank?.npnl >= 0 ? "success" : "error"}>
                            {myRank?.npnl >= 0.00 ? "+₹" + (myRank?.npnl?.toFixed(2)): "-₹" + ((-myRank?.npnl).toFixed(2))}
                        </MDTypography>
                      </Grid>
                      {/* <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={myProfitChange >= 0 ? "success" : "error"}>
                            {myProfitChange >= 0.00 ? "+" + (myProfitChange?.toFixed(2)): "-" + ((-myProfitChange).toFixed(2))}%
                        </MDTypography>
                      </Grid> */}

                </Grid>

                <Grid container mt={2}>
                    <Grid item xs={12} md={12} lg={12}>
                      <MDTypography fontSize={13} color="light">Top 10 Traders Rank</MDTypography>
                    </Grid>
                </Grid>

                {rankData.map((elem, index)=>{
                  // let netPnl = elem?.totalPnl - elem?.brokerage;
                  // let profitChange = netPnl*100/elem?.investedAmount;
                  return(
                    <Grid key={elem.name} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
  
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light">{index+1}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light">{elem?.name}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={elem.npnl >= 0 ? "success" : "error"}>
                            {elem.npnl >= 0.00 ? "+₹" + (elem.npnl?.toFixed(2)): "-₹" + ((-elem.npnl).toFixed(2))}
                        </MDTypography>
                      </Grid>
                      {/* <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={profitChange >= 0 ? "success" : "error"}>
                            {profitChange >= 0.00 ? "+" + (profitChange?.toFixed(2)): "-" + ((-profitChange).toFixed(2))}%
                        </MDTypography>
                      </Grid> */}

                    </Grid>
                  )

                })}
                </>
                }

            </MDBox>
        </Grid> 

    </>
);
}

export default memo(TradersRanking);