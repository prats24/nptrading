
export default function CreateExpenseTableData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Delete", accessor: "delete", align: "center" },
          { Header: "Gender", accessor: "gender", align: "center" },
          { Header: "Body Condition", accessor: "bodycondition", align: "center" },
          { Header: "Age Group Unit", accessor: "agegroupunit", align: "center" }, 
          { Header: "Age Group Start", accessor: "agegroupstart", align: "center" },
          { Header: "Age Group End", accessor: "agegroupend", align: "center" },
          { Header: "Range", accessor: "range", align: "center" },
          
        ],
  
        rows: []
  
    };
  }
  