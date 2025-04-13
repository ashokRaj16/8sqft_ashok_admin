'use client'
import { Button } from '@/ui/Button';
import React, { useState } from 'react'
import BuilderPropertyDetailsComponent from './BuilderPropertyDetailsComponent';
import BuilderAmenitiesComponent from './BuilderAmenitiesComponent';
import BuilderGallary from './BuilderGallary';
import PreviewModeComponent from './PreviewMode';
const steps = ["Property Details", "Amenities", "Gallery & Verification", "Preview Mode"];
const StepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  return (
    <div className=" mx-auto p-6 border rounded-lg shadow-lg w-full">
    <div className="flex items-center justify-between mb-4 bg-white p-1 rounded-full shadow-custom mt-4">
      {steps.map((step, index) => (
      //   <div key={index} className={`flex items-center  ${currentStep < steps.length - 1 ? 'w-full' : 'w-auto'}`}>
      <div key={index} className="flex items-center w-full">

          <div >
           <div className={`w-8 h-8 text-sm flex items-center justify-center rounded-full text-white font-bold ${index < currentStep ? "bg-green" : index === currentStep ? "bg-black" : "bg-gray"
              }`}>{index < currentStep ? "✔" : index + 1}</div> 
          </div>
          {index === currentStep && (
            <span className="mx-2 font-medium text-black text-nowrap text-sm">{step}</span>
          )}
          {index < steps.length - 1 && (
            <div className={`w-full h-1 ${index < currentStep ? "bg-green" : "bg-gray"}`}></div>
          )}
        </div>
      ))}
    </div>

    <h2 className="text-xl font-bold text-center mb-4">{steps[currentStep]}</h2>

    <div className="">
      {currentStep === 0 && <BuilderPropertyDetailsComponent onNext={nextStep} />}
      {currentStep === 1 && <BuilderAmenitiesComponent onNext={nextStep} />}
      {currentStep === 2 &&  <BuilderGallary onNext={nextStep} />}
      {currentStep === 3 &&  <PreviewModeComponent onNext={nextStep} />}
    </div>

    <div className="flex justify-between">
      {currentStep > 0 && (
        <Button onClick={prevStep}>
          Previous
        </Button>
      )}
      {currentStep < steps.length - 1 ? (
        <Button onClick={nextStep}>
          Next
        </Button>
      ) : (
        <Button>
          Submit
        </Button>
      )}
    </div>
  </div>
  )
}

export default StepForm