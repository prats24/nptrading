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

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

// Images
import logoXD from "../../../../../assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "../../../../../assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "../../../../../assets/images/small-logos/logo-slack.svg";
import logoSpotify from "../../../../../assets/images/small-logos/logo-spotify.svg";
import logoJira from "../../../../../assets/images/small-logos/logo-jira.svg";
import logoInvesion from "../../../../../assets/images/small-logos/logo-invision.svg";
import team1 from "../../../../../assets/images/team-1.jpg";
import team2 from "../../../../../assets/images/team-2.jpg";
import team3 from "../../../../../assets/images/team-3.jpg";
import team4 from "../../../../../assets/images/team-4.jpg";

export default function data() {

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "contract date", accessor: "contractdate", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "avg. price", accessor: "avgprice", width: "10%", align: "center" },
      { Header: "ltp", accessor: "ltp", width: "10%", align: "center" },
      { Header: "gross p&l", accessor: "gpnl", width: "10%", align: "center" },
      { Header: "transaction cost", accessor: "tcost", width: "10%", align: "center" },
      { Header: "net p&l", accessor: "npnl", width: "10%", align: "center" },
    ],

    rows: [
      {
        contractdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            12-01-2023
          </MDTypography>
        ),
        instrument: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18500 CE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            NIFTY05JAN18500CE
          </MDTypography>
        ),
        avgprice: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹134.56
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹140.56
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,40,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹40,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,00,000.00
          </MDTypography>
        ),
      },

      {
        contractdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            12-01-2023
          </MDTypography>
        ),
        instrument: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18400 PE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            NIFTY05JAN18400PE
          </MDTypography>
        ),
        avgprice: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹164.76
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹145.43
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,20,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹20,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,00,000.00
          </MDTypography>
        ),
      },

    ],


  };
}
