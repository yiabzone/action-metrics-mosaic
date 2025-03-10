
import React from 'react';
import { Action } from '@/types/goalTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ActionRowProps {
  action: Action;
  onChange: (updatedAction: Action) => void;
  onDelete: () => void;
  isDeleteDisabled: boolean;
  className?: string;
}

const ActionRow: React.FC<ActionRowProps> = ({ 
  action, 
  onChange, 
  onDelete, 
  isDeleteDisabled,
  className 
}) => {
  const handleChange = (field: keyof Action, value: string | number) => {
    onChange({
      ...action,
      [field]: field === 'interval' ? Number(value) : value
    });
  };

  return (
    <div className={cn("grid grid-cols-12 gap-3 mb-3", className)}>
      <div className="col-span-3">
        <Label htmlFor="action_name">Action Name</Label>
        <Input
          id="action_name"
          value={action.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Hydration"
        />
      </div>
      <div className="col-span-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={action.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Drink at least 8 glasses of water daily."
          className="min-h-[80px]"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="interval">Interval (hours)</Label>
        <Input
          id="interval"
          type="number"
          min="0"
          value={action.interval}
          onChange={(e) => handleChange('interval', e.target.value)}
          placeholder="24"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="action_end_date">End Date</Label>
        <Input
          id="action_end_date"
          type="date"
          value={action.action_end_date}
          onChange={(e) => handleChange('action_end_date', e.target.value)}
        />
      </div>
      <div className="col-span-1 flex items-end justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete}
          disabled={isDeleteDisabled}
          className="mb-3"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ActionRow;
