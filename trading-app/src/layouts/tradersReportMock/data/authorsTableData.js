/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function UserReportData() {
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

  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/readuserdetails`)
  //   .then((res) => {
  //       setUserDetail(res.data);
  //   }).catch((err) => {
  //       return new Error(err);
  //   })
  // }, [])

  return {
    columns: [
      { Header: "Trader Name", accessor: "name", align: "center" },
      { Header: "Date", accessor: "date", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", align: "center" },
      { Header: "Transaction Cost", accessor: "brokerage", align: "center" },
      { Header: "Net P&L", accessor: "netPnl", align: "center" },
      { Header: "# of Trades", accessor: "noOfTrade", align: "center" },
      { Header: "# of Lots Used", accessor: "lotUsed", align: "center" },
    ],

    rows: [

    ],
  };
}
