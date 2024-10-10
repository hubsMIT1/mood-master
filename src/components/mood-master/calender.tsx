import React, { useState, useEffect } from 'react';
import {
    Laugh, Smile, Meh, Frown, Angry,
    ChevronLeft, ChevronRight, BarChart2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodConfig {
    Icon: React.ElementType;
    color: string;
    name: string;
    value: number;
}

interface MoodData {
    date: string;
    mood: keyof typeof moodConfig;
    journalEntry: string;
    activities: string;
    sleepHours: number;
}

interface CalendarDayProps {
    day: number;
    mood: keyof typeof moodConfig | undefined;
    isCurrentMonth: boolean;
    onClick: () => void;
}
const moodConfig: Record<string, MoodConfig> = {
    hilarious: { Icon: Laugh, color: 'yellow', name: 'Hilarious', value: 5 },
    happy: { Icon: Smile, color: 'green', name: 'Happy', value: 4 },
    neutral: { Icon: Meh, color: 'gray', name: 'Neutral', value: 3 },
    sad: { Icon: Frown, color: 'blue', name: 'Sad', value: 2 },
    awful: { Icon: Angry, color: 'red', name: 'Awful', value: 1 },
};

const generateDummyData = (days: number): MoodData[] => {
    return Array(days).fill(null).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        const mood = Object.keys(moodConfig)[Math.floor(Math.random() * 5)] as keyof typeof moodConfig;
        return {
            date: date.toISOString().split('T')[0],
            mood,
            journalEntry: `This is a dummy journal entry for ${date.toDateString()}.`,
            activities: ['Exercise', 'Reading', 'Meditation'][Math.floor(Math.random() * 3)],
            sleepHours: Math.floor(Math.random() * 4) + 6,
        };
    });
};

const CalendarView: React.FC = () => {
    const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [moodData, setMoodData] = useState<MoodData[]>([]);
    const [insights, setInsights] = useState<string>('');

    useEffect(() => {
        // In a real app, you'd fetch this data from your backend
        setMoodData(generateDummyData(90)); // 3 months of data
    }, []);

    useEffect(() => {
        generateInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moodData]);

    const generateInsights = () => {
        const happyDays = moodData.filter(day => ['hilarious', 'happy'].includes(day.mood)).length;
        const sadDays = moodData.filter(day => ['sad', 'awful'].includes(day.mood)).length;
        const commonActivity = moodData
            .filter(day => ['hilarious', 'happy'].includes(day.mood))
            .reduce<Record<string, number>>((acc, day) => {
                acc[day.activities] = (acc[day.activities] || 0) + 1;
                return acc;
            }, {});
        const topActivity = Object.entries(commonActivity).sort((a, b) => b[1] - a[1])[0];

        setInsights(`In the last ${moodData.length} days, you've had ${happyDays} happy days and ${sadDays} challenging days. 
                 ${topActivity ? `${topActivity[0]} seems to be associated with your happier moods.` : ''}
                 Your average sleep on good days is ${(moodData.filter(day => ['hilarious', 'happy'].includes(day.mood)).reduce((sum, day) => sum + day.sleepHours, 0) / happyDays).toFixed(1)} hours.`);
    };

    const CalendarDay: React.FC<CalendarDayProps> = ({ day, mood, isCurrentMonth, onClick }) => {
        const { color, name, Icon } = mood ? moodConfig[mood] : moodConfig.neutral;
        return (
            <div
                className={`relative group ${isCurrentMonth ? '' : 'opacity-50'}`}
                onClick={onClick}
            >
                <div
                    className={`aspect-square border rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer bg-${color}-100`}
                >
                    <div>{day}</div>
                    <Icon size={16} className={`text-${color}-500`} />
                </div>
    
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {name}
                </div>
            </div>
        );
    };
    

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
            const dayData = moodData.find(d => d.date === date) || { mood: undefined };
            days.push(
                <CalendarDay
                    key={day}
                    day={day}
                    mood={dayData.mood}
                    isCurrentMonth={true}
                    onClick={() => setSelectedDate(date)}
                />
            );
        }

        return days;
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        return Array(7).fill(null).map((_, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const dateString = date.toISOString().split('T')[0];
            const dayData = moodData.find(d => d.date === dateString) || { mood: undefined };
            return (
                <CalendarDay
                    key={index}
                    day={date.getDate()}
                    mood={dayData.mood}
                    isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                    onClick={() => setSelectedDate(dateString)}
                />
            );
        });
    };

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    const selectedDayData = selectedDate ? moodData.find(d => d.date === selectedDate) : null;


    return (
        <main className="p-4 max-w-md mx-auto mb-20">
            <h2 className="text-2xl font-bold mb-6">Your Mood Calendar</h2>

            <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold">
                    {viewType === 'month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    {viewType === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
                    {viewType === 'day' && currentDate.toLocaleDateString()}
                </div>
                <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Select 
                value={viewType} 
                onValueChange={(value: 'month' | 'week' | 'day') => setViewType(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                </SelectContent>
            </Select>

            <Card className="mt-4 mb-6">
                <CardContent className="pt-6">
                    {viewType === 'month' && (
                        <>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className="text-center text-gray-500 font-medium">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {renderCalendar()}
                            </div>
                        </>
                    )}
                    {viewType === 'week' && (
                        <div className="grid grid-cols-7 gap-2">
                            {renderWeekView()}
                        </div>
                    )}
                    {viewType === 'day' && (
                        <CalendarDay
                            day={currentDate.getDate()}
                            mood={moodData.find(d => d.date === currentDate.toISOString().split('T')[0])?.mood}
                            isCurrentMonth={true}
                            onClick={() => setSelectedDate(currentDate.toISOString().split('T')[0])}
                        />
                    )}
                </CardContent>
            </Card>

            {selectedDayData && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{new Date(selectedDayData.date).toDateString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center text-green-500">
                                {/* <moodConfig[selectedDayData.mood].Icon className="mr-2" /> {moodConfig[selectedDayData.mood].name} */}
                            </div>
                            <p className="text-gray-600">{selectedDayData.journalEntry}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">{selectedDayData.activities}</span>
                                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">{selectedDayData.sleepHours}h Sleep</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Mood Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={moodData.slice(-30)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey={(data) => moodConfig[data.mood].value} stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Alert>
                <BarChart2 className="h-4 w-4" />
                <AlertTitle>Insights</AlertTitle>
                <AlertDescription>{insights}</AlertDescription>
            </Alert>
        </main>
    );
};

export default CalendarView;