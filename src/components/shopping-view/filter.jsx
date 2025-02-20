import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import PriceRangeSlider from "./priceSlider";

function ProductFilter({ filters, handleFilter }) {
  const [priceRange, setPriceRange] = useState({ min: 10, max: 10000 });

  const handlePriceChange = (range) => {
    setPriceRange(range);
    handleFilter("price", range);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>

        {/* Price Range Filter */}
        <div className="w-full mt-4 flex flex-col space-y-2">
          <PriceRangeSlider
            min={10}
            max={10000}
            onChange={handlePriceChange}
            currencyText="$"
          />
        </div>
      </div>

      {/* Other Filters */}
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    className="flex font-medium items-center gap-2"
                    key={option.id}
                  >
                    <Checkbox
                      checked={filters?.[keyItem]?.includes(option.id) ?? false}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
