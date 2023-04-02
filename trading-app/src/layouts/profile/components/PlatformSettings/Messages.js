import React from 'react';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

function Message() {
  return (
    <>
    <MDBox>
      <MDTypography mt={5} mb={5} width="100%" display="flex" justifyContent="center">No messages to display</MDTypography>
    </MDBox>
</>
  );
}

export default Message;
