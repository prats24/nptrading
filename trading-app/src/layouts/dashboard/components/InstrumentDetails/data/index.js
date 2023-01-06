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
import MDButton from "../../../../../components/MDButton";
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
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "ltp", accessor: "ltp", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "pchange", width: "10%", align: "center" },
      { Header: "", accessor: "buy", width: "5%", align: "center" },
      { Header: "", accessor: "sell", width: "5%", align: "center" },
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
            NIFTY05JAN18500CE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18500 CE
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹148.56
          </MDTypography>
        ),
        pchange: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +3%
          </MDTypography>
        ),
        buy: (
          <MDButton href="../../authentication/sign-in" variant="contained" color="info" fullWidth>
            BUY
          </MDButton>     
        ),
        sell: (
          <MDButton href="../../authentication/sign-in" variant="contained" color="error" fullWidth>
            SELL
          </MDButton> 
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
            NIFTY05JAN18500CE
          </MDTypography>
        ),
        symbol: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18500 CE
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹140.56
          </MDTypography>
        ),
        pchange: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +5%
          </MDTypography>
        ),
        buy: (
          <MDButton href="/authentication/sign-in" variant="contained" color="info" fullWidth>
                BUY
          </MDButton>     
        ),
        sell: (
          <MDButton href="/authentication/sign-in" variant="contained" color="error" fullWidth>
          SELL
          </MDButton> 
        ),
      },

    ],


  };
}
