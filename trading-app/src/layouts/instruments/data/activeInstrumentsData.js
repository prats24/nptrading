
export default function AllActiveInstruments() {

  return {

    columns: [
        { Header: "Edit", accessor: "edit", align: "center", width:"3%" },
        { Header: "Instruments", accessor: "instruments", align: "center" },
        { Header: "Contract Date", accessor: "contractdate", align: "center" },
        { Header: "Exchange", accessor: "exchange", align: "center" },
        { Header: "Lot Size", accessor: "lotsize", align: "center" },
        { Header: "Max Quantity", accessor: "maxquantity", align: "center" },
        { Header: "OTM", accessor: "otm", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Created On", accessor: "createdon", align: "center" },
        
      ],

      rows: []

  };
}
