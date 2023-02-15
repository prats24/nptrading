export default function MockCompanyPNL() {

  return {

    columns: [
      { Header: "date", accessor: "date", align: "center" },
      { Header: "weekday", accessor: "weekday", align: "center" },
      { Header: "Gross P&L", accessor: "gpnl", align: "center" },
      { Header: "Transaction Cost", accessor: "tcost", align: "center" },
      { Header: "Net P&L", accessor: "npnl", align: "center" },
      { Header: "# of Trades", accessor: "trades", align: "center" },
    ],

      rows: []

  };
}
