
import {memo, useEffect, useContext} from 'react';
import { marketDataContext } from "../../../../MarketDataContext";


function InstrumentComponent({last_price, change, contractDate, symbol, instrument, socket, instrumentToken}) {

    let styleTD = {
        textAlign: "center",
        fontSize: "15px",
        fontColor: "grey"
      }
    const marketDetails = useContext(marketDataContext)

    // console.log('Instrument rendering elem', elem);
    useEffect(()=>{

      // console.log("in socket useeffect")
      // axios.get(`${baseUrl}api/v1/getliveprice`)
      // .then((res) => {
      //     setMarketData(res.data);
      // }).catch((err) => {
      //     return new Error(err);
      // })
      socket.on('check', (data)=>{
        console.log("data from socket in instrument", data)
      })
  
      // socket.on("tick", (data) => {
        socket.on("tick-room1", (data) => {
  
        console.log('data from socket in instrument', data);
        console.log("marketdata", data)
        marketDetails.setMarketData(prevInstruments => {
          const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
          data.forEach(instrument => {
            instrumentMap.set(instrument.instrument_token, instrument);
          });
          return Array.from(instrumentMap.values());
        });
  
        // setMarketDataInPosition(prevInstruments => {
        //   const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        //   data.forEach(instrument => {
        //     instrumentMap.set(instrument.instrument_token, instrument);
        //   });
        //   return Array.from(instrumentMap.values());
        // });
      })
  
    }, [socket.id])


    console.log("socket print lsser", socket)

    // useEffect(() => {    
    //   return () => {
    //     socket.close();
    //   }
    // }, []);

    let perticularInstrumentMarketData = marketDetails.marketData.filter((subelem)=>{
      return instrumentToken === subelem.instrument_token
    })
    console.log('Instrument rendering for', marketDetails, socket);

  return (
    <>
        {/* {data.map((elem)=>{
            return( */}
                {/* <tr
                style={{borderBottom: "1px solid grey"}}
    
            > */}
                <td style={styleTD} >{contractDate}</td>
                <td style={styleTD} >{symbol}</td>
                <td style={styleTD} >{instrument}</td>
                <td style={styleTD} >{perticularInstrumentMarketData[0]?.last_price}</td>
                <td style={styleTD} >{perticularInstrumentMarketData[0]?.change}</td>
                {/* <td style={styleTD} >{chart}</td> */}
                {/* <td style={styleTD} >{elem.buy}</td>
                <td style={styleTD} >{elem.sell}</td>
                <td style={styleTD} >{elem.remove}</td> */}
    
            {/* </tr> */}
            {/* )
        })} */}

    </>
  );
}

export default InstrumentComponent;
















