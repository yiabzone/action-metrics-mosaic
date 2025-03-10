
import { Transcript, ProfileData, HealthGoal, ReviewData, MedicalNote } from "@/types/goalTypes";
import { format } from "date-fns";

// Format transcript for EMR paste
export const formatTranscriptForEMR = (transcripts: Transcript[]): string => {
  return transcripts.map(entry => {
    // Format date to be more readable
    const formattedTime = format(new Date(entry.time), "MMM d, yyyy h:mm a");
    return `${formattedTime} - ${entry.speaker.toUpperCase()}: ${entry.content}`;
  }).join('\n\n');
};

// Format patient profile for EMR paste
export const formatProfileForEMR = (profile: ProfileData): string => {
  const { demographics, clinical_status, lifestyle } = profile;
  
  // Basic demographics section
  const demoSection = [
    "## PATIENT DEMOGRAPHICS",
    `Date of Birth: ${format(new Date(demographics.date_of_birth), "MMM d, yyyy")}`,
    `Gender: ${demographics.gender}`,
    `Age: ${demographics.age || "Not provided"}`,
    `Location: ${demographics.location.country_code}`,
  ].join('\n');
  
  // Clinical status section
  const clinicalSection = [
    "\n## CLINICAL STATUS",
    `Chronic Conditions: ${clinical_status.chronic_conditions.length ? clinical_status.chronic_conditions.join(", ") : "None reported"}`,
    `Primary Care: ${clinical_status.care_team.primary_doctor.name} (${clinical_status.care_team.primary_doctor.specialty})`,
    `Clinic: ${clinical_status.care_team.primary_doctor.clinic_name}`,
    `Contact: ${clinical_status.care_team.primary_doctor.phone_number}`,
  ].join('\n');
  
  // Biometrics section
  const biometricsSection = [
    "\n## BIOMETRICS",
    `Height: ${lifestyle.biometrics.height} cm`,
    `Weight: ${lifestyle.biometrics.weight} kg`,
    `BMI: ${lifestyle.biometrics.bmi}`,
    `Health Score: ${lifestyle.biometrics.health_score}/100`,
  ].join('\n');
  
  return [demoSection, clinicalSection, biometricsSection].join('\n');
};

// Format health goals for EMR paste
export const formatGoalForEMR = (goal: HealthGoal): string => {
  // Goal overview
  const goalOverview = [
    "## HEALTH GOAL",
    `Goal: ${goal.goal_name}`,
    `Target Date: ${format(new Date(goal.target_date), "MMM d, yyyy")}`,
    `Comments: ${goal.comments || "None provided"}`,
  ].join('\n');
  
  // Metrics section
  const metricsSection = goal.metrics.length ? [
    "\n## METRICS",
    ...goal.metrics.map(metric => 
      `- ${metric.metric_name}: Target ${metric.target_value} ${metric.unit} (Check every ${metric.interval} hours)`
    )
  ].join('\n') : "\n## METRICS\nNo metrics defined";
  
  // Actions section
  const actionsSection = goal.actions.length ? [
    "\n## ACTIONS",
    ...goal.actions.map(action => 
      `- ${action.name}: ${action.description}\n  Frequency: ${action.interval > 0 ? `Every ${action.interval} hours` : 'One-time'} until ${format(new Date(action.action_end_date), "MMM d, yyyy")}`
    )
  ].join('\n') : "\n## ACTIONS\nNo actions defined";
  
  return [goalOverview, metricsSection, actionsSection].join('\n');
};

// Format medical review for EMR paste
export const formatReviewForEMR = (review: ReviewData): string => {
  // SOAP format (Subjective, Objective, Assessment, Plan)
  const subjectiveSection = [
    "## SUBJECTIVE",
    `Chief Complaint: ${review.subjective.chief_complaint}`,
    `History of Present Illness: ${review.subjective.history_of_present_illness}`,
  ].join('\n');
  
  const objectiveSection = [
    "\n## OBJECTIVE",
    `Examination Findings: ${review.objective.examination_findings}`,
    `Investigations: ${review.objective.investigations}`,
  ].join('\n');
  
  const assessmentSection = [
    "\n## ASSESSMENT",
    `Primary Diagnosis: ${review.assessment.primary_diagnosis}`,
    `Differential Diagnosis: ${review.assessment.differential_diagnosis}`,
    `Reasoning: ${review.assessment.diagnosis_reasoning}`,
    `Status: ${review.assessment.status}`,
  ].join('\n');
  
  const planSection = [
    "\n## PLAN",
    `Management: ${review.plan.management}`,
    `Lifestyle Advice: ${review.plan.lifestyle_advice}`,
    `Patient Education: ${review.plan.patient_education}`,
    `Follow-up: ${review.plan.follow_up}`,
    `Treatment Goal: ${review.plan.treatment_goal}`,
  ].join('\n');
  
  const medsSection = review.prescription.length ? [
    "\n## PRESCRIPTIONS",
    ...review.prescription.map(med => 
      `- ${med.medication_name} ${med.dosage} ${med.route}, ${med.frequency} for ${med.duration}\n  Instructions: ${med.instructions}`
    )
  ].join('\n') : "";
  
  return [subjectiveSection, objectiveSection, assessmentSection, planSection, medsSection].join('\n');
};

// Format complete note for EMR paste
export const formatCompleteNoteForEMR = (data: MedicalNote): string => {
  const profileSection = formatProfileForEMR(data.profile_data);
  const reviewSection = formatReviewForEMR(data.review_data);
  const goalSection = formatGoalForEMR(data.goal_data);
  
  return [
    "# MEDICAL NOTE",
    `Date: ${format(new Date(), "MMM d, yyyy")}`,
    "\n" + profileSection,
    "\n" + reviewSection,
    "\n" + goalSection,
  ].join('\n');
};
