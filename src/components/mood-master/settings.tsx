import React, { useState } from 'react';
import { 
  Bell, Lock, Shield, Award, ChevronRight, User, Mail, Phone, 
  Moon, Sun, LogOut, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationSetting {
  enabled: boolean;
  time: string;
  day?: string;
}

interface NotificationSettings {
  dailyReminder: NotificationSetting;
  weeklyInsights: NotificationSetting;
  communityUpdates: NotificationSetting;
}

interface Achievement {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
}

export const SettingsView: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [dataSharing, setDataSharing] = useState<boolean>(true);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyReminder: { enabled: true, time: '20:00' },
    weeklyInsights: { enabled: true, time: '10:00', day: 'Monday' },
    communityUpdates: { enabled: false, time: '12:00' }
  });

  const handleNotificationChange = (setting: keyof NotificationSettings, field: keyof NotificationSetting, value: string | boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: {
        ...prev[setting],
        [field]: value
      }
    }));
  };

  const achievements: Achievement[] = [
    { icon: Award, color: 'yellow', title: '7-Day Streak', description: 'Logged your mood for 7 days straight' },
    { icon: Award, color: 'blue', title: 'Mindfulness Master', description: 'Completed 10 meditation sessions' },
    { icon: Award, color: 'green', title: 'Insight Seeker', description: 'Reviewed your monthly insights 5 times' },
    { icon: Award, color: 'purple', title: 'Community Supporter', description: 'Participated in 3 community discussions' }
  ];

  const timeOptions: string[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const dayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-4 max-w-md mx-auto mb-20">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Account settings card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="mr-3" />
            <span>Edit Profile</span>
            <ChevronRight className="ml-auto" />
          </div>
          <div className="flex items-center">
            <Mail className="mr-3" />
            <span>Change Email</span>
            <ChevronRight className="ml-auto" />
          </div>
          <div className="flex items-center">
            <Phone className="mr-3" />
            <span>Update Phone Number</span>
            <ChevronRight className="ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(notificationSettings) as Array<keyof NotificationSettings>).map((setting) => (
            <div key={setting} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="mr-3" />
                  <span>{setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
                <Switch 
                  checked={notificationSettings[setting].enabled}
                  onCheckedChange={(checked) => handleNotificationChange(setting, 'enabled', checked)}
                />
              </div>
              {notificationSettings[setting].enabled && (
                <div className="ml-8 space-y-2">
                  {setting === 'weeklyInsights' && (
                    <Select
                      value={notificationSettings[setting].day}
                      onValueChange={(value) => handleNotificationChange(setting, 'day', value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Select
                    value={notificationSettings[setting].time}
                    onValueChange={(value) => handleNotificationChange(setting, 'time', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy & Security card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="mr-3" />
              <span>Two-Factor Authentication</span>
            </div>
            <Switch 
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="mr-3" />
              <span>Data Sharing</span>
            </div>
            <Switch 
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-red-500 flex items-center">
                <Trash2 className="mr-2" />
                Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 text-white">Delete Account</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Appearance card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? <Moon className="mr-3" /> : <Sun className="mr-3" />}
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center">
                <achievement.icon className={`mr-3 text-${achievement.color}-500`} />
                <div>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-500">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center">
        <LogOut className="mr-2" />
        Log Out
      </button>
    </div>
  );
};