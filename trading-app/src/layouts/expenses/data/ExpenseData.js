
// Images

export default function Expenses() {



  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "Employee ID", accessor: "employeeid",align: "center" },
      { Header: "Name", accessor: "name",align: "center" },
      { Header: "Designation", accessor: "designation",align: "center" },
      { Header: "Email ID", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      // { Header: "Gender", accessor: "gender", align: "center"},
      // { Header: "Trading Exp.", accessor: "tradingexp",align: "center" },
      { Header: "Location", accessor: "location",align: "center" },
      { Header: "Date of Joining", accessor: "doj", align: "center"},
      { Header: "Role", accessor: "role", align: "center"},
      // { Header: "User Password", accessor: "userPass", align: "center"},
      { Header: "Status", accessor: "status", align: "center"},
    ],

    rows: [],
  };
}