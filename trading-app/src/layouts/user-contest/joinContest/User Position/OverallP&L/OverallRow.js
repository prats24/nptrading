
import {memo} from 'react';
import colors from '../../../../../assets/theme/base/colors';


function OverallRow({last_price, change, grossPnl, avgPrice, product, symbol, quantity, netPnl}) {

    let styleTD = {
        textAlign: "center",
        fontSize: ".75rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600"
      }

  return (
    <>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : product === 'NRML' ? colors.info.main : product === 'MIS' ? colors.warning.main : 'red'}`, paddingLeft: "20px"}} >{product}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : symbol?.includes('CE') ? "green" : "red"}` }} >{symbol}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : quantity > 0 ? "green" : "red"}`}} >{quantity}</td>
      <td style={{...styleTD}} >{avgPrice}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : (change?.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : grossPnl?.includes('+') > 0 ? "green" : "red"}`}} >{grossPnl}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : netPnl?.includes('+') > 0 ? "green" : "red"}`}} >{netPnl}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : (change?.includes('+')) ? "green" : "red"}`}} >{change}</td>
    </>
  );
}

export default memo(OverallRow);

