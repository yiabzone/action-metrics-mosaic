
import React from 'react';
import { Transcript } from '@/types/goalTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TranscriptSectionProps {
  transcripts: Transcript[];
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcripts }) => {
  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Conversation Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transcripts.map((entry, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                entry.speaker === 'doctor' 
                  ? 'bg-blue-50 ml-8' 
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold capitalize">{entry.speaker}</p>
                <p className="text-sm text-gray-500">{formatTime(entry.time)}</p>
              </div>
              <p>{entry.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptSection;
