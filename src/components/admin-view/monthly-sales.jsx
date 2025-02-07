import { useState, useEffect } from "react";

const MonthlySales = () => {
  const [dailySales, setDailySales] = useState([
    { date: "2025-01-01", totalAmount: 200, totalQuantity: 10 },
    { date: "2025-01-02", totalAmount: 150, totalQuantity: 8 },
    { date: "2025-01-03", totalAmount: 300, totalQuantity: 15 },
  ]);
  const [currentMonth, setCurrentMonth] = useState("2025-01");
  const [monthlyData, setMonthlyData] = useState([]);

  const calculateMonthlyTotals = (sales) => {
    const monthlyTotalAmount = sales.reduce(
      (sum, day) => sum + day.totalAmount,
      0
    );
    const monthlyTotalQuantity = sales.reduce(
      (sum, day) => sum + day.totalQuantity,
      0
    );
    return { monthlyTotalAmount, monthlyTotalQuantity };
  };

  const transitionToNextMonth = () => {
    const { monthlyTotalAmount, monthlyTotalQuantity } =
      calculateMonthlyTotals(dailySales);

    // Save current month data
    setMonthlyData((prev) => [
      ...prev,
      {
        month: currentMonth,
        totalAmount: monthlyTotalAmount,
        totalQuantity: monthlyTotalQuantity,
      },
    ]);

    // Clear daily sales and move to the next month
    setDailySales([]);
    const [year, month] = currentMonth.split("-");
    const nextMonth = new Date(year, parseInt(month), 1);
    setCurrentMonth(
      `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(
        2,
        "0"
      )}`
    );
  };

  const handleDeleteMonth = (monthToDelete) => {
    setMonthlyData((prev) =>
      prev.filter((month) => month.month !== monthToDelete)
    );
  };

  useEffect(() => {
    // Simulate end of month transition when data is added dynamically
    if (dailySales.length > 0) {
      const lastDate = new Date(dailySales[dailySales.length - 1].date);
      const nextMonthDate = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth() + 1,
        1
      );
      if (lastDate >= nextMonthDate) {
        transitionToNextMonth();
      }
    }
  }, [dailySales]);

  const { monthlyTotalAmount, monthlyTotalQuantity } =
    calculateMonthlyTotals(dailySales);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Monthly Sales Sheet - {currentMonth}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300 text-left">
                Date
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Total Amount ($)
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Total Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {dailySales.map((day, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">{day.date}</td>
                <td className="px-4 py-2 border border-gray-300">
                  ${day.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {day.totalQuantity}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-300 font-bold">
              <td className="px-4 py-2 border border-gray-300">Total</td>
              <td className="px-4 py-2 border border-gray-300">
                ${monthlyTotalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {monthlyTotalQuantity}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button
        onClick={transitionToNextMonth}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        End Month
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Monthly Data</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300 text-left">
                Month
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Total Amount ($)
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Total Quantity
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((month, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">
                  {month.month}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  ${month.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {month.totalQuantity}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => handleDeleteMonth(month.month)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlySales;
