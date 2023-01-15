
export default function AllInactiveAccounts() {


  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Broker", accessor: "broker", align: "center" },
      { Header: "Account ID", accessor: "accountid", align: "center" },
      { Header: "Account Name", accessor: "accountname", align: "center" },
      { Header: "API Key", accessor: "apikey", align: "center" },
      { Header: "API Secret", accessor: "apisecret", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Created On", accessor: "createdon", align: "center" },
    ],

    rows: [],
  };
}
