import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Filter } from 'lucide-react';

const Messages = () => {
  const conversations = [
    {
      id: '1',
      leadName: 'John Smith',
      lastMessage: 'Thanks for connecting! I\'d love to learn more about your services.',
      timestamp: '2 hours ago',
      status: 'replied',
      unread: false
    },
    {
      id: '2',
      leadName: 'Sarah Johnson',
      lastMessage: 'Initial connection request sent',
      timestamp: '1 day ago',
      status: 'sent',
      unread: false
    },
    {
      id: '3',
      leadName: 'Mike Davis',
      lastMessage: 'Connection accepted',
      timestamp: '3 days ago',
      status: 'connected',
      unread: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-800';
      case 'connected': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout title="Messages" breadcrumbs={[{ label: 'Messages' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Conversations</h2>
            <p className="text-sm text-muted-foreground">
              Manage all your LinkedIn conversations in one place
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search conversations..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">
                        {conversation.leadName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{conversation.leadName}</h3>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(conversation.status)}>
                      {conversation.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first campaign to begin conversations with leads
              </p>
              <Button>Create Campaign</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;