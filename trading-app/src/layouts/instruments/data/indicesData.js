
export default function StockIndices() {

  return {

    columns: [
        { Header: "View", accessor: "view", align: "center" },
        { Header: "Display Name", accessor: "displayName", align: "center" },
        { Header: "Instrument Symbol", accessor: "instrumentSymbol", align: "center" },
        { Header: "Exchange", accessor: "exchange", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        
      ],

      rows: []

  };
}
