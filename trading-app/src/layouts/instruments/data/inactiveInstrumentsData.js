
export default function AllInActiveInstruments() {

  return {

    columns: [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Instruments", accessor: "instruments", align: "center" },
        { Header: "Contract Date", accessor: "contractdate", align: "center" },
        { Header: "Exchange", accessor: "exchange", align: "center" },
        { Header: "Lot Size", accessor: "lotsize", align: "center" },
        { Header: "Max Quantity", accessor: "maxquantity", align: "center" },
        { Header: "OTM P1", accessor: "otm_p1", align: "center" },
        { Header: "OTM P2", accessor: "otm_p2", align: "center" },
        { Header: "OTM P3", accessor: "otm_p3", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Created On", accessor: "createdon", align: "center" },
        
      ],

      rows: []

  };
}
