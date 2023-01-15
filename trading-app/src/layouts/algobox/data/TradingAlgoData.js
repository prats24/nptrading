// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function TradingAlgoData() {
  // const Author = ({ image, name, email }) => (
  //   <MDBox display="flex" alignItems="center" lineHeight={1}>
  //     <MDAvatar src={image} name={name} size="sm" />
  //     <MDBox ml={2} lineHeight={1}>
  //       <MDTypography display="block" variant="button" fontWeight="medium">
  //         {name}
  //       </MDTypography>
  //       <MDTypography variant="caption">{email}</MDTypography>
  //     </MDBox>
  //   </MDBox>
  // );

  // const Job = ({ title, description }) => (
  //   <MDBox lineHeight={1} textAlign="left">
  //     <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
  //       {title}
  //     </MDTypography>
  //     <MDTypography variant="caption">{description}</MDTypography>
  //   </MDBox>
  // );



  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Algo Name", accessor: "algoName", align: "center" },
      { Header: "users", accessor: "mapUser", align: "center" },
      { Header: "Lot Multiplier", accessor: "lotMultipler", align: "center" },
      { Header: "Transaction", accessor: "transactionChange", align: "center" },
      { Header: "Margin Deduction", accessor: "marginDeduction", align: "center" },
      { Header: "Instrument", accessor: "instrumentChange", align: "center" },
      { Header: "Exchange", accessor: "exchangeChange", align: "center" },
      { Header: "Product", accessor: "productChange", align: "center" },
      { Header: "Real Trade", accessor: "isRealTrade", align: "center" },
      { Header: "Trading Account", accessor: "tradingAccount", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      
    ],

    rows: [
 
    ],
  };
}
