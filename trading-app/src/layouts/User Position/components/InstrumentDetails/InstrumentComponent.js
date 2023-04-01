
import {memo} from 'react';


function InstrumentComponent({last_price, change, contractDate, symbol, instrument, socket, instrumentToken}) {

    let styleTD = {
        textAlign: "center",
        fontSize: "15px",
        fontColor: "grey"
      }

  return (
    <>
      <td style={styleTD} >{contractDate}</td>
      <td style={styleTD} >{symbol}</td>
      <td style={styleTD} >{instrument}</td>
      <td style={styleTD} >{last_price}</td>
      <td style={styleTD} >{change}</td>
    </>
  );
}

export default memo(InstrumentComponent);


// {data.map((elem)=>{
//   return(
//       {/* <tr
//       style={{borderBottom: "1px solid grey"}}

//   > */}
//   <>

//       {/* <td style={styleTD} >{chart}</td> */}
//       {/* <td style={styleTD} >{elem.buy}</td>
//       <td style={styleTD} >{elem.sell}</td>
//       <td style={styleTD} >{elem.remove}</td> */}
//     <>
//   {/* </tr> */}
//    )
// })} 
















