
import React from 'react';
import { ProfileData } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ProfileSectionProps {
  profileData: ProfileData;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profileData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Demographics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p>{formatDate(profileData.demographics.date_of_birth)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p>{profileData.demographics.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p>{profileData.demographics.location.country_code}</p>
            </div>
          </div>
        </div>

        {/* Genetic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Genetic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Blood Type</p>
              <p>{profileData.genetic_proxies.blood_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Medication Sensitivities</p>
              <p>{profileData.genetic_proxies.medication_sensitivities.length > 0 
                ? profileData.genetic_proxies.medication_sensitivities.join(', ') 
                : 'None'}</p>
            </div>
          </div>
        </div>

        {/* Biometrics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Biometrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Height</p>
              <p>{profileData.lifestyle.biometrics.height} cm</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weight</p>
              <p>{profileData.lifestyle.biometrics.weight} kg</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">BMI</p>
              <p>{profileData.lifestyle.biometrics.bmi}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Health Score</p>
              <p>{profileData.lifestyle.biometrics.health_score}/100</p>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Lifestyle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Circadian Rhythm</p>
              <p>{profileData.lifestyle.circadian_rhythm}</p>
            </div>
          </div>
        </div>

        {/* Clinical Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Clinical Status</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
              <p>{profileData.clinical_status.chronic_conditions.length > 0 
                ? profileData.clinical_status.chronic_conditions.join(', ') 
                : 'None'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Doctor</p>
              <p>{profileData.clinical_status.care_team.primary_doctor.name} - {profileData.clinical_status.care_team.primary_doctor.specialty}</p>
              <p className="text-sm">{profileData.clinical_status.care_team.primary_doctor.clinic_name}</p>
              <p className="text-sm">{profileData.clinical_status.care_team.primary_doctor.phone_number}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
