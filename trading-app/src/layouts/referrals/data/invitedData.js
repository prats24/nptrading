export default function InvitedData() {



    return {
      columns: [
        { Header: "Name", accessor: "name",align: "center" },
        { Header: "Email ID", accessor: "email", align: "center"},
        { Header: "Invited On", accessor: "invitedon", align: "center"},
        { Header: "Status", accessor: "status", align: "center"},
      ],
  
      rows: [],
    };
  }