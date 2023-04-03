
import {memo} from 'react';


function OverallRow({last_price, change, grossPnl, avgPrice, product, symbol, quantity}) {

    let styleTD = {
        textAlign: "center",
        fontSize: ".75rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600"
      }

  return (
    <>
      {/* <td style={styleTD} >{contractDate}</td> */}
      <td style={{...styleTD, color: `${product === 'NRML' ? "blue" : product === 'MIS' ? 'yellow' : 'red'}`}} >{product}</td>
      <td style={{...styleTD, color: `${symbol?.includes('CE') ? "green" : "red"}` }} >{symbol}</td>
      <td style={{...styleTD, color: `${quantity > 0 ? "green" : "red"}`}} >{quantity}</td>
      <td style={{...styleTD}} >{avgPrice}</td>
      <td style={{...styleTD, color: `${(change?.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${grossPnl?.includes('+') > 0 ? "green" : "red"}`}} >{grossPnl}</td>
      <td style={{...styleTD, color: `${(change?.includes('+')) ? "green" : "red"}`}} >{change}</td>
    </>
  );
}

export default memo(OverallRow);

