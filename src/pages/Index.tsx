
import React, { useState } from 'react';
import HealthGoalForm from '@/components/HealthGoal/HealthGoalForm';
import { HealthGoal } from '@/types/goalTypes';

const Index = () => {
  const [savedGoal, setSavedGoal] = useState<HealthGoal | null>(null);

  const handleSaveGoal = (goal: HealthGoal) => {
    setSavedGoal(goal);
    console.log('Saved goal:', goal);
  };

  // Example data (uncomment to pre-populate the form)
  /*
  const exampleData: HealthGoal = {
    goal_name: "Manage Headache Symptoms",
    target_date: "2024-08-10",
    comments: "Initial goal to reduce headache frequency and intensity.",
    metrics: [
      {
        metric_name: "Headache Frequency",
        unit: "episodes/week",
        interval: 72,
        target_value: 1
      },
      {
        metric_name: "Headache Intensity",
        unit: "scale 1-10",
        interval: 72,
        target_value: 3
      }
    ],
    actions: [
      {
        name: "Hydration",
        description: "Drink at least 8 glasses of water daily.",
        interval: 24,
        action_end_date: "2024-08-10"
      },
      {
        name: "Pain Relief",
        description: "Take over-the-counter pain reliever as needed for headaches, not exceeding recommended dosage.",
        interval: 0,
        action_end_date: "2024-08-10"
      }
    ]
  };
  */

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Health Goal Tracking</h1>
        
        <HealthGoalForm 
          // initialData={exampleData} // Uncomment to use example data
          onSave={handleSaveGoal} 
        />
        
        {savedGoal && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Successfully Saved Goal:</h2>
            <pre className="bg-white p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(savedGoal, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
