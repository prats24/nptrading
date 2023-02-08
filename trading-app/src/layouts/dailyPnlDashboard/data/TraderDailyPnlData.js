export default function TraderDailyPnlData() {

  let traderDailyPnlData = [];
  
  

  return {
    columns: [
      { Header: "Trader", accessor: "trader",align: "center" },
      { Header: "timestamp", accessor: "_id",align: "center" },
      { Header: "Gross P&L", accessor: "pnl",align: "center" },
      { Header: "trades", accessor: "trades", align: "center"},
    ],

    rows: [],
  };
}