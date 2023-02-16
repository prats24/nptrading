export default function data() {
    
    return {
      columns: [
        { Header: "Trader Name", accessor: "traderName", width: "15%", align: "center" },
        { Header: "Gross P&L", accessor: "grossPnl", width: "12.5%", align: "center" },
        { Header: "Running Lots", accessor: "runningLots", width: "12.5%", align: "center" },
        { Header: "Mock/Real", accessor: "realOrMock", width: "4%", align: "center" },
      ],
  
      rows: [
  
      ],
  
  
    };
  }
  