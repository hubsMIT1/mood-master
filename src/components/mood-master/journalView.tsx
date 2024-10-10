import React, { useState, useEffect } from 'react';
import { 
  Laugh, Smile, Meh, Frown, Angry, AlertCircle, BellRing, Heart, ArrowRight, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Emotion {
  Icon: React.ElementType;
  name: string;
  color: string;
}

interface Activities {
  sleep: { hours: number; quality: string };
  exercise: { type: string; duration: number };
  nutrition: { meals: string[]; water: number };
  selfCare: { activities: string[] };
}

const JournalView: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [activities, setActivities] = useState<Activities>({
    sleep: { hours: 0, quality: '' },
    exercise: { type: '', duration: 0 },
    nutrition: { meals: [], water: 0 },
    selfCare: { activities: [] }
  });
  const [customActivity, setCustomActivity] = useState<string>('');
  const [aiInsight, setAiInsight] = useState<string>('');

  const emotions: Emotion[] = [
    { Icon: Laugh, name: "Hilarious", color: "yellow" },
    { Icon: Smile, name: "Happy", color: "green" },
    { Icon: Meh, name: "Neutral", color: "gray" },
    { Icon: Frown, name: "Sad", color: "blue" },
    { Icon: Angry, name: "Awful", color: "red" },
    { Icon: AlertCircle, name: "Shocked", color: "purple" }
  ];

  useEffect(() => {
    // Simulating AI insight generation based on mood and activities
    if (selectedMood && activities.exercise.duration > 0) {
      setAiInsight("Your mood tends to be more positive on days when you exercise. Great job on staying active today!");
    } else if (selectedMood === "Sad" || selectedMood === "Awful") {
      setAiInsight("I noticed you're not feeling great today. Consider trying a quick meditation or reaching out to a friend.");
    }
  }, [selectedMood, activities]);

  const EmotionButton: React.FC<Emotion> = ({ Icon, name, color }) => (
    <div className="relative group">
      <button 
        className={`p-3 hover:bg-${color}-100 rounded-full ${selectedMood === name ? `bg-${color}-200` : ''}`}
        onClick={() => setSelectedMood(name)}
      >
        <Icon size={32} className={`text-${color}-500`} />
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {name}
      </div>
    </div>
  );

  const handleActivityChange = (
    category: keyof Activities, 
    field: string, 
    value: string | number | string[]
  ) => {
    setActivities(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const addCustomActivity = () => {
    if (customActivity) {
      setActivities(prev => ({
        ...prev,
        selfCare: {
          ...prev.selfCare,
          activities: [...prev.selfCare.activities, customActivity]
        }
      }));
      setCustomActivity('');
    }
  };

  const saveJournalEntry = () => {
    // Here you would typically save the journal entry to your backend
    console.log("Saving journal entry:", {
      mood: selectedMood,
      journalEntry,
      activities,
      timestamp: new Date().toISOString()
    });
    // Reset form or navigate to another view
  };

  return (
    <div className="p-4 max-w-md mx-auto mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{`Today's Entry`}</h1>
        <BellRing className="text-gray-500" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around mb-4">
            {emotions.map((emotion, index) => (
              <EmotionButton key={index} {...emotion} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Daily Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            className="w-full p-3 border rounded-lg" 
            rows={4}
            placeholder="How was your day? What's on your mind?"
            value={journalEntry}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJournalEntry(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Track Your Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Sleep</h3>
              <div className="flex space-x-2">
                <Input 
                  type="number" 
                  placeholder="Hours"
                  value={activities.sleep.hours}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActivityChange('sleep', 'hours', parseInt(e.target.value) || 0)}
                />
                <Select 
                  value={activities.sleep.quality}
                  onValueChange={(value: string) => handleActivityChange('sleep', 'quality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Exercise</h3>
              <div className="flex space-x-2">
                <Select 
                  value={activities.exercise.type}
                  onValueChange={(value: string) => handleActivityChange('exercise', 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number" 
                  placeholder="Minutes"
                  value={activities.exercise.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActivityChange('exercise', 'duration', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Nutrition</h3>
              <div className="flex space-x-2 mb-2">
                <Input 
                  type="number" 
                  placeholder="Water (glasses)"
                  value={activities.nutrition.water}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActivityChange('nutrition', 'water', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                {activities.nutrition.meals.map((meal, index) => (
                  <div key={index} className="mb-1">{meal}</div>
                ))}
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Add a meal"
                    value={customActivity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomActivity(e.target.value)}
                  />
                 <Button onClick={() => {
  if (customActivity) {
    handleActivityChange('nutrition', 'meals', [...activities.nutrition.meals, customActivity]);
    setCustomActivity('');
  }
}}>
  <Plus size={16} />
</Button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Self-care</h3>
              <div>
                {activities.selfCare.activities.map((activity, index) => (
                  <div key={index} className="mb-1">{activity}</div>
                ))}
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Add self-care activity"
                    value={customActivity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomActivity(e.target.value)}
                  />
                  <Button onClick={addCustomActivity}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {aiInsight && (
        <Alert className="mb-6">
          <Heart className="h-4 w-4" />
          <AlertTitle>AI Insight</AlertTitle>
          <AlertDescription>{aiInsight}</AlertDescription>
        </Alert>
      )}

      <Button className="w-full" onClick={saveJournalEntry}>
        {`Save Today's Entry`} <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

export default JournalView;