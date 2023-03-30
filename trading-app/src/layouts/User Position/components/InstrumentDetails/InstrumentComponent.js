


function InstrumentComponent({data}) {

    let styleTD = {
        textAlign: "center",
        fontSize: "15px",
        fontColor: "grey"
      }

  return (
    <>
        {data.map((elem)=>{
            return(
                <tr
                style={{borderBottom: "1px solid grey"}}
    
                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <td style={styleTD} >
                {elem.contractDate.props.children}
                </td>
                <td style={styleTD} >{elem.symbol.props.children}</td>
                <td style={styleTD} >{elem.instrument.props.children}</td>
                <td style={styleTD} >{elem.last_price.props.children}</td>
                <td style={styleTD} >{elem.change.props.children}</td>
                <td style={styleTD} >{elem.chart.props.children}</td>
                <td style={styleTD} >{elem.buy}</td>
                <td style={styleTD} >{elem.sell}</td>
                <td style={styleTD} >{elem.remove}</td>
    
            </tr>
            )
        })}

    </>
  );
}

export default InstrumentComponent;
















