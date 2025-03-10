
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
