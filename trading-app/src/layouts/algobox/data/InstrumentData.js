// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function InstrumentData() {

  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Created On", accessor: "Created On", align: "center" },
      { Header: "Instrument Name (Incoming)", accessor: "Instrument Name (Incoming)", align: "center" },
      { Header: "Incoming Instrument Code", accessor: "Incoming Instrument Code", align: "center" },
      { Header: "Instrument Name (Outgoing)", accessor: "Instrument Name (Outgoing)", align: "center" },
      { Header: "Outgoing Instrument Code", accessor: "Outgoing Instrument Code", align: "center" },
      { Header: "Status", accessor: "Status", align: "center" },
    ],

    rows: [

    ],
  };
}
