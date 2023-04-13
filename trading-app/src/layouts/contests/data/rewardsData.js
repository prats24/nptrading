import * as React from 'react';
import {useContext, useState} from "react";
import axios from "axios";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import ContestRewardData from '../data/contestRewardsData'

export default function ContestRewards({id, oldObjectId, addRewardObject, setAddRewardObject}) {

// console.log("Rewards Data rending...")
// console.log(id,addRewardObject)
const { columns, rows } = ContestRewardData();
const [contestData,setContestData] = useState();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
React.useEffect(()=>{

  axios.get(`${baseUrl}api/v1/contest/${id ? id : oldObjectId}`)
  .then((res)=>{
          setContestData(res.data?.data);
          // console.log("Contest Data in Rewards Dat File: ",res.data?.data)
  }).catch((err)=>{
      return new Error(err);
  })

},[addRewardObject,oldObjectId])

contestData?.rewards.map((elem)=>{
  let contestReward = {}

  contestReward.rankStart = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.rankStart}
    </MDTypography>
  );
  contestReward.rankEnd = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.rankEnd}
    </MDTypography>
  );
  contestReward.reward = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.reward}
    </MDTypography>
  );
  contestReward.currency = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.currency}
    </MDTypography>
  );
  contestReward.edit = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      Edit
    </MDButton>
  );
  contestReward.delete = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      Delete
    </MDButton>
  );

  rows.push(contestReward)
})

    // console.log(rows)

// console.log(contestData)
// console.log("Reward Rows: ",rows)

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Ranks added to the contest will show up here!
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

