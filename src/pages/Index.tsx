
import React, { useState } from 'react';
import MedicalScribeView from '@/components/MedicalScribe/MedicalScribeView';
import { MedicalScribeData, HealthGoal, ProfileData, ReviewData, Transcript } from '@/types/goalTypes';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [medicalData, setMedicalData] = useState<MedicalScribeData>({
    transcript: [
      {
        time: "2025-03-09T15:30:00Z",
        speaker: "patient",
        content: "I have been experiencing a persistent headache."
      },
      {
        time: "2025-03-09T15:35:00Z",
        speaker: "doctor",
        content: "Can you describe the nature of your pain?"
      }
    ],
    note: {
      profile_data: {
        demographics: {
          date_of_birth: "1978-05-15",
          gender: "female",
          location: {
            country_code: "US",
            geo_risks: {}
          }
        },
        genetic_proxies: {
          blood_type: "O+",
          family_history: {},
          phenotypic_markers: [],
          medication_sensitivities: []
        },
        environment: {},
        lifestyle: {
          circadian_rhythm: "Regular",
          nutrition: {},
          activity: {},
          social_history: {},
          biometrics: {
            height: 165,
            weight: 70,
            bmi: 25.7,
            health_score: 75
          }
        },
        clinical_status: {
          chronic_conditions: [],
          peculiarities: [],
          medications: {},
          care_team: {
            primary_doctor: {
              id: 123,
              name: "Dr. Smith",
              clinic_name: "General Clinic",
              specialty: "General Practice",
              phone_number: "+15551234567"
            }
          }
        },
        temporal_context: {
          current_time: "2024-07-27T10:00:00Z",
          patient_local_time: "2024-07-27T06:00:00-04:00",
          timezone: "America/New_York"
        }
      },
      goal_data: {
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
      },
      review_data: {
        subjective: {
          chief_complaint: "Headaches",
          history_of_present_illness: "Patient presents with recurring headaches for the past month, experiencing 2-3 episodes per week. Intensity varies from 4-7 on a scale of 1-10."
        },
        objective: {
          examination_findings: "Physical exam unremarkable. Neurological exam normal.",
          investigations: "None conducted at this time."
        },
        assessment: {
          primary_diagnosis: "Tension Headache",
          differential_diagnosis: "Migraine, Sinus Headache",
          diagnosis_reasoning: "Based on patient's description of headache characteristics and lack of focal neurological deficits.",
          status: "stable"
        },
        plan: {
          management: "Recommend lifestyle modifications including increased hydration and stress management. Over-the-counter pain relief as needed. Monitor headache frequency and intensity.",
          lifestyle_advice: "Increase water intake, ensure adequate sleep, explore stress reduction techniques.",
          follow_up: "Schedule follow-up appointment in 2 weeks to reassess symptoms and treatment effectiveness.",
          patient_education: "Provided information on tension headaches, lifestyle modifications, and medication use.",
          treatment_goal: "Reduce headache frequency and intensity to improve patient's quality of life.",
          plan_reasoning: "Conservative management approach for suspected tension headaches, with close follow-up to monitor progress and adjust plan if needed."
        },
        next_review: "2024-08-10 10:00",
        prescription: [],
        investigation: [],
        summary: {
          health_score: 78,
          daily_progress_notes: "",
          discharge_instructions: ""
        }
      }
    }
  });

  // Here we track the most recent saved data for display
  const [savedData, setSavedData] = useState<{
    goal?: HealthGoal;
    profile?: ProfileData;
    review?: ReviewData;
    transcript?: Transcript[];
    allData?: MedicalScribeData;
  }>({});

  const handleSaveGoal = (goal: HealthGoal) => {
    // Update both the current data and saved record
    setMedicalData(prev => ({
      ...prev,
      note: {
        ...prev.note,
        goal_data: goal
      }
    }));
    
    setSavedData(prev => ({
      ...prev,
      goal
    }));
    
    toast({
      title: "Health goal saved",
      description: "Your health goal has been saved successfully."
    });
    
    console.log('Saved goal:', goal);
  };

  const handleSaveProfile = (profile: ProfileData) => {
    setMedicalData(prev => ({
      ...prev,
      note: {
        ...prev.note,
        profile_data: profile
      }
    }));
    
    setSavedData(prev => ({
      ...prev,
      profile
    }));
    
    toast({
      title: "Profile saved",
      description: "The patient profile has been updated successfully."
    });
    
    console.log('Saved profile:', profile);
  };

  const handleSaveReview = (review: ReviewData) => {
    setMedicalData(prev => ({
      ...prev,
      note: {
        ...prev.note,
        review_data: review
      }
    }));
    
    setSavedData(prev => ({
      ...prev,
      review
    }));
    
    toast({
      title: "Medical review saved",
      description: "The medical review has been updated successfully."
    });
    
    console.log('Saved review:', review);
  };

  const handleSaveTranscript = (transcript: Transcript[]) => {
    setMedicalData(prev => ({
      ...prev,
      transcript
    }));
    
    setSavedData(prev => ({
      ...prev,
      transcript
    }));
    
    toast({
      title: "Transcript saved",
      description: "The conversation transcript has been updated successfully."
    });
    
    console.log('Saved transcript:', transcript);
  };

  const handleSaveAll = (data: MedicalScribeData) => {
    setMedicalData(data);
    
    setSavedData({
      allData: data,
      goal: data.note.goal_data,
      profile: data.note.profile_data,
      review: data.note.review_data,
      transcript: data.transcript
    });
    
    toast({
      title: "All data saved",
      description: "All medical scribe documentation has been saved successfully."
    });
    
    console.log('Saved all data:', data);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Medical Scribe System</h1>
        
        <MedicalScribeView 
          data={medicalData} 
          onSaveGoal={handleSaveGoal}
          onSaveProfile={handleSaveProfile}
          onSaveReview={handleSaveReview}
          onSaveTranscript={handleSaveTranscript}
          onSaveAll={handleSaveAll}
        />
        
        {(savedData.goal || savedData.profile || savedData.review || savedData.transcript || savedData.allData) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Successfully Saved Data:</h2>
            
            {savedData.allData && (
              <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md">
                <h3 className="font-medium mb-2">Complete Documentation</h3>
                <p className="text-sm text-gray-600 mb-2">All sections saved together</p>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(savedData.allData, null, 2)}
                </pre>
              </div>
            )}
            
            {savedData.transcript && !savedData.allData && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="font-medium mb-2">Transcript</h3>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(savedData.transcript, null, 2)}
                </pre>
              </div>
            )}
            
            {savedData.goal && !savedData.allData && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-medium mb-2">Health Goal</h3>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(savedData.goal, null, 2)}
                </pre>
              </div>
            )}
            
            {savedData.profile && !savedData.allData && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-medium mb-2">Patient Profile</h3>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(savedData.profile, null, 2)}
                </pre>
              </div>
            )}
            
            {savedData.review && !savedData.allData && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
                <h3 className="font-medium mb-2">Medical Review</h3>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(savedData.review, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
