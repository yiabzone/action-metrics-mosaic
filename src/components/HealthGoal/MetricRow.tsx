
import React from 'react';
import { Metric } from '@/types/goalTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MetricRowProps {
  metric: Metric;
  onChange: (updatedMetric: Metric) => void;
  onDelete: () => void;
  isDeleteDisabled: boolean;
  className?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ 
  metric, 
  onChange, 
  onDelete, 
  isDeleteDisabled,
  className 
}) => {
  const handleChange = (field: keyof Metric, value: string | number) => {
    onChange({
      ...metric,
      [field]: field === 'interval' || field === 'target_value'
        ? Number(value)
        : value
    });
  };

  return (
    <div className={cn("grid grid-cols-12 gap-3 items-end mb-3", className)}>
      <div className="col-span-3">
        <Label htmlFor="metric_name">Metric Name</Label>
        <Input
          id="metric_name"
          value={metric.metric_name}
          onChange={(e) => handleChange('metric_name', e.target.value)}
          placeholder="e.g., Headache Frequency"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          value={metric.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          placeholder="e.g., episodes/week"
        />
      </div>
      <div className="col-span-3">
        <Label htmlFor="interval">Recording Interval (hours)</Label>
        <Input
          id="interval"
          type="number"
          min="0"
          value={metric.interval}
          onChange={(e) => handleChange('interval', e.target.value)}
          placeholder="72"
        />
      </div>
      <div className="col-span-3">
        <Label htmlFor="target_value">Target Value</Label>
        <div className="flex items-center gap-2">
          <Input
            id="target_value"
            type="number"
            value={metric.target_value}
            onChange={(e) => handleChange('target_value', e.target.value)}
            placeholder="1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete} 
            disabled={isDeleteDisabled}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetricRow;
