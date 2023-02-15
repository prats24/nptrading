export default function MockTraderPNLTWise() {

    return {
  
      columns: [
        { Header: "Trader Name", accessor: "trader", align: "center" },
        { Header: "Gross P&L", accessor: "gpnl", align: "center" },
        { Header: "Brokerage", accessor: "brokerage", align: "center" },
        { Header: "Net P&L", accessor: "npnl", align: "center" },
        { Header: "# of Trades", accessor: "trades", align: "center" },
      ],
  
        rows: []
  
    };
  }
  