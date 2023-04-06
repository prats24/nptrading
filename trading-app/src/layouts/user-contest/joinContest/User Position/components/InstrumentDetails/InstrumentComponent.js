
import {memo} from 'react';


function InstrumentComponent({last_price, change, contractDate, symbol, instrument}) {

    let styleTD = {
        textAlign: "center",
        fontSize: ".75rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600"
      }

  return (
    <>
      <td style={styleTD} >{contractDate}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{symbol}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{instrument}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{change}</td>
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
















