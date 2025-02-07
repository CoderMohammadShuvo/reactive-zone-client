import DailySales from "@/components/admin-view/daily-sales";
import MonthlySales from "@/components/admin-view/monthly-sales";

function AdminFeatures() {
  return (
    <>
      <div>
        <DailySales />
      </div>
      <div>
        <MonthlySales />
      </div>
    </>
  );
}

export default AdminFeatures;
