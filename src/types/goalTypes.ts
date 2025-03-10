
// Basic shared types
export interface Metric {
  metric_name: string;
  unit: string;
  interval: number;
  target_value: number;
}

export interface Action {
  name: string;
  description: string;
  interval: number;
  action_end_date: string;
}

export interface HealthGoal {
  goal_name: string;
  target_date: string;
  comments: string;
  metrics: Metric[];
  actions: Action[];
}

// Medical scribe types
export interface Demographics {
  id?: string;
  name?: string;
  date_of_birth: string;
  age?: string;
  gender: string;
  location: {
    country_code: string;
    geo_risks: Record<string, any>;
  };
}

export interface GeneticProxies {
  blood_type: string;
  family_history: Record<string, any>;
  phenotypic_markers: string[];
  medication_sensitivities: string[];
}

export interface Biometrics {
  height: number;
  weight: number;
  bmi: number;
  health_score: number;
}

export interface Lifestyle {
  circadian_rhythm: string;
  nutrition: Record<string, any>;
  activity: Record<string, any>;
  social_history: Record<string, any>;
  biometrics: Biometrics;
}

export interface CareTeam {
  primary_doctor: {
    id: number;
    name: string;
    clinic_name: string;
    specialty: string;
    phone_number: string;
  };
}

export interface ClinicalStatus {
  chronic_conditions: string[];
  peculiarities: string[];
  medications: Record<string, any>;
  care_team: CareTeam;
}

export interface TemporalContext {
  current_time: string;
  patient_local_time: string;
  timezone: string;
}

export interface ProfileData {
  demographics: Demographics;
  genetic_proxies: GeneticProxies;
  environment: Record<string, any>;
  lifestyle: Lifestyle;
  clinical_status: ClinicalStatus;
  temporal_context: TemporalContext;
}

export interface Subjective {
  chief_complaint: string;
  history_of_present_illness: string;
}

export interface Objective {
  examination_findings: string;
  investigations: string;
}

export interface Assessment {
  primary_diagnosis: string;
  differential_diagnosis: string;
  diagnosis_reasoning: string;
  status: "improving" | "worsening" | "resolved" | "stable" | "unknown";
}

export interface Plan {
  management: string;
  lifestyle_advice: string;
  follow_up: string;
  patient_education: string;
  treatment_goal: string;
  plan_reasoning: string;
}

export interface Prescription {
  medication_name: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Investigation {
  test_type: string;
  reason: string;
  instructions: string;
  scheduled_time: string;
}

export interface Summary {
  health_score: number;
  daily_progress_notes?: string;
  discharge_instructions?: string;
}

export interface ReviewData {
  subjective: Subjective;
  objective: Objective;
  assessment: Assessment;
  plan: Plan;
  next_review: string;
  prescription: Prescription[];
  investigation: Investigation[];
  summary: Summary;
}

export interface GoalData extends HealthGoal {
  goal_name_suggestion?: string;
  target_date_suggestion?: string;
  comments_suggestion?: string;
  metrics_suggestion?: Metric[];
  actions_suggestion?: Action[];
  suggestion_rational?: string;
}

export interface MedicalNote {
  profile_data: ProfileData;
  goal_data: GoalData;
  review_data: ReviewData;
}

export type SpeakerType = "patient" | "doctor" | "nurse" | "other";

export interface Transcript {
  time: string;
  speaker: SpeakerType;
  content: string;
}

export interface MedicalScribeData {
  transcript: Transcript[];
  note: MedicalNote;
}

export const defaultMetric: Metric = {
  metric_name: '',
  unit: '',
  interval: 24,
  target_value: 0
};

export const defaultAction: Action = {
  name: '',
  description: '',
  interval: 24,
  action_end_date: ''
};
