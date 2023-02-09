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
      { Header: "Created On", accessor: "createdOn", align: "center" },
      { Header: "Instrument Name (Incoming)", accessor: "incomingInstrument", align: "center" },
      { Header: "Incoming Instrument Code", accessor: "incomingInstrumentCode", align: "center" },
      { Header: "Instrument Name (Outgoing)", accessor: "outgoingInstrument", align: "center" },
      { Header: "Outgoing Instrument Code", accessor: "outgoingInstrumentCode", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],

    rows: [

    ],
  };
}
