export default function InvitedData() {



    return {
      columns: [
        { Header: "Name", accessor: "name",align: "center" },
        { Header: "Email", accessor: "email", align: "center"},
        { Header: "Mobile", accessor: "mobile", align: "center"},
        { Header: "Invited On", accessor: "invitedon", align: "center"},
        { Header: "Joined On", accessor: "joinedon", align: "center"},
        { Header: "Status", accessor: "status", align: "center"},
      ],
  
      rows: [],
    };
  }