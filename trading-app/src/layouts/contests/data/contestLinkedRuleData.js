import * as React from 'react';
import {useState} from "react";
import axios from "axios";
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";

import LinkedContestRule from './linkedRuleData'

export default function ContestLinkedRuleData({linkedRuleId,setLinkedRuleId,isSubmitted,setIsSubmitted}) {

// console.log("Rule Data rending...")
console.log("Linked Rule Id",linkedRuleId)
const { columns, rows } = LinkedContestRule();
const [linkedRuleData,setLinkedRuleData] = useState();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
React.useEffect(()=>{

  axios.get(`${baseUrl}api/v1/contestrule/${linkedRuleId}`)
  .then((res)=>{
          setLinkedRuleData(res.data[0]);
          console.log("Rule Data in Contest : ",res.data[0])
  }).catch((err)=>{
      return new Error(err);
  })

},[linkedRuleId,isSubmitted])

linkedRuleData?.contestRules?.map((elem)=>{
  let linkedRule = {}

  linkedRule.ruleno = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.orderNo}
    </MDTypography>
  );
  linkedRule.rule = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.rule}
    </MDTypography>
  );
  
  rows.push(linkedRule)
})

    // console.log(rows)

console.log("Linked Rule Data in contest linked rule data: ",linkedRuleData)
// console.log("Rule Rows: ",rows)

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Rules linked to the contest will show here!
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  

  );
}

