
import React, { useState } from 'react';
import { MedicalScribeData, HealthGoal, ProfileData, ReviewData } from '@/types/goalTypes';
import TranscriptSection from '@/components/Transcript/TranscriptSection';
import ProfileSection from '@/components/PatientProfile/ProfileSection';
import ProfileForm from '@/components/PatientProfile/ProfileForm';
import HealthGoalForm from '@/components/HealthGoal/HealthGoalForm';
import ReviewSection from '@/components/MedicalReview/ReviewSection';
import ReviewForm from '@/components/MedicalReview/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';

interface MedicalScribeViewProps {
  data: MedicalScribeData;
  onSaveGoal?: (goal: HealthGoal) => void;
  onSaveProfile?: (profile: ProfileData) => void;
  onSaveReview?: (review: ReviewData) => void;
}

const MedicalScribeView: React.FC<MedicalScribeViewProps> = ({ 
  data,
  onSaveGoal,
  onSaveProfile,
  onSaveReview
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(data.note.profile_data);
  const [reviewData, setReviewData] = useState<ReviewData>(data.note.review_data);

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
          <div className="mb-4 flex justify-end">
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
          <HealthGoalForm
            initialData={data.note.goal_data}
            onSave={onSaveGoal}
          />
        </TabsContent>
        
        <TabsContent value="review">
          <div className="mb-4 flex justify-end">
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
