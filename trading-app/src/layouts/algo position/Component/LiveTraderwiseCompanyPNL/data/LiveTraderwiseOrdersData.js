export default function TradersOrderData() {

  return {
    columns: [
      { Header: "trader", accessor: "trader",align: "center" },
      { Header: "Product", accessor: "product",align: "center" },
      { Header: "Instrument", accessor: "instrument",align: "center" },
      { Header: "Type", accessor: "type", align: "center"},
      { Header: "Quantity", accessor: "quantity", align: "center"},
      { Header: "Average Price", accessor: "averageprice", align: "center"},
      { Header: "Brokerage", accessor: "brokerage", align: "center"},
      { Header: "Amount", accessor: "amount", align: "center"},
      { Header: "Timestamp", accessor: "timestamp", align: "center"},
    ],

    rows: [],
  };
}