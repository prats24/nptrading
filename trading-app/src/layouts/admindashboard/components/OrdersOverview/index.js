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
import Card from "@mui/material/Card";
import Icon  from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "../../../../examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Latest Orders(Today)
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              130
            </MDTypography>{" "}
            orders so far
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="error"
          icon="notifications"
          title="Monika A bought 200 NIFTY2311217950PE"
          dateTime="01:45:13"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Anamika V bought 200 NIFTY2311217950CE"
          dateTime="01:30:12"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Shrikesh K bought 200 NIFTY2311217950CE"
          dateTime="01:25:15"
        />
        <TimelineItem
          color="error"
          icon="notifications"
          title="Praveen K sold 300 NIFTY2311217950PE"
          dateTime="01:23:12"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Ankit K bought 200 NIFTY2311217950CE"
          dateTime="11:22:14"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Ankit K bought 200 NIFTY2311217950CE"
          dateTime="11:22:14"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
