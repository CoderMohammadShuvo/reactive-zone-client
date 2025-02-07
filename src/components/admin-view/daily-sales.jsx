import { useState, useEffect } from "react";

const DailySales = () => {
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleInputChange = (id, field, value) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? {
            ...product,
            [field]: field === "price" || field === "quantity" ? +value : value,
          }
        : product
    );
    setProducts(updatedProducts);
  };

  const calculateTotals = () => {
    const totalAmount = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    return { totalAmount, totalQuantity };
  };

  const { totalAmount, totalQuantity } = calculateTotals();

  // Transition to the next day
  const transitionToNextDay = () => {
    setProducts([]); // Clear the daily sales sheet
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1); // Increment the day
    setCurrentDate(nextDay); // Update the current date
  };

  // Set up a timer to transition to the next day at midnight
  useEffect(() => {
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timer = setTimeout(() => {
      transitionToNextDay();
    }, timeUntilMidnight);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, [currentDate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Daily Sales Sheet - {currentDate.toDateString()}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300 text-left">
                Product Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Quantity
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Customer Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleInputChange(product.id, "name", e.target.value)
                    }
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleInputChange(product.id, "price", e.target.value)
                    }
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleInputChange(product.id, "quantity", e.target.value)
                    }
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    value={product.customer}
                    onChange={(e) =>
                      handleInputChange(product.id, "customer", e.target.value)
                    }
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  ${(product.price * product.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-300 font-bold">
              <td className="px-4 py-2 border border-gray-300" colSpan="3">
                Total
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {totalQuantity}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailySales;
