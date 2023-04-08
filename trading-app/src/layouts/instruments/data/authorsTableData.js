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
import { useEffect, useState } from "react";

export default function data() {
//   let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

//   const [activeData, setActiveData] = useState([]);
//   const [inactiveData, setInActiveData] = useState([]);
//   const [reRender, setReRender] = useState(true);


//   useEffect(() => {
//     axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
//         .then((res) => {
//             let data = res.data;
//             let active = data.filter((elem) => {
//                 console.log(elem.createdOn, createdOn);
//                 return elem.status === "Active"
//             })
//             setActiveData(active);
//             console.log(active);

//             let inActive = data.filter((elem) => {
//                 return elem.status === "Inactive"
//             })
//             setInActiveData(inActive);
//             console.log(inactiveData);
//         }).catch((err)=>{
//             //window.alert("Server Down");
//             return new Error(err);
//         })
// }, [reRender])
  
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
      { Header: "Instruments", accessor: "Instruments", align: "center" },
      { Header: "Contract Date", accessor: "Contract Date", align: "center" },
      { Header: "Exchange", accessor: "Exchange", align: "center" },
      { Header: "Lot Size", accessor: "Lot Size", align: "center" },
      { Header: "Max Quantity", accessor: "Max Quantity", align: "center" },
      { Header: "Status", accessor: "Status", align: "center" },
      { Header: "Created On", accessor: "Created On", align: "center" },
      { Header: "Action", accessor: "Action", align: "center" },
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
