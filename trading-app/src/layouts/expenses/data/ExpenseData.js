
// Images

export default function ExpenseData() {



  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "Expense By", accessor: "expenseby",align: "center" },
      { Header: "Cateory", accessor: "category",align: "center" },
      { Header: "Sub Cateogry", accessor: "subcategory",align: "center" },
      { Header: "amount", accessor: "amount", align: "center"},
      { Header: "gst", accessor: "gst", align: "center"},
      // { Header: "Gender", accessor: "gender", align: "center"},
      // { Header: "Trading Exp.", accessor: "tradingexp",align: "center" },
      { Header: "total amount", accessor: "totalamount",align: "center" },
      { Header: "description", accessor: "description", align: "center"},
      { Header: "payment status", accessor: "paymentstatus", align: "center"},
      // { Header: "User Password", accessor: "userPass", align: "center"},
      { Header: "Upload Invoice", accessor: "invoice", align: "center"},
      { Header: "Created On", accessor: "createdon", align: "center"},
    ],

    rows: [],
  };
}