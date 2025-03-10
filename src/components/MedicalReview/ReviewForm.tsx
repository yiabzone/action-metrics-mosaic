
import React, { useState } from 'react';
import { ReviewData } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReviewFormProps {
  reviewData: ReviewData;
  onSave?: (data: ReviewData) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ reviewData: initialData, onSave }) => {
  const { toast } = useToast();
  const [reviewData, setReviewData] = useState<ReviewData>(initialData);

  // Helper to update subjective data
  const updateSubjective = (field: keyof typeof reviewData.subjective, value: string) => {
    setReviewData(prev => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        [field]: value
      }
    }));
  };

  // Helper to update objective data
  const updateObjective = (field: keyof typeof reviewData.objective, value: string) => {
    setReviewData(prev => ({
      ...prev,
      objective: {
        ...prev.objective,
        [field]: value
      }
    }));
  };

  // Helper to update assessment data
  const updateAssessment = (field: keyof typeof reviewData.assessment, value: string) => {
    setReviewData(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        [field]: value
      }
    }));
  };

  // Helper to update plan data
  const updatePlan = (field: keyof typeof reviewData.plan, value: string) => {
    setReviewData(prev => ({
      ...prev,
      plan: {
        ...prev.plan,
        [field]: value
      }
    }));
  };

  // Helper to update summary data
  const updateSummary = (field: keyof typeof reviewData.summary, value: any) => {
    setReviewData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        [field]: field === 'health_score' ? Number(value) : value
      }
    }));
  };

  // Functions to add/remove prescriptions
  const addPrescription = () => {
    setReviewData(prev => ({
      ...prev,
      prescription: [
        ...prev.prescription,
        {
          medication_name: "",
          dosage: "",
          route: "",
          frequency: "",
          duration: "",
          instructions: ""
        }
      ]
    }));
  };

  const updatePrescription = (index: number, field: string, value: string) => {
    setReviewData(prev => {
      const updatedPrescriptions = [...prev.prescription];
      // @ts-ignore - dynamic field access
      updatedPrescriptions[index][field] = value;
      return {
        ...prev,
        prescription: updatedPrescriptions
      };
    });
  };

  const removePrescription = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index)
    }));
  };

  // Functions to add/remove investigations
  const addInvestigation = () => {
    setReviewData(prev => ({
      ...prev,
      investigation: [
        ...prev.investigation,
        {
          test_type: "",
          reason: "",
          instructions: "",
          scheduled_time: ""
        }
      ]
    }));
  };

  const updateInvestigation = (index: number, field: string, value: string) => {
    setReviewData(prev => {
      const updatedInvestigations = [...prev.investigation];
      // @ts-ignore - dynamic field access
      updatedInvestigations[index][field] = value;
      return {
        ...prev,
        investigation: updatedInvestigations
      };
    });
  };

  const removeInvestigation = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      investigation: prev.investigation.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(reviewData);
    }
    toast({
      title: "Medical review updated",
      description: "The medical review has been updated successfully."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Review</CardTitle>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Review
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Subjective */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Subjective</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="chief_complaint" className="text-sm font-medium text-gray-500">
                Chief Complaint
              </Label>
              <Input
                id="chief_complaint"
                value={reviewData.subjective.chief_complaint}
                onChange={(e) => updateSubjective('chief_complaint', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="history_of_present_illness" className="text-sm font-medium text-gray-500">
                History of Present Illness
              </Label>
              <Textarea
                id="history_of_present_illness"
                value={reviewData.subjective.history_of_present_illness}
                onChange={(e) => updateSubjective('history_of_present_illness', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Objective */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Objective</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="examination_findings" className="text-sm font-medium text-gray-500">
                Examination Findings
              </Label>
              <Textarea
                id="examination_findings"
                value={reviewData.objective.examination_findings}
                onChange={(e) => updateObjective('examination_findings', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="investigations" className="text-sm font-medium text-gray-500">
                Investigations
              </Label>
              <Textarea
                id="investigations"
                value={reviewData.objective.investigations}
                onChange={(e) => updateObjective('investigations', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Assessment</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="primary_diagnosis" className="text-sm font-medium text-gray-500">
                Primary Diagnosis
              </Label>
              <Input
                id="primary_diagnosis"
                value={reviewData.assessment.primary_diagnosis}
                onChange={(e) => updateAssessment('primary_diagnosis', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-500">
                Status
              </Label>
              <Select
                value={reviewData.assessment.status}
                onValueChange={(value) => updateAssessment('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improving">Improving</SelectItem>
                  <SelectItem value="worsening">Worsening</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="differential_diagnosis" className="text-sm font-medium text-gray-500">
                Differential Diagnosis
              </Label>
              <Input
                id="differential_diagnosis"
                value={reviewData.assessment.differential_diagnosis}
                onChange={(e) => updateAssessment('differential_diagnosis', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="diagnosis_reasoning" className="text-sm font-medium text-gray-500">
                Diagnosis Reasoning
              </Label>
              <Textarea
                id="diagnosis_reasoning"
                value={reviewData.assessment.diagnosis_reasoning}
                onChange={(e) => updateAssessment('diagnosis_reasoning', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Plan */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Treatment Plan</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="management" className="text-sm font-medium text-gray-500">
                Management
              </Label>
              <Textarea
                id="management"
                value={reviewData.plan.management}
                onChange={(e) => updatePlan('management', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lifestyle_advice" className="text-sm font-medium text-gray-500">
                Lifestyle Advice
              </Label>
              <Textarea
                id="lifestyle_advice"
                value={reviewData.plan.lifestyle_advice}
                onChange={(e) => updatePlan('lifestyle_advice', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="follow_up" className="text-sm font-medium text-gray-500">
                Follow Up
              </Label>
              <Input
                id="follow_up"
                value={reviewData.plan.follow_up}
                onChange={(e) => updatePlan('follow_up', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patient_education" className="text-sm font-medium text-gray-500">
                Patient Education
              </Label>
              <Textarea
                id="patient_education"
                value={reviewData.plan.patient_education}
                onChange={(e) => updatePlan('patient_education', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="treatment_goal" className="text-sm font-medium text-gray-500">
                Treatment Goal
              </Label>
              <Input
                id="treatment_goal"
                value={reviewData.plan.treatment_goal}
                onChange={(e) => updatePlan('treatment_goal', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="plan_reasoning" className="text-sm font-medium text-gray-500">
                Plan Reasoning
              </Label>
              <Textarea
                id="plan_reasoning"
                value={reviewData.plan.plan_reasoning}
                onChange={(e) => updatePlan('plan_reasoning', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Next Review */}
        <div>
          <Label htmlFor="next_review" className="text-sm font-medium text-gray-500">
            Next Review
          </Label>
          <Input
            id="next_review"
            value={reviewData.next_review}
            onChange={(e) => setReviewData(prev => ({ ...prev, next_review: e.target.value }))}
          />
        </div>

        {/* Prescriptions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Prescriptions</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addPrescription}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Prescription
            </Button>
          </div>
          
          {reviewData.prescription.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No prescriptions added</div>
          ) : (
            <div className="space-y-4">
              {reviewData.prescription.map((prescription, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2 text-red-500"
                    onClick={() => removePrescription(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Medication Name</Label>
                      <Input
                        value={prescription.medication_name}
                        onChange={(e) => updatePrescription(index, 'medication_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Dosage</Label>
                      <Input
                        value={prescription.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Route</Label>
                      <Input
                        value={prescription.route}
                        onChange={(e) => updatePrescription(index, 'route', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Frequency</Label>
                      <Input
                        value={prescription.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Duration</Label>
                      <Input
                        value={prescription.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                      <Input
                        value={prescription.instructions}
                        onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Investigations */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Investigations</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addInvestigation}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Investigation
            </Button>
          </div>
          
          {reviewData.investigation.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No investigations added</div>
          ) : (
            <div className="space-y-4">
              {reviewData.investigation.map((investigation, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2 text-red-500"
                    onClick={() => removeInvestigation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Test Type</Label>
                      <Input
                        value={investigation.test_type}
                        onChange={(e) => updateInvestigation(index, 'test_type', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Reason</Label>
                      <Input
                        value={investigation.reason}
                        onChange={(e) => updateInvestigation(index, 'reason', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                      <Textarea
                        value={investigation.instructions}
                        onChange={(e) => updateInvestigation(index, 'instructions', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Scheduled Time</Label>
                      <Input
                        value={investigation.scheduled_time}
                        onChange={(e) => updateInvestigation(index, 'scheduled_time', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="health_score" className="text-sm font-medium text-gray-500">
                Health Score
              </Label>
              <Input
                id="health_score"
                type="number"
                min="0"
                max="100"
                value={reviewData.summary.health_score}
                onChange={(e) => updateSummary('health_score', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="daily_progress_notes" className="text-sm font-medium text-gray-500">
                Daily Progress Notes
              </Label>
              <Textarea
                id="daily_progress_notes"
                value={reviewData.summary.daily_progress_notes}
                onChange={(e) => updateSummary('daily_progress_notes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="discharge_instructions" className="text-sm font-medium text-gray-500">
                Discharge Instructions
              </Label>
              <Textarea
                id="discharge_instructions"
                value={reviewData.summary.discharge_instructions}
                onChange={(e) => updateSummary('discharge_instructions', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
