
import React, { useState } from 'react';
import { MedicalScribeData, HealthGoal, ProfileData, ReviewData, Transcript } from '@/types/goalTypes';
import TranscriptSection from '@/components/Transcript/TranscriptSection';
import TranscriptForm from '@/components/Transcript/TranscriptForm';
import ProfileSection from '@/components/PatientProfile/ProfileSection';
import ProfileForm from '@/components/PatientProfile/ProfileForm';
import HealthGoalForm from '@/components/HealthGoal/HealthGoalForm';
import ReviewSection from '@/components/MedicalReview/ReviewSection';
import ReviewForm from '@/components/MedicalReview/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Save, Copy, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  formatTranscriptForEMR,
  formatProfileForEMR,
  formatGoalForEMR,
  formatReviewForEMR,
  formatCompleteNoteForEMR
} from '@/utils/emrFormatter';

interface MedicalScribeViewProps {
  data: MedicalScribeData;
  onSaveGoal?: (goal: HealthGoal) => void;
  onSaveProfile?: (profile: ProfileData) => void;
  onSaveReview?: (review: ReviewData) => void;
  onSaveTranscript?: (transcript: Transcript[]) => void;
  onSaveAll?: (data: MedicalScribeData) => void;
}

const MedicalScribeView: React.FC<MedicalScribeViewProps> = ({ 
  data,
  onSaveGoal,
  onSaveProfile,
  onSaveReview,
  onSaveTranscript,
  onSaveAll
}) => {
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(data.note.profile_data);
  const [reviewData, setReviewData] = useState<ReviewData>(data.note.review_data);
  const [goalData, setGoalData] = useState<HealthGoal>(data.note.goal_data);
  const [transcriptData, setTranscriptData] = useState<Transcript[]>(data.transcript);

  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfileData(updatedProfile);
    setEditingProfile(false);
    if (onSaveProfile) {
      onSaveProfile(updatedProfile);
    }
  };

  const handleSaveReview = (updatedReview: ReviewData) => {
    setReviewData(updatedReview);
    setEditingReview(false);
    if (onSaveReview) {
      onSaveReview(updatedReview);
    }
  };

  const handleSaveGoal = (updatedGoal: HealthGoal) => {
    setGoalData(updatedGoal);
    setEditingGoal(false);
    if (onSaveGoal) {
      onSaveGoal(updatedGoal);
    }
  };

  const handleSaveTranscript = (updatedTranscript: Transcript[]) => {
    setTranscriptData(updatedTranscript);
    setEditingTranscript(false);
    if (onSaveTranscript) {
      onSaveTranscript(updatedTranscript);
    }
  };

  const handleSaveAll = () => {
    const updatedData: MedicalScribeData = {
      transcript: transcriptData,
      note: {
        profile_data: profileData,
        goal_data: goalData,
        review_data: reviewData,
      }
    };
    
    if (onSaveAll) {
      onSaveAll(updatedData);
    }
    
    toast({
      title: "All data saved",
      description: "All medical scribe documentation has been saved successfully."
    });
  };

  const copyToClipboard = (section: string, data: any) => {
    let formattedText = "";
    
    // Format data based on section type
    switch (section) {
      case "Transcript":
        formattedText = formatTranscriptForEMR(data);
        break;
      case "Patient Profile":
        formattedText = formatProfileForEMR(data);
        break;
      case "Health Goals":
        formattedText = formatGoalForEMR(data);
        break;
      case "Doctor Note":
        formattedText = formatReviewForEMR(data);
        break;
      case "Complete Documentation":
        formattedText = formatCompleteNoteForEMR({
          profile_data: profileData,
          review_data: reviewData,
          goal_data: goalData,
        });
        break;
      default:
        formattedText = JSON.stringify(data, null, 2);
    }
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast({
          title: `${section} copied`,
          description: `${section} data has been copied to clipboard in EMR-friendly format.`
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy data to clipboard.",
          variant: "destructive"
        });
      });
  };

  const applySuggestion = (suggestionType: string, suggestionData: any) => {
    // Apply different suggestion types
    switch (suggestionType) {
      case "goal_name":
        setGoalData(prev => ({
          ...prev,
          goal_name: suggestionData
        }));
        // Remove suggestion after applying
        setMedicalData(prev => ({
          ...prev,
          note: {
            ...prev.note,
            goal_data: {
              ...prev.note.goal_data,
              goal_name_suggestion: undefined
            }
          }
        }));
        break;
      case "target_date":
        setGoalData(prev => ({
          ...prev,
          target_date: suggestionData
        }));
        // Remove suggestion after applying
        setMedicalData(prev => ({
          ...prev,
          note: {
            ...prev.note,
            goal_data: {
              ...prev.note.goal_data,
              target_date_suggestion: undefined
            }
          }
        }));
        break;
      case "comments":
        setGoalData(prev => ({
          ...prev,
          comments: suggestionData
        }));
        // Remove suggestion after applying
        setMedicalData(prev => ({
          ...prev,
          note: {
            ...prev.note,
            goal_data: {
              ...prev.note.goal_data,
              comments_suggestion: undefined
            }
          }
        }));
        break;
      case "metrics":
        setGoalData(prev => ({
          ...prev,
          metrics: suggestionData
        }));
        // Remove suggestion after applying
        setMedicalData(prev => ({
          ...prev,
          note: {
            ...prev.note,
            goal_data: {
              ...prev.note.goal_data,
              metrics_suggestion: undefined
            }
          }
        }));
        break;
      case "actions":
        setGoalData(prev => ({
          ...prev,
          actions: suggestionData
        }));
        // Remove suggestion after applying
        setMedicalData(prev => ({
          ...prev,
          note: {
            ...prev.note,
            goal_data: {
              ...prev.note.goal_data,
              actions_suggestion: undefined
            }
          }
        }));
        break;
      case "primary_diagnosis":
        setReviewData(prev => ({
          ...prev,
          assessment: {
            ...prev.assessment,
            primary_diagnosis: suggestionData
          },
          assessment_suggestion: prev.assessment_suggestion ? {
            ...prev.assessment_suggestion,
            primary_diagnosis: undefined
          } : undefined
        }));
        break;
      case "differential_diagnosis":
        setReviewData(prev => ({
          ...prev,
          assessment: {
            ...prev.assessment,
            differential_diagnosis: suggestionData
          },
          assessment_suggestion: prev.assessment_suggestion ? {
            ...prev.assessment_suggestion,
            differential_diagnosis: undefined
          } : undefined
        }));
        break;
      case "diagnosis_reasoning":
        setReviewData(prev => ({
          ...prev,
          assessment: {
            ...prev.assessment,
            diagnosis_reasoning: suggestionData
          },
          assessment_suggestion: prev.assessment_suggestion ? {
            ...prev.assessment_suggestion,
            diagnosis_reasoning: undefined
          } : undefined
        }));
        break;
      case "management":
        setReviewData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            management: suggestionData
          },
          plan_suggestion: prev.plan_suggestion ? {
            ...prev.plan_suggestion,
            management: undefined
          } : undefined
        }));
        break;
      case "lifestyle_advice":
        setReviewData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            lifestyle_advice: suggestionData
          },
          plan_suggestion: prev.plan_suggestion ? {
            ...prev.plan_suggestion,
            lifestyle_advice: undefined
          } : undefined
        }));
        break;
      case "follow_up":
        setReviewData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            follow_up: suggestionData
          },
          plan_suggestion: prev.plan_suggestion ? {
            ...prev.plan_suggestion,
            follow_up: undefined
          } : undefined
        }));
        break;
      case "patient_education":
        setReviewData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            patient_education: suggestionData
          },
          plan_suggestion: prev.plan_suggestion ? {
            ...prev.plan_suggestion,
            patient_education: undefined
          } : undefined
        }));
        break;
      case "treatment_goal":
        setReviewData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            treatment_goal: suggestionData
          },
          plan_suggestion: prev.plan_suggestion ? {
            ...prev.plan_suggestion,
            treatment_goal: undefined
          } : undefined
        }));
        break;
      default:
        console.error("Unknown suggestion type:", suggestionType);
    }
    
    toast({
      title: "Suggestion applied",
      description: `The ${suggestionType.replace('_', ' ')} suggestion has been applied.`
    });
  };

  // Helper function to remove all related suggestions
  const [medicalData, setMedicalData] = useState<MedicalScribeData>(data);

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <Button 
          variant="default" 
          onClick={handleSaveAll}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Save All Documentation
        </Button>
      </div>
      
      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="profile">Patient Profile</TabsTrigger>
          <TabsTrigger value="goals">Health Goals</TabsTrigger>
          <TabsTrigger value="review">Doctor Note</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript">
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard("Transcript", transcriptData)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Transcript
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingTranscript(!editingTranscript)}
              className="flex items-center gap-2"
            >
              {editingTranscript ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editingTranscript ? "View Transcript" : "Edit Transcript"}
            </Button>
          </div>
          
          {editingTranscript ? (
            <TranscriptForm 
              transcripts={transcriptData} 
              onSave={handleSaveTranscript} 
            />
          ) : (
            <TranscriptSection transcripts={transcriptData} />
          )}
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard("Patient Profile", profileData)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingProfile(!editingProfile)}
              className="flex items-center gap-2"
            >
              {editingProfile ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editingProfile ? "View Profile" : "Edit Profile"}
            </Button>
          </div>
          
          {editingProfile ? (
            <ProfileForm 
              profileData={profileData} 
              onSave={handleSaveProfile} 
            />
          ) : (
            <ProfileSection profileData={profileData} />
          )}
        </TabsContent>
        
        <TabsContent value="goals">
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard("Health Goals", goalData)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Goals
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingGoal(!editingGoal)}
              className="flex items-center gap-2"
            >
              {editingGoal ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editingGoal ? "View Goals" : "Edit Goals"}
            </Button>
          </div>
          
          {editingGoal ? (
            <HealthGoalForm
              initialData={goalData}
              onSave={handleSaveGoal}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Health Goal: {goalData.goal_name}</h2>
                
                {medicalData.note.goal_data.goal_name_suggestion && (
                  <div className="bg-amber-50 p-3 rounded-md mb-4 border border-amber-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-amber-800">Suggested Goal Name:</p>
                        <p className="text-base">{medicalData.note.goal_data.goal_name_suggestion}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => applySuggestion("goal_name", medicalData.note.goal_data.goal_name_suggestion)}
                        className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Target Date</p>
                    <p>{goalData.target_date}</p>
                    
                    {medicalData.note.goal_data.target_date_suggestion && (
                      <div className="bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Suggestion: {medicalData.note.goal_data.target_date_suggestion}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => applySuggestion("target_date", medicalData.note.goal_data.target_date_suggestion)}
                            className="h-7 flex items-center gap-1 hover:bg-amber-200"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Comments</p>
                    <p>{goalData.comments || "No comments provided"}</p>
                    
                    {medicalData.note.goal_data.comments_suggestion && (
                      <div className="bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">{medicalData.note.goal_data.comments_suggestion}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => applySuggestion("comments", medicalData.note.goal_data.comments_suggestion)}
                            className="h-7 flex items-center gap-1 hover:bg-amber-200"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Metrics</h3>
                  
                  {medicalData.note.goal_data.metrics_suggestion && medicalData.note.goal_data.metrics_suggestion.length > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md mb-3 border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-amber-800">Suggested Metrics:</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySuggestion("metrics", medicalData.note.goal_data.metrics_suggestion)}
                          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Apply All
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {medicalData.note.goal_data.metrics_suggestion.map((metric, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border border-amber-100">
                            <p className="font-medium">{metric.metric_name}</p>
                            <p>Target: {metric.target_value} {metric.unit}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-md p-3">
                    {goalData.metrics.length > 0 ? (
                      <div className="grid grid-cols-4 gap-4">
                        {goalData.metrics.map((metric, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <p className="font-medium">{metric.metric_name}</p>
                            <p className="text-sm text-gray-600">Target: {metric.target_value} {metric.unit}</p>
                            <p className="text-xs text-gray-500">Record every {metric.interval} hours</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No metrics defined</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Actions</h3>
                  
                  {medicalData.note.goal_data.actions_suggestion && medicalData.note.goal_data.actions_suggestion.length > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md mb-3 border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-amber-800">Suggested Actions:</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySuggestion("actions", medicalData.note.goal_data.actions_suggestion)}
                          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Apply All
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {medicalData.note.goal_data.actions_suggestion.map((action, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border border-amber-100">
                            <p className="font-medium">{action.name}</p>
                            <p className="text-xs">{action.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-md p-3">
                    {goalData.actions.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {goalData.actions.map((action, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <p className="font-medium">{action.name}</p>
                            <p className="text-sm my-1">{action.description}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Repeat: {action.interval > 0 ? `Every ${action.interval} hours` : 'One-time'}</span>
                              <span>Until: {action.action_end_date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No actions defined</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="review">
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard("Doctor Note", reviewData)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Doctor Note
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingReview(!editingReview)}
              className="flex items-center gap-2"
            >
              {editingReview ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editingReview ? "View Doctor Note" : "Edit Doctor Note"}
            </Button>
          </div>
          
          {editingReview ? (
            <ReviewForm 
              reviewData={reviewData} 
              onSave={handleSaveReview} 
            />
          ) : (
            <div className="space-y-6">
              {/* Modified to show interleaved suggestions with fields */}
              <div className="bg-white shadow-sm rounded-lg p-6 border mb-4">
                <h2 className="text-xl font-semibold mb-4">Doctor Note</h2>
                
                {/* Subjective Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Subjective</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chief Complaint</p>
                      <p>{reviewData.subjective.chief_complaint}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">History of Present Illness</p>
                      <p>{reviewData.subjective.history_of_present_illness}</p>
                    </div>
                  </div>
                </div>
                
                {/* Objective Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Objective</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Examination Findings</p>
                      <p>{reviewData.objective.examination_findings}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Investigations</p>
                      <p>{reviewData.objective.investigations}</p>
                    </div>
                  </div>
                </div>
                
                {/* Assessment Section with interleaved suggestions */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Assessment</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Primary Diagnosis</p>
                      <p>{reviewData.assessment.primary_diagnosis}</p>
                      
                      {reviewData.assessment_suggestion?.primary_diagnosis && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Primary Diagnosis:</p>
                              <p>{reviewData.assessment_suggestion.primary_diagnosis}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("primary_diagnosis", reviewData.assessment_suggestion?.primary_diagnosis)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Differential Diagnosis</p>
                      <p>{reviewData.assessment.differential_diagnosis}</p>
                      
                      {reviewData.assessment_suggestion?.differential_diagnosis && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Differential Diagnosis:</p>
                              <p>{reviewData.assessment_suggestion.differential_diagnosis}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("differential_diagnosis", reviewData.assessment_suggestion?.differential_diagnosis)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Diagnosis Reasoning</p>
                      <p>{reviewData.assessment.diagnosis_reasoning}</p>
                      
                      {reviewData.assessment_suggestion?.diagnosis_reasoning && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Diagnosis Reasoning:</p>
                              <p>{reviewData.assessment_suggestion.diagnosis_reasoning}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("diagnosis_reasoning", reviewData.assessment_suggestion?.diagnosis_reasoning)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="capitalize">{reviewData.assessment.status}</p>
                    </div>
                  </div>
                </div>
                
                {/* Plan Section with interleaved suggestions */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Treatment Plan</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Management</p>
                      <p>{reviewData.plan.management}</p>
                      
                      {reviewData.plan_suggestion?.management && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Management:</p>
                              <p>{reviewData.plan_suggestion.management}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("management", reviewData.plan_suggestion?.management)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lifestyle Advice</p>
                      <p>{reviewData.plan.lifestyle_advice}</p>
                      
                      {reviewData.plan_suggestion?.lifestyle_advice && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Lifestyle Advice:</p>
                              <p>{reviewData.plan_suggestion.lifestyle_advice}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("lifestyle_advice", reviewData.plan_suggestion?.lifestyle_advice)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Follow Up</p>
                      <p>{reviewData.plan.follow_up}</p>
                      
                      {reviewData.plan_suggestion?.follow_up && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Follow Up:</p>
                              <p>{reviewData.plan_suggestion.follow_up}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("follow_up", reviewData.plan_suggestion?.follow_up)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patient Education</p>
                      <p>{reviewData.plan.patient_education}</p>
                      
                      {reviewData.plan_suggestion?.patient_education && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Patient Education:</p>
                              <p>{reviewData.plan_suggestion.patient_education}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("patient_education", reviewData.plan_suggestion?.patient_education)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Treatment Goal</p>
                      <p>{reviewData.plan.treatment_goal}</p>
                      
                      {reviewData.plan_suggestion?.treatment_goal && (
                        <div className="bg-amber-50 p-3 rounded-md mt-2 border border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">Suggested Treatment Goal:</p>
                              <p>{reviewData.plan_suggestion.treatment_goal}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => applySuggestion("treatment_goal", reviewData.plan_suggestion?.treatment_goal)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan Reasoning</p>
                      <p>{reviewData.plan.plan_reasoning}</p>
                    </div>
                  </div>
                </div>
                
                {/* Next Review */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">Next Review</p>
                  <p>{reviewData.next_review}</p>
                </div>
                
                {/* Prescriptions */}
                {reviewData.prescription.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Prescriptions</h3>
                    <div className="grid gap-4">
                      {reviewData.prescription.map((prescription, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{prescription.medication_name}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <p className="text-sm"><span className="text-gray-500">Dosage:</span> {prescription.dosage}</p>
                            <p className="text-sm"><span className="text-gray-500">Route:</span> {prescription.route}</p>
                            <p className="text-sm"><span className="text-gray-500">Frequency:</span> {prescription.frequency}</p>
                            <p className="text-sm"><span className="text-gray-500">Duration:</span> {prescription.duration}</p>
                          </div>
                          <p className="text-sm mt-2"><span className="text-gray-500">Instructions:</span> {prescription.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Investigations */}
                {reviewData.investigation.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Investigations</h3>
                    <div className="grid gap-4">
                      {reviewData.investigation.map((investigation, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{investigation.test_type}</p>
                          <p className="text-sm mt-1"><span className="text-gray-500">Reason:</span> {investigation.reason}</p>
                          <p className="text-sm mt-1"><span className="text-gray-500">Instructions:</span> {investigation.instructions}</p>
                          <p className="text-sm mt-1"><span className="text-gray-500">Scheduled Time:</span> {investigation.scheduled_time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Summary</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Health Score</p>
                      <p>{reviewData.summary.health_score}/100</p>
                    </div>
                    {reviewData.summary.daily_progress_notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Daily Progress Notes</p>
                        <p>{reviewData.summary.daily_progress_notes}</p>
                      </div>
                    )}
                    {reviewData.summary.discharge_instructions && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Discharge Instructions</p>
                        <p>{reviewData.summary.discharge_instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalScribeView;
