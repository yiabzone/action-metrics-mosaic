
import React from 'react';
import { ReviewData } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewSectionProps {
  reviewData: ReviewData;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviewData }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'improving': return 'bg-green-500';
      case 'worsening': return 'bg-red-500';
      case 'resolved': return 'bg-blue-500';
      case 'stable': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Medical Review</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Subjective */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Subjective</h3>
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

        {/* Objective */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Objective</h3>
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

        {/* Assessment */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Assessment</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-500">Primary Diagnosis:</p>
              <p className="font-semibold">{reviewData.assessment.primary_diagnosis}</p>
              <Badge className={getStatusColor(reviewData.assessment.status)}>
                {reviewData.assessment.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Differential Diagnosis</p>
              <p>{reviewData.assessment.differential_diagnosis}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Diagnosis Reasoning</p>
              <p>{reviewData.assessment.diagnosis_reasoning}</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Treatment Plan</h3>
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Management</p>
              <p>{reviewData.plan.management}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lifestyle Advice</p>
              <p>{reviewData.plan.lifestyle_advice}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Follow Up</p>
              <p>{reviewData.plan.follow_up}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Patient Education</p>
              <p>{reviewData.plan.patient_education}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Treatment Goal</p>
              <p>{reviewData.plan.treatment_goal}</p>
            </div>
          </div>
        </div>

        {/* Next Review */}
        <div>
          <p className="text-sm font-medium text-gray-500">Next Review</p>
          <p className="font-semibold">{reviewData.next_review}</p>
        </div>

        {/* Prescriptions */}
        {reviewData.prescription.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Prescriptions</h3>
            <div className="grid gap-4">
              {reviewData.prescription.map((prescription, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <p className="font-semibold">{prescription.medication_name}</p>
                  <p>Dosage: {prescription.dosage}</p>
                  <p>Route: {prescription.route}</p>
                  <p>Frequency: {prescription.frequency}</p>
                  <p>Duration: {prescription.duration}</p>
                  <p>Instructions: {prescription.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigations */}
        {reviewData.investigation.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Investigations</h3>
            <div className="grid gap-4">
              {reviewData.investigation.map((investigation, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <p className="font-semibold">{investigation.test_type}</p>
                  <p>Reason: {investigation.reason}</p>
                  <p>Instructions: {investigation.instructions}</p>
                  <p>Scheduled: {investigation.scheduled_time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
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
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
