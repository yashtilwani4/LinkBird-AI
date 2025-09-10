import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Lock, Bell, Database } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
  });

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <AppLayout 
      title="Settings" 
      breadcrumbs={[{ label: 'Settings' }]}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">{user?.email}</h3>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm text-muted-foreground">••••••••</span>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="text-sm font-medium">Not enabled</div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive updates about your campaigns and leads
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Get real-time updates in your browser
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline">Export Data</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Delete Account
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Data Usage</div>
              <div className="text-sm text-muted-foreground">
                Your account contains campaigns, leads, and interaction data. 
                You can export this data at any time.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;