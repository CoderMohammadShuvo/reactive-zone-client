"use client";

import { useState, useCallback } from "react";
import { Range } from "react-range";

const PriceRangeSlider = ({
  min = 0,
  max = 1000,
  onChange,
  currencyText = "৳",
}) => {
  const [values, setValues] = useState([min, max]);

  const handleChange = (newValues) => {
    setValues(newValues);
    onChange({ min: newValues[0], max: newValues[1] });
  };

  return (
    <div className="w-full max-w-[350px] flex flex-col space-y-4">
            <h1 className="font-bold">Price Range</h1>
      {/* Min & Max Inputs */}
      <div className="flex justify-between items-center">
  
        <div className="flex items-center">
          {/* <span className="mr-1">{currencyText}</span> */}
          <input
            type="number"
            value={values[0]}
            onChange={(e) =>
              handleChange([Math.max(min, Number(e.target.value)), values[1]])
            }
            className="w-20 p-1 border rounded"
          />
        </div>
        <div className="flex items-center">
          {/* <span className="mr-1">{currencyText}</span> */}
          <input
            type="number"
            value={values[1]}
            onChange={(e) =>
              handleChange([values[0], Math.min(max, Number(e.target.value))])
            }
            className="w-20 p-1 border rounded"
          />
        </div>
      </div>

      {/* Range Slider */}
      <Range
        step={1}
        min={min}
        max={max}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="relative h-2 bg-gray-300 rounded"
            style={{ ...props.style }}
          >
            <div
              className="absolute h-full bg-blue-500 rounded"
              style={{
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                right: `${100 - ((values[1] - min) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-5 h-5 bg-blue-600 rounded-full border border-white shadow-md"
            style={{ ...props.style }}
          />
        )}
      />
    </div>
  );
};

export default PriceRangeSlider;
