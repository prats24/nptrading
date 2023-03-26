
export default function AllActiveInstruments() {

  return {

    columns: [
        { Header: "Instruments", accessor: "instruments", align: "center" },
        { Header: "Contract Date", accessor: "contractdate", align: "center" },
        { Header: "Exchange", accessor: "exchange", align: "center" },
        { Header: "Lot Size", accessor: "lotsize", align: "center" },
        { Header: "Max Quantity", accessor: "maxquantity", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Created On", accessor: "createdon", align: "center" },
        
      ],

      rows: []

  };
}
