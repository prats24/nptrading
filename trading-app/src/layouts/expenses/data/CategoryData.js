
export default function CategoryData() {

  return {
    // table header data declaration
    columns: [
        { Header: "View", accessor: "view", align: "center" },
        { Header: "Category Name", accessor: "categoryname", align: "center" },
        { Header: "Category ID", accessor: "categoryid", align: "center" },
        { Header: "# SubCategories", accessor: "subcategorycount", align: "center" },
        { Header: "Created On", accessor: "createdOn", align: "center" },
      ],

      rows: []

  };
}
