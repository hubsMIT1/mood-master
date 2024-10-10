import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Plus, Trash2, 
  BarChart2, Droplet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Meal {
  name: string;
  calories: string;
}

interface NutritionData {
  meals: Meal[];
  waterIntake: number;
}

interface CustomActivity {
  name: string;
  duration: string;
}

const ActivityTrackingView = () => {
  const [sleepData, setSleepData] = useState({ duration: '7', quality: 'Good' });
  const [exerciseData, setExerciseData] = useState({ type: 'Walking', duration: '30', intensity: 'Moderate' });
  const [nutritionData, setNutritionData] = useState<NutritionData>({ meals: [], waterIntake: 0 });
  const [customActivities, setCustomActivities] = useState<CustomActivity[]>([]);
  const [newCustomActivity, setNewCustomActivity] = useState('');
  const [insights, setInsights] = useState('');

  useEffect(() => {
    // Generate insights based on activity data
    generateInsights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepData, exerciseData, nutritionData, customActivities]);

  const generateInsights = () => {
    const newInsights: string[] = [];
    if (parseInt(sleepData.duration) < 7) {
      newInsights.push("You might want to aim for 7-9 hours of sleep for optimal health.");
    }
    if (exerciseData.duration && parseInt(exerciseData.duration) >= 30) {
      newInsights.push("Great job on staying active today!");
    }
    if (nutritionData.waterIntake < 8) {
      newInsights.push("Try to increase your water intake to at least 8 glasses a day.");
    }
    setInsights(newInsights.join(' '));
  };

  const addMeal = () => {
    setNutritionData(prev => ({
      ...prev,
      meals: [...prev.meals, { name: '', calories: '' }]
    }));
  };

  const updateMeal = (index: number, field: keyof Meal, value: string) => {
    setNutritionData(prev => {
      const newMeals = [...prev.meals];
      newMeals[index] = { ...newMeals[index], [field]: value };
      return { ...prev, meals: newMeals };
    });
  };

  const removeMeal = (index: number) => {
    setNutritionData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const addCustomActivity = () => {
    if (newCustomActivity.trim()) {
      setCustomActivities(prev => [...prev, { name: newCustomActivity.trim(), duration: '' }]);
      setNewCustomActivity('');
    }
  };

  const updateCustomActivity = (index: number, field: keyof CustomActivity, value: string) => {
    setCustomActivities(prev => {
      const newActivities = [...prev];
      newActivities[index] = { ...newActivities[index], [field]: value };
      return newActivities;
    });
  };

  const removeCustomActivity = (index: number) => {
    setCustomActivities(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-md mx-auto mb-20">
      <h2 className="text-2xl font-bold mb-6">Track Your Activities</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sleep Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="mr-2" />
                <span>Sleep Duration</span>
              </div>
              <Select
                value={sleepData.duration}
                onValueChange={(value) => setSleepData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  {Array(13).fill(null).map((_, i) => (
                    <SelectItem key={i} value={`${i + 4}`}>{i + 4} hours</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="mr-2" />
                <span>Sleep Quality</span>
              </div>
              <Select
                value={sleepData.quality}
                onValueChange={(value) => setSleepData(prev => ({ ...prev, quality: value }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exercise Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={exerciseData.type}
              onValueChange={(value) => setExerciseData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Walking">Walking</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Weight Training">Weight Training</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Duration</label>
                <Select
                  value={exerciseData.duration}
                  onValueChange={(value) => setExerciseData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array(12).fill(null).map((_, i) => (
                      <SelectItem key={i} value={`${(i + 1) * 15}`}>{(i + 1) * 15} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Intensity</label>
                <Select
                  value={exerciseData.intensity}
                  onValueChange={(value) => setExerciseData(prev => ({ ...prev, intensity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nutrition Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplet className="mr-2" />
                <span>Water Intake (glasses)</span>
              </div>
              <Input
                type="number"
                value={nutritionData.waterIntake}
                onChange={(e) => setNutritionData(prev => ({ ...prev, waterIntake: parseInt(e.target.value) || 0 }))}
                className="w-20"
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Meals</h3>
              {nutritionData.meals.map((meal, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder="Meal name"
                    value={meal.name}
                    onChange={(e) => updateMeal(index, 'name', e.target.value)}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={meal.calories}
                    onChange={(e) => updateMeal(index, 'calories', e.target.value)}
                    className="w-24"
                  />
                  <Button variant="outline" size="icon" onClick={() => removeMeal(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addMeal} className="w-full mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Meal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custom Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={activity.name}
                  onChange={(e) => updateCustomActivity(index, 'name', e.target.value)}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={activity.duration}
                  onChange={(e) => updateCustomActivity(index, 'duration', e.target.value)}
                  className="w-24"
                />
                <Button variant="outline" size="icon" onClick={() => removeCustomActivity(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New activity"
                value={newCustomActivity}
                onChange={(e) => setNewCustomActivity(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addCustomActivity}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {insights && (
        <Alert className="mb-6">
          <BarChart2 className="h-4 w-4" />
          <AlertTitle>Insights</AlertTitle>
          <AlertDescription>{insights}</AlertDescription>
        </Alert>
      )}

      <Button className="w-full">
        Save Activities
      </Button>
    </div>
  );
};

export default ActivityTrackingView;