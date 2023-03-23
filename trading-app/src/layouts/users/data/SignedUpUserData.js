
// Images

export default function AllActiveUsers() {



  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "First Name", accessor: "fname",align: "center" },
      { Header: "Last Name", accessor: "lname", align: "center"},
      { Header: "Email", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      { Header: "WhatsApp No.", accessor: "wmobile", align: "center"},
      { Header: "Gender", accessor: "gender", align: "center"},
      { Header: "Trading Exp.", accessor: "tradingexp",align: "center" },
      { Header: "City", accessor: "city",align: "center" },
      { Header: "Date of Birth", accessor: "dob", align: "center"},
      { Header: "Status", accessor: "status", align: "center"},
    ],

    rows: [],
  };
}