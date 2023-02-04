
export default function CreateCategoryTableData() {

    return {
      // table header data declaration
      columns: [
          { Header: "Delete", accessor: "delete", align: "center" },
          { Header: "SubCategory Name", accessor: "subcategoryname", align: "center" },
          { Header: "SubCategory ID", accessor: "subcategoryid", align: "center" },
          { Header: "status", accessor: "status", align: "center" }, 
        ],
  
        rows: []
  
    };
  }
  