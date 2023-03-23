
// @mui material components

export default function Data() {


  return {
    columns: [
      { Header: "Product", accessor: "product", width: "10%", align: "center" },
      { Header: "Instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "Instrument Type", accessor: "instrumenttype", width: "10%", align: "center" },
      { Header: "App Running Lots", accessor: "apprunninglots", width: "10%", align: "center" },
      { Header: "Zerodha Running Lots", accessor: "zerodharunninglots", width: "10%", align: "center" },
      { Header: "app gross p&l", accessor: "appgrosspnl", width: "10%", align: "center" },
      { Header: "zerodha gross p&l", accessor: "zerodhagrosspnl", width: "10%", align: "center" },
    ],

    rows: []
  };
}
