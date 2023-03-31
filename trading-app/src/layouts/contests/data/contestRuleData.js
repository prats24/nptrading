
export default function ContestRules() {

    return {
  
      columns: [
          { Header: "View", accessor: "view", align: "center" },
          { Header: "Rule Name", accessor: "ruleName", align: "center" },
          { Header: "Created By", accessor: "createdby", align: "center" },
          { Header: "Created On", accessor: "creeatedon", align: "center" },
          { Header: "Status", accessor: "status", align: "center" },
          
        ],
  
        rows: []
  
    };
  }
  