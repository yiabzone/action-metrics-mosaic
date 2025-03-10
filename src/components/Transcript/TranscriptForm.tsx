
import React, { useState } from 'react';
import { Transcript } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TranscriptFormProps {
  transcripts: Transcript[];
  onSave: (transcripts: Transcript[]) => void;
}

const TranscriptForm: React.FC<TranscriptFormProps> = ({ transcripts: initialTranscripts, onSave }) => {
  const { toast } = useToast();
  const [transcripts, setTranscripts] = useState<Transcript[]>(initialTranscripts);

  const handleSpeakerChange = (index: number, value: "patient" | "doctor") => {
    const updatedTranscripts = [...transcripts];
    updatedTranscripts[index] = {
      ...updatedTranscripts[index],
      speaker: value
    };
    setTranscripts(updatedTranscripts);
  };

  const handleContentChange = (index: number, value: string) => {
    const updatedTranscripts = [...transcripts];
    updatedTranscripts[index] = {
      ...updatedTranscripts[index],
      content: value
    };
    setTranscripts(updatedTranscripts);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updatedTranscripts = [...transcripts];
    updatedTranscripts[index] = {
      ...updatedTranscripts[index],
      time: value
    };
    setTranscripts(updatedTranscripts);
  };

  const addTranscriptEntry = () => {
    // Create a new timestamp for now
    const now = new Date().toISOString();
    setTranscripts([
      ...transcripts,
      {
        time: now,
        speaker: "patient", // Use the literal value that matches the type
        content: ""
      }
    ]);
  };

  const removeTranscriptEntry = (index: number) => {
    setTranscripts(transcripts.filter((_, i) => i !== index));
  };

  const handleSaveTranscripts = () => {
    // Validation - ensure all transcript entries have content
    const isValid = transcripts.every(entry => entry.content.trim() !== "");
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "All transcript entries must have content",
        variant: "destructive"
      });
      return;
    }

    onSave(transcripts);
    toast({
      title: "Transcript saved",
      description: "The conversation transcript has been updated successfully."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Conversation Transcript</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={addTranscriptEntry}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Entry
          </Button>
          <Button onClick={handleSaveTranscripts} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Transcript
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transcripts.map((entry, index) => (
            <div key={index} className="border p-4 rounded-md relative">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <Label htmlFor={`speaker-${index}`}>Speaker</Label>
                  <Select
                    value={entry.speaker}
                    onValueChange={(value) => handleSpeakerChange(index, value as "patient" | "doctor")}
                  >
                    <SelectTrigger id={`speaker-${index}`}>
                      <SelectValue placeholder="Select speaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`time-${index}`}>Time</Label>
                  <Input
                    id={`time-${index}`}
                    type="datetime-local"
                    value={entry.time.substring(0, 16)} // Format for datetime-local input
                    onChange={(e) => handleTimeChange(index, new Date(e.target.value).toISOString())}
                  />
                </div>
                <div className="col-span-5">
                  <Label htmlFor={`content-${index}`}>Content</Label>
                  <Textarea
                    id={`content-${index}`}
                    value={entry.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="col-span-1 flex items-end justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeTranscriptEntry(index)}
                    disabled={transcripts.length === 1}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptForm;
