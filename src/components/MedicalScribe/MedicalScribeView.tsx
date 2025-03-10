
import React from 'react';
import { MedicalScribeData } from '@/types/goalTypes';
import TranscriptSection from '@/components/Transcript/TranscriptSection';
import ProfileSection from '@/components/PatientProfile/ProfileSection';
import HealthGoalForm from '@/components/HealthGoal/HealthGoalForm';
import ReviewSection from '@/components/MedicalReview/ReviewSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MedicalScribeViewProps {
  data: MedicalScribeData;
  onSaveGoal?: (goal: any) => void;
}

const MedicalScribeView: React.FC<MedicalScribeViewProps> = ({ 
  data,
  onSaveGoal
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="profile">Patient Profile</TabsTrigger>
          <TabsTrigger value="goals">Health Goals</TabsTrigger>
          <TabsTrigger value="review">Medical Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript">
          <TranscriptSection transcripts={data.transcript} />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileSection profileData={data.note.profile_data} />
        </TabsContent>
        
        <TabsContent value="goals">
          <HealthGoalForm
            initialData={data.note.goal_data}
            onSave={onSaveGoal}
          />
        </TabsContent>
        
        <TabsContent value="review">
          <ReviewSection reviewData={data.note.review_data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalScribeView;
