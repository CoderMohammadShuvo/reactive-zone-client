import React, { useCallback, useEffect, useState, useRef } from "react";

const valueCSS = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  gap: "2px",
  paddingTop: "10px",
};

const PriceRangeSlider = ({
  min = 0,
  max = 1000,
  trackColor = "#cecece",
  onChange,
  rangeColor = "#ff0303",
  valueStyle = valueCSS,
  width = "150px", // ✅ Set fixed width to 150px
  currencyText = "$",
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert value to percentage
  const getPercent = useCallback(
    (value) =>
      max - min === 0 ? 0 : Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update range slider width and position
  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Trigger onChange when values change
  useEffect(() => {
    if (minValRef.current !== minVal || maxValRef.current !== maxVal) {
      onChange({ min: minVal, max: maxVal });
      minValRef.current = minVal;
      maxValRef.current = maxVal;
    }
  }, [minVal, maxVal, onChange]);

  return (
    <div className="w-[150px] flex items-center justify-center flex-col space-y-4">
      {/* Display Price Range */}
      <div className="w-full px-4 flex items-center justify-between gap-x-3">
        <p className="text-sm text-black font-semibold">
          {currencyText} {minVal}
        </p>
        <div className="flex-1 border-dashed border border-neutral-500 mt-1"></div>
        <p className="text-sm text-black font-semibold">
          {currencyText} {maxVal}
        </p>
      </div>

      {/* Price Range Slider */}
      <div className="multi-slide-input-container relative w-[150px]">
        {/* Left Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 2); // ✅ Minimum gap of 2
            setMinVal(value);
          }}
          className="thumb thumb-left absolute"
          style={{
            width: "150px",
            zIndex: minVal >= maxVal - 10 ? 5 : 3,
          }}
        />

        {/* Right Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 2); // ✅ Minimum gap of 2
            setMaxVal(value);
          }}
          className="thumb thumb-right absolute"
          style={{
            width: "150px",
            zIndex: minVal >= maxVal - 10 ? 4 : 2,
          }}
        />

        {/* Track & Range */}
        <div className="slider relative w-full h-2">
          <div
            style={{ backgroundColor: trackColor }}
            className="track-slider absolute w-full h-full rounded"
          />
          <div
            ref={range}
            style={{ backgroundColor: rangeColor }}
            className="range-slider absolute h-full rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
