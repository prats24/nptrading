// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function MapUserData() {


  return {
    columns: [
      { Header: "User Name", accessor: "algoName", align: "center" },
      { Header: "Enable Trading", accessor: "mapUser", align: "center" },
      { Header: "Real Trading", accessor: "transactionChange", align: "center" },
      { Header: "Action", accessor: "instrumentChange", align: "center" },      
    ],

    rows: [
 
    ],
  };
}
