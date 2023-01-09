// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function BrokerageData() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Broker", accessor: "Broker", align: "center" },
      { Header: "Transaction", accessor: "Transaction", align: "center" },
      { Header: "Type", accessor: "Type", align: "center" },
      { Header: "Exchange", accessor: "Exchange", align: "center" },
      { Header: "Brokerage Charge", accessor: "Brokerage Charge", align: "center" },
      { Header: "Exchange Charge", accessor: "Exchange Charge", align: "center" },
      { Header: "GST(%)", accessor: "GST(%)", align: "center" },
      { Header: "SEBI Charges", accessor: "SEBI Charges", align: "center" },
      { Header: "Stamp Duty Charges", accessor: "Stamp Duty Charges", align: "center" },
      { Header: "SST", accessor: "SST", align: "center" },
      { Header: "CTT", accessor: "CTT", align: "center" },
      { Header: "DP Charges", accessor: "DP Charges", align: "center" },
    ],

    rows: [
      {
        author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
        function: <Job title="Manager" description="Organization" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            23/04/18
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
    ],
  };
}
