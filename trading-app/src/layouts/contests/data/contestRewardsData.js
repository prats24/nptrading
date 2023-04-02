export default function ContestRewards() {

    return {
  
      columns: [
          { Header: "Rank Start", accessor: "rankStart", align: "center" },
          { Header: "Rank End", accessor: "rankEnd", align: "center" },
          { Header: "Reward", accessor: "reward", align: "center" },
          { Header: "Currency", accessor: "currency", align: "center" },
          { Header: "Edit", accessor: "edit", align: "center" },
          { Header: "Delete", accessor: "delete", align: "center" },
        ],
  
        rows: []
  
    };
  }