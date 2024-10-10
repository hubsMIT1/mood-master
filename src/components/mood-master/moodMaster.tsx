'use client'
import React, { useState } from 'react';
import { 
  Calendar, PenTool, Settings, 
Users, Activity, ArrowRight,

} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Import additional components
import {
  
  
  
  RegistrationScreen
} from './additional-screen';

import {SettingsView} from './settings'

import JournalView from './journalView'

import CalendarView from './calender'

import ActivityTrackingView from './activity'
import CommunityView from './communityView'

const MoodTrackerApp = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentView, setCurrentView] = useState('welcome');  // Update the default if needed

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Mood Master</h1>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Your personal companion for emotional wellness. Track your moods, journal your thoughts, and gain valuable insights into your mental well-being.
      </p>
      <div className="space-y-4 w-full max-w-md">
      <button 
  onClick={() => setCurrentView('register')}  // Changed from 'login' to 'register'
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
>
  Get Started
</button>
        <button 
          onClick={() => setCurrentView('login')}
          className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
        >
          I already have an account
        </button>
      </div>
    </div>
  );

  // Login Screen (User Story 2)
  const LoginScreen = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setCurrentView('journal');
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <div className="text-center">
            <button className="text-blue-600 text-sm">Enable Two-Factor Authentication</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Insights View (User Stories 6, 9)
  const InsightsView = () => (
    <div className="p-4 max-w-md mx-auto mb-20">
      <h2 className="text-2xl font-bold mb-6">Your Insights</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end justify-between gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-md" 
                  style={{ height: `${Math.random() * 100}%` }}
                />
                <span className="text-xs mt-2">{day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Activity Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Exercise', impact: 75 },
              { name: 'Sleep', impact: 80 },
              { name: 'Nutrition', impact: 65 },
              { name: 'Meditation', impact: 70 }
            ].map((activity) => (
              <div key={activity.name}>
                <div className="flex justify-between mb-1">
                  <span>{activity.name}</span>
                  <span className="text-green-500">+{activity.impact}% positive impact</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${activity.impact}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ArrowRight className="mr-2 mt-1 flex-shrink-0 text-blue-500" />
              <span>Try meditation before bed to improve sleep quality</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="mr-2 mt-1 flex-shrink-0 text-blue-500" />
              <span>Schedule regular exercise for mood stability</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="mr-2 mt-1 flex-shrink-0 text-blue-500" />
              <span>Consider journaling in the morning to start your day mindfully</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
  // Navigation Bar
  const NavigationBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-around max-w-md mx-auto">
        <button 
          onClick={() => setCurrentView('journal')}
          className={`flex flex-col items-center ${currentView === 'journal' ? 'text-blue-600' : 'text-gray-500'}`}>
          <PenTool size={24} />
          <span className="text-xs mt-1">Journal</span>
        </button>
        <button 
          onClick={() => setCurrentView('calendar')}
          className={`flex flex-col items-center ${currentView === 'calendar' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Calendar size={24} />
          <span className="text-xs mt-1">Calendar</span>
        </button>
        <button 
          onClick={() => setCurrentView('activity')}
          className={`flex flex-col items-center ${currentView === 'activity' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Activity size={24} />
          <span className="text-xs mt-1">Activity</span>
        </button>
        <button 
          onClick={() => setCurrentView('community')}
          className={`flex flex-col items-center ${currentView === 'community' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Users size={24} />
          <span className="text-xs mt-1">Community</span>
        </button>
        <button 
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center ${currentView === 'settings' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
    {!isLoggedIn ? (
      currentView === 'welcome' ? (
        <WelcomeScreen />
      ) : currentView === 'register' ? (
        <RegistrationScreen 
          onRegisterSuccess={() => {
            setCurrentView('login');
            // You might want to pass the registration data to pre-fill the login form
          }} 
        />
      ) : (
        <LoginScreen />
      )
    ): (
        <>
          {currentView === 'journal' && <JournalView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'activity' && <ActivityTrackingView />}
          {currentView === 'community' && <CommunityView />}
          {currentView === 'settings' && <SettingsView />}
          <NavigationBar />
        </>
      )}
    </div>
  );
};

export default MoodTrackerApp;