
// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import CategoryData from "./data/CategoryData";
import ExpenseData from "./data/ExpenseData";
import ExpenseHeader from "./Header";


function Tables() {
  const { columns, rows } = CategoryData();
  const { columns: pColumns, rows: pRows } = ExpenseData();

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ExpenseHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
