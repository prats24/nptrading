
export default function SearchTableData() {

    return {
  
      columns: [
          { Header: "Name", accessor: "name", align: "center" },
          { Header: "Symbol", accessor: "symbol", align: "center" },
          { Header: "Expiry Date", accessor: "expiry", align: "center" },
          { Header: "Add", accessor: "add", align: "center" },
        //   { Header: "Lot Size", accessor: "lotsize", align: "center" },
        //   { Header: "Max Quantity", accessor: "maxquantity", align: "center" },
        //   { Header: "OTM P1", accessor: "otm_p1", align: "center" },
        //   { Header: "OTM P2", accessor: "otm_p2", align: "center" },
        //   { Header: "OTM P3", accessor: "otm_p3", align: "center" },
        //   { Header: "Status", accessor: "status", align: "center" },
        //   { Header: "Created On", accessor: "createdon", align: "center" },
          
        ],
  
        rows: []
  
    };
  }
  