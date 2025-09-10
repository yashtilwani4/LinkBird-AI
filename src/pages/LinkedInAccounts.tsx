import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Settings, AlertCircle, CheckCircle } from 'lucide-react';

const LinkedInAccounts = () => {
  const accounts = [
    {
      id: '1',
      name: 'John Doe',
      profileUrl: 'https://linkedin.com/in/johndoe',
      status: 'active',
      connections: 1250,
      weeklyRequests: 45,
      maxWeeklyRequests: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <AppLayout title="LinkedIn Accounts" breadcrumbs={[{ label: 'LinkedIn Accounts' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">LinkedIn Accounts</h2>
            <p className="text-sm text-muted-foreground">
              Connect and manage your LinkedIn profiles for automated outreach
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {account.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>{account.profileUrl}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(account.status)}>
                      {getStatusIcon(account.status)}
                      <span className="ml-1 capitalize">{account.status}</span>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Total Connections</p>
                    <p className="text-2xl font-bold text-primary">{account.connections.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Weekly Requests</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-primary">{account.weeklyRequests}</p>
                      <p className="text-sm text-muted-foreground">/ {account.maxWeeklyRequests}</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(account.weeklyRequests / account.maxWeeklyRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">24%</p>
                    <p className="text-xs text-muted-foreground">Connection acceptance rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to connect your LinkedIn account safely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure your LinkedIn account before connecting it to our platform
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Connect Your Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our secure OAuth integration to connect your LinkedIn profile
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Configure Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Set daily and weekly limits to stay within LinkedIn's guidelines
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {accounts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No LinkedIn accounts connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your LinkedIn account to start sending automated connection requests
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default LinkedInAccounts;