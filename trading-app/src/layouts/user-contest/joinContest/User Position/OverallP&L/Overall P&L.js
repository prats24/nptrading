export default function OverallPL() {
  

  return {
    columns: [
      { Header: "Product", accessor: "Product", width: "10%", align: "center" },
      { Header: "Instrument", accessor: "symbol", width: "10%", align: "center" },
      { Header: "Quantity", accessor: "Quantity", width: "10%", align: "center" },
      { Header: "Avg. Price", accessor: "avgPrice", width: "10%", align: "center" },
      { Header: "LTP", accessor: "last_price", width: "10%", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },
      { Header: "Exit Position", accessor: "exit", width: "10%", align: "center" },
      { Header: "BUY", accessor: "buy", width: "10%", align: "center" },
      { Header: "SELL", accessor: "sell", width: "10%", align: "center" },
    ],

    rows: [

    ],
  };
}
