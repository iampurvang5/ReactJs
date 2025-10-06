import React, { useState } from 'react';

const ProgressBar = ({ steps, currentStep: initialCurrentStep = 2, isDetailPage = false }) => {
  // Static data for showcase when no steps prop is provided
  const defaultSteps = [
    { label: 'Planning', description: 'Define project scope and requirements' },
    { label: 'Development', description: 'Build and test the core functionality' },
    { label: 'Testing', description: 'Run QA tests and fix bugs' },
    { label: 'Deployment', description: 'Release the project to production' },
    { label: 'Maintenance', description: 'To miantain project' },

  ];

  const [activeSteps, setActiveSteps] = useState(steps || defaultSteps);
  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const validCurrentStep =currentStep; //Math.max(0, Math.min(currentStep, activeSteps.length));
  const lastStepIndex = activeSteps.length - 1;

    console.log('validCurrentStep:', validCurrentStep);
    console.log('lastStepIndex:', lastStepIndex);
    console.log('activeSteps.length:', activeSteps.length);

  
  const handleNext = () => {
    console.log('handleNext called validCurrentStep:', validCurrentStep);
    
    if (validCurrentStep < activeSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (validCurrentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAddStep = (e) => {
    e.preventDefault();
    if (newLabel && newDescription) {
      setActiveSteps((prevSteps) => [
        ...prevSteps,
        { label: newLabel, description: newDescription },
      ]);
      setNewLabel('');
      setNewDescription('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className={`w-full bg-gray-100 mx-auto flex flex-col items center rounded ${isDetailPage ? 'p-8 min-h-[400px]' : 'p-4 h-48 flex flex-col justify-center'}`}>
      <ol className="flex items-center w-full">
        {activeSteps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center after:content-[''] ${index !== lastStepIndex ? 'w-full after:w-full after:h-1 after:border-b after:border-4 after:inline-block': ''}
              ${(index +1) < validCurrentStep ? 'after:border-green-500' : (index+1) === validCurrentStep ? 'after:border-gray-300 ' : index === lastStepIndex?'': 'after:border-gray-300'}`}
          >
            <div>
              {/* Step Number or Icon */}
              <span
                className={`text-sm font-bold transition-colors flex flex-col items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 group relative z-10
                  ${(index+1) < validCurrentStep ? 'bg-green-600 text-white' : (index +1) === validCurrentStep ? 'bg-white text-blue-600 border' : 'bg-white text-gray-500'}`}
              >
                {index + 1}
              </span>
            {/* <span className={`ml-2 text-sm font-medium ${isDetailPage ? 'lg:text-base' : 'text-xs'} ${(index +1) < validCurrentStep ? 'text-green-600' : (index +1) === validCurrentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</span> */}
              {/* Tooltip */}
              <div
                className={`absolute top-12 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-max max-w-xs
                  ${isDetailPage ? '' : 'text-xs max-w-[150px]'}`}
              >
                {step.description}
              </div>
            </div>

          </li>
        ))}
      </ol>

      {/* Controls (Next, Previous, Add Step) - Shown only in detail view */}
      {isDetailPage && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={validCurrentStep < activeSteps.length ? false : true}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition"
          >
            Next
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Step
          </button>
        </div>
      )}

      {/* Form for adding new step - Shown only when isFormOpen is true */}
      {isFormOpen && isDetailPage && (
        <form onSubmit={handleAddStep} className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              id="label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProgressBar;