import React, { useState, useEffect, useRef } from "react";

const StepperControl = ({ handleClick, currentStep, steps }) => {
  return (
    <div className="container flex justify-around mt-4 mb-8">
      <button
        onClick={() => handleClick()}
        className={`cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2 px-4 font-semibold uppercase text-slate-400 transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white  ${currentStep === 1 ? " cursor-not-allowed opacity-50 " : ""
          }`}
      >
        Back
      </button>

      <button
        onClick={() => handleClick("next")}
        className="px-4 py-2 font-semibold text-white uppercase transition duration-200 ease-in-out bg-green-500 rounded-lg cursor-pointer hover:bg-slate-700 hover:text-white"
      >
        {currentStep === steps.length  ? "Confirm" : "Next"}
      </button>
    </div>
  );
}

export default StepperControl;
