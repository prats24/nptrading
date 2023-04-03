export default function AllReferrals() {



    return {
      columns: [
        { Header: "Full Name", accessor: "fullName",align: "center" },
        { Header: "Email ID", accessor: "email", align: "center"},
        { Header: "Date of Joining", accessor: "doj", align: "center"},
        { Header: "Status", accessor: "status", align: "center"},
      ],
  
      rows: [],
    };
  }