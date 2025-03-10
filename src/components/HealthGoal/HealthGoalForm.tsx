
import React, { useState, useEffect } from 'react';
import { HealthGoal, Metric, Action, defaultMetric, defaultAction } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MetricRow from './MetricRow';
import ActionRow from './ActionRow';

interface HealthGoalFormProps {
  initialData?: HealthGoal;
  onSave?: (goal: HealthGoal) => void;
}

const HealthGoalForm: React.FC<HealthGoalFormProps> = ({ 
  initialData, 
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<HealthGoal>(() => {
    if (initialData) return initialData;
    
    const today = new Date();
    // Set target date to 3 months from now
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() + 3);
    
    return {
      goal_name: '',
      target_date: targetDate.toISOString().substring(0, 10),
      comments: '',
      metrics: [{ ...defaultMetric }],
      actions: [{ ...defaultAction }],
    };
  });

  const [errors, setErrors] = useState({
    goal_name: false,
    hasValidMetric: false,
    hasValidAction: false
  });

  const updateFormField = (field: keyof HealthGoal, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Clear error when field is updated
    if (field === 'goal_name') {
      setErrors(prev => ({ ...prev, goal_name: false }));
    }
  };

  const updateMetric = (index: number, updatedMetric: Metric) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = updatedMetric;
    updateFormField('metrics', updatedMetrics);
  };

  const updateAction = (index: number, updatedAction: Action) => {
    const updatedActions = [...formData.actions];
    updatedActions[index] = updatedAction;
    updateFormField('actions', updatedActions);
  };

  const addMetric = () => {
    updateFormField('metrics', [...formData.metrics, { ...defaultMetric }]);
  };

  const addAction = () => {
    updateFormField('actions', [...formData.actions, { ...defaultAction }]);
  };

  const deleteMetric = (index: number) => {
    const updatedMetrics = formData.metrics.filter((_, i) => i !== index);
    updateFormField('metrics', updatedMetrics);
  };

  const deleteAction = (index: number) => {
    const updatedActions = formData.actions.filter((_, i) => i !== index);
    updateFormField('actions', updatedActions);
  };

  const validateForm = (): boolean => {
    // Check if goal name is filled
    const hasGoalName = !!formData.goal_name.trim();
    
    // Check if there's at least one valid metric
    const hasValidMetric = formData.metrics.some(
      m => !!m.metric_name.trim() && !!m.unit.trim() && m.target_value !== undefined
    );
    
    // Check if there's at least one valid action
    const hasValidAction = formData.actions.some(
      a => !!a.name.trim() && !!a.description.trim() && !!a.action_end_date
    );
    
    // Update error states
    setErrors({
      goal_name: !hasGoalName,
      hasValidMetric: !hasValidMetric,
      hasValidAction: !hasValidAction
    });
    
    // Form is valid if it has a goal name and at least one valid metric OR action
    return hasGoalName && (hasValidMetric || hasValidAction);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Filter out empty metrics and actions before saving
      const filteredData = {
        ...formData,
        metrics: formData.metrics.filter(m => !!m.metric_name.trim()),
        actions: formData.actions.filter(a => !!a.name.trim())
      };
      
      if (onSave) {
        onSave(filteredData);
      }
      
      toast({
        title: "Health goal saved",
        description: "Your health goal has been saved successfully."
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Health Goals</CardTitle>
          <CardDescription>
            Track your health goals with measurable metrics and actionable steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Goal Name */}
            <div>
              <Label htmlFor="goal_name" className="font-medium">
                Goal Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="goal_name"
                value={formData.goal_name}
                onChange={(e) => updateFormField('goal_name', e.target.value)}
                placeholder="e.g., Manage Headache Symptoms"
                className={errors.goal_name ? "border-red-500" : ""}
              />
              {errors.goal_name && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            {/* Target Date */}
            <div>
              <Label htmlFor="target_date" className="font-medium">Target Date</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => updateFormField('target_date', e.target.value)}
              />
            </div>

            {/* Comments */}
            <div>
              <Label htmlFor="comments" className="font-medium">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => updateFormField('comments', e.target.value)}
                placeholder="Additional notes about this goal..."
                className="min-h-[100px]"
              />
            </div>

            {/* Metrics Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">
                  Metrics {errors.hasValidMetric && !errors.hasValidAction && (
                    <span className="text-red-500 text-sm">
                      * At least one valid metric or action is required
                    </span>
                  )}
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addMetric}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Metric
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                {formData.metrics.map((metric, index) => (
                  <MetricRow
                    key={index}
                    metric={metric}
                    onChange={(updatedMetric) => updateMetric(index, updatedMetric)}
                    onDelete={() => deleteMetric(index)}
                    isDeleteDisabled={formData.metrics.length === 1}
                  />
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">
                  Actions {errors.hasValidAction && !errors.hasValidMetric && (
                    <span className="text-red-500 text-sm">
                      * At least one valid metric or action is required
                    </span>
                  )}
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAction}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Action
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                {formData.actions.map((action, index) => (
                  <ActionRow
                    key={index}
                    action={action}
                    onChange={(updatedAction) => updateAction(index, updatedAction)}
                    onDelete={() => deleteAction(index)}
                    isDeleteDisabled={formData.actions.length === 1}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Health Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default HealthGoalForm;
