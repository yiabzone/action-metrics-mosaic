
import React, { useState } from 'react';
import { ProfileData } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  profileData: ProfileData;
  onSave?: (data: ProfileData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData: initialData, onSave }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  const handleChange = (
    section: keyof ProfileData,
    subSection: string,
    field: string,
    value: any
  ) => {
    setProfileData((prev) => {
      const newData = { ...prev };
      // @ts-ignore - Dynamic access
      newData[section][subSection][field] = value;
      return newData;
    });
  };

  const handleBiometricsChange = (field: string, value: number) => {
    setProfileData((prev) => {
      return {
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          biometrics: {
            ...prev.lifestyle.biometrics,
            [field]: value,
          },
        },
      };
    });
  };

  const handleDemographicsChange = (field: string, value: string) => {
    setProfileData((prev) => {
      return {
        ...prev,
        demographics: {
          ...prev.demographics,
          [field]: value,
        },
      };
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(profileData);
    }
    toast({
      title: "Profile updated",
      description: "Patient profile has been updated successfully."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Patient Profile</CardTitle>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Demographics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dob" className="text-sm font-medium text-gray-500">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileData.demographics.date_of_birth}
                onChange={(e) => handleDemographicsChange('date_of_birth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender" className="text-sm font-medium text-gray-500">Gender</Label>
              <Input
                id="gender"
                value={profileData.demographics.gender}
                onChange={(e) => handleDemographicsChange('gender', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-500">Location</Label>
              <Input
                id="location"
                value={profileData.demographics.location.country_code}
                onChange={(e) => handleChange('demographics', 'location', 'country_code', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Genetic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Genetic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bloodType" className="text-sm font-medium text-gray-500">Blood Type</Label>
              <Input
                id="bloodType"
                value={profileData.genetic_proxies.blood_type}
                onChange={(e) => handleChange('genetic_proxies', 'blood_type', '', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="medications" className="text-sm font-medium text-gray-500">Medication Sensitivities</Label>
              <Input
                id="medications"
                value={profileData.genetic_proxies.medication_sensitivities.join(', ')}
                onChange={(e) => {
                  const sensitivities = e.target.value.split(',').map(item => item.trim());
                  setProfileData(prev => ({
                    ...prev,
                    genetic_proxies: {
                      ...prev.genetic_proxies,
                      medication_sensitivities: sensitivities
                    }
                  }));
                }}
                placeholder="Comma-separated list"
              />
            </div>
          </div>
        </div>

        {/* Biometrics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Biometrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium text-gray-500">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profileData.lifestyle.biometrics.height}
                onChange={(e) => handleBiometricsChange('height', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium text-gray-500">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profileData.lifestyle.biometrics.weight}
                onChange={(e) => handleBiometricsChange('weight', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="bmi" className="text-sm font-medium text-gray-500">BMI</Label>
              <Input
                id="bmi"
                type="number"
                value={profileData.lifestyle.biometrics.bmi}
                onChange={(e) => handleBiometricsChange('bmi', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="healthScore" className="text-sm font-medium text-gray-500">Health Score</Label>
              <Input
                id="healthScore"
                type="number"
                min="0"
                max="100"
                value={profileData.lifestyle.biometrics.health_score}
                onChange={(e) => handleBiometricsChange('health_score', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Lifestyle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="circadian" className="text-sm font-medium text-gray-500">Circadian Rhythm</Label>
              <Input
                id="circadian"
                value={profileData.lifestyle.circadian_rhythm}
                onChange={(e) => {
                  setProfileData(prev => ({
                    ...prev,
                    lifestyle: {
                      ...prev.lifestyle,
                      circadian_rhythm: e.target.value
                    }
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Clinical Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Clinical Status</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="conditions" className="text-sm font-medium text-gray-500">Chronic Conditions</Label>
              <Input
                id="conditions"
                value={profileData.clinical_status.chronic_conditions.join(', ')}
                onChange={(e) => {
                  const conditions = e.target.value.split(',').map(item => item.trim());
                  setProfileData(prev => ({
                    ...prev,
                    clinical_status: {
                      ...prev.clinical_status,
                      chronic_conditions: conditions
                    }
                  }));
                }}
                placeholder="Comma-separated list"
              />
            </div>
            <div>
              <Label htmlFor="doctorName" className="text-sm font-medium text-gray-500">Primary Doctor</Label>
              <Input
                id="doctorName"
                value={profileData.clinical_status.care_team.primary_doctor.name}
                onChange={(e) => {
                  setProfileData(prev => ({
                    ...prev,
                    clinical_status: {
                      ...prev.clinical_status,
                      care_team: {
                        ...prev.clinical_status.care_team,
                        primary_doctor: {
                          ...prev.clinical_status.care_team.primary_doctor,
                          name: e.target.value
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="doctorSpecialty" className="text-sm font-medium text-gray-500">Specialty</Label>
              <Input
                id="doctorSpecialty"
                value={profileData.clinical_status.care_team.primary_doctor.specialty}
                onChange={(e) => {
                  setProfileData(prev => ({
                    ...prev,
                    clinical_status: {
                      ...prev.clinical_status,
                      care_team: {
                        ...prev.clinical_status.care_team,
                        primary_doctor: {
                          ...prev.clinical_status.care_team.primary_doctor,
                          specialty: e.target.value
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="clinicName" className="text-sm font-medium text-gray-500">Clinic Name</Label>
              <Input
                id="clinicName"
                value={profileData.clinical_status.care_team.primary_doctor.clinic_name}
                onChange={(e) => {
                  setProfileData(prev => ({
                    ...prev,
                    clinical_status: {
                      ...prev.clinical_status,
                      care_team: {
                        ...prev.clinical_status.care_team,
                        primary_doctor: {
                          ...prev.clinical_status.care_team.primary_doctor,
                          clinic_name: e.target.value
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="doctorPhone" className="text-sm font-medium text-gray-500">Phone Number</Label>
              <Input
                id="doctorPhone"
                value={profileData.clinical_status.care_team.primary_doctor.phone_number}
                onChange={(e) => {
                  setProfileData(prev => ({
                    ...prev,
                    clinical_status: {
                      ...prev.clinical_status,
                      care_team: {
                        ...prev.clinical_status.care_team,
                        primary_doctor: {
                          ...prev.clinical_status.care_team.primary_doctor,
                          phone_number: e.target.value
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
