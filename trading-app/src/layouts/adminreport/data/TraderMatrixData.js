export default function MockCompanyPNLTWise() {

    return {
  
      columns: [
        { Header: "Trader Name", accessor: "trader", align: "center" },
        { Header: "G-P&L", accessor: "ltgpnl", align: "center" },
        { Header: "N-P&L", accessor: "ltnpnl", align: "center" },
        { Header: "Cummulative G-P&L(+ Days)", accessor: "cpgpnl", align: "center" },
        { Header: "Cummulative G-P&L(- Days)", accessor: "cngpnl", align: "center" },
        { Header: "Ratio (Red/Green Days G-P&L)", accessor: "ratio", align: "center" },
        { Header: "Probable Avg. G-P&L", accessor: "probablepnl", align: "center" },
        { Header: "# Trading Days", accessor: "tradingdays", align: "center" },
        { Header: "% Red Days", accessor: "preddays", align: "center" },
        { Header: "% Green Days", accessor: "pgreendays", align: "center" },
        { Header: "# Red Days", accessor: "reddays", align: "center" },
        { Header: "# Green Days", accessor: "greendays", align: "center" },
        { Header: "Avg. Red Days G-P&L", accessor: "areddaysgpnl", align: "center" },
      ],
  
        rows: []
  
    };
  }
  