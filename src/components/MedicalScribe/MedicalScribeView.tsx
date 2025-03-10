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
      case "Medical Review":
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
        break;
      case "target_date":
        setGoalData(prev => ({
          ...prev,
          target_date: suggestionData
        }));
        break;
      case "comments":
        setGoalData(prev => ({
          ...prev,
          comments: suggestionData
        }));
        break;
      case "metrics":
        setGoalData(prev => ({
          ...prev,
          metrics: suggestionData
        }));
        break;
      case "actions":
        setGoalData(prev => ({
          ...prev,
          actions: suggestionData
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
          <TabsTrigger value="review">Medical Review</TabsTrigger>
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
                <h2 className="text-xl font-semibold mb-4">{goalData.goal_name}</h2>
                
                {data.note.goal_data.goal_name_suggestion && (
                  <div className="bg-amber-50 p-3 rounded-md mb-4 border border-amber-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-amber-800">Suggested Goal Name:</p>
                        <p className="text-base">{data.note.goal_data.goal_name_suggestion}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => applySuggestion("goal_name", data.note.goal_data.goal_name_suggestion)}
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
                    
                    {data.note.goal_data.target_date_suggestion && (
                      <div className="bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Suggestion: {data.note.goal_data.target_date_suggestion}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => applySuggestion("target_date", data.note.goal_data.target_date_suggestion)}
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
                    
                    {data.note.goal_data.comments_suggestion && (
                      <div className="bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
                        <div className="flex justify-between items-center">
                          <p className="text-sm truncate max-w-[200px]">Suggestion: {data.note.goal_data.comments_suggestion}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => applySuggestion("comments", data.note.goal_data.comments_suggestion)}
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
                  
                  {data.note.goal_data.metrics_suggestion && data.note.goal_data.metrics_suggestion.length > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md mb-3 border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-amber-800">Suggested Metrics:</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySuggestion("metrics", data.note.goal_data.metrics_suggestion)}
                          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Apply All
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {data.note.goal_data.metrics_suggestion.map((metric, idx) => (
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
                  
                  {data.note.goal_data.actions_suggestion && data.note.goal_data.actions_suggestion.length > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md mb-3 border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-amber-800">Suggested Actions:</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySuggestion("actions", data.note.goal_data.actions_suggestion)}
                          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Apply All
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {data.note.goal_data.actions_suggestion.map((action, idx) => (
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
              onClick={() => copyToClipboard("Medical Review", reviewData)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Review
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingReview(!editingReview)}
              className="flex items-center gap-2"
            >
              {editingReview ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editingReview ? "View Review" : "Edit Review"}
            </Button>
          </div>
          
          {editingReview ? (
            <ReviewForm 
              reviewData={reviewData} 
              onSave={handleSaveReview} 
            />
          ) : (
            <ReviewSection reviewData={reviewData} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalScribeView;
