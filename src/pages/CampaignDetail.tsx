import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Edit,
  Play,
  Pause,
  Settings as SettingsIcon
} from 'lucide-react';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error('Campaign ID not found');
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: campaignLeads } = useQuery({
    queryKey: ['campaign-leads', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Loading..." breadcrumbs={[]}>
        <div>Loading campaign details...</div>
      </AppLayout>
    );
  }

  if (!campaign) {
    return (
      <AppLayout title="Campaign Not Found" breadcrumbs={[]}>
        <div>Campaign not found</div>
      </AppLayout>
    );
  }

  const leads = campaignLeads || [];
  const connectedLeads = leads.filter(lead => lead.status === 'connected').length;
  const repliedLeads = leads.filter(lead => lead.status === 'replied').length;
  const responseRate = leads.length > 0 ? (repliedLeads / leads.length) * 100 : 0;

  return (
    <AppLayout 
      title={campaign.name}
      breadcrumbs={[
        { label: 'Campaigns', href: '/campaigns' },
        { label: campaign.name }
      ]}
    >
      <div className="space-y-6">
        {/* Campaign Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
              <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {campaign.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button>
              {campaign.status === 'active' ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Campaign Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="sequence">Sequence</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leads.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connected</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{connectedLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    {leads.length > 0 ? Math.round((connectedLeads / leads.length) * 100) : 0}% acceptance rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Replied</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{repliedLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(responseRate)}% response rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={responseRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">Campaign completion</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Performance charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Campaign Leads</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Leads
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                {leads.length > 0 ? (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-medium text-sm">
                            <span className="text-primary-foreground font-medium text-sm">
                              {lead.first_name[0]}{lead.last_name[0]}
                            </span>
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                            {lead.company && (
                              <p className="text-xs text-muted-foreground">{lead.company}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            lead.status === 'connected' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'replied' ? 'bg-green-100 text-green-800' :
                            lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {lead.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No leads added yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add leads to this campaign to start your LinkedIn outreach
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Lead
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sequence Tab */}
          <TabsContent value="sequence" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Message Sequence</h3>
                <p className="text-sm text-muted-foreground">
                  Define your automated LinkedIn outreach sequence
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Message
              </Button>
            </div>

            {/* Invitation Request */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  Connection Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invitation-subject">Subject (Optional)</Label>
                  <Input 
                    id="invitation-subject" 
                    placeholder="I'd love to connect with you"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="invitation-message">Message</Label>
                  <Textarea 
                    id="invitation-message"
                    placeholder="Hi {{firstName}}, I came across your profile and would love to connect. I'm impressed by your work at {{company}}."
                    className="mt-1"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use {`{{firstName}}`}, {`{{lastName}}`}, {`{{company}}`}, {`{{jobTitle}}`} for personalization
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  Follow-up Message 1
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="followup1-delay">Send after (days)</Label>
                  <Input 
                    id="followup1-delay" 
                    type="number"
                    placeholder="3"
                    className="mt-1 w-24"
                  />
                </div>
                <div>
                  <Label htmlFor="followup1-message">Message</Label>
                  <Textarea 
                    id="followup1-message"
                    placeholder="Hi {{firstName}}, thanks for connecting! I noticed you're working at {{company}}. I'd love to learn more about your role as {{jobTitle}}."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add more sequence steps placeholder */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-3">Add more follow-up messages to your sequence</p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Follow-up Message
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Campaign Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input 
                      id="campaign-name" 
                      defaultValue={campaign.name}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-status">Status</Label>
                    <select 
                      id="campaign-status" 
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                      defaultValue={campaign.status}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea 
                    id="campaign-description"
                    defaultValue={campaign.description || ''}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="daily-limit">Daily Connection Limit</Label>
                    <Input 
                      id="daily-limit" 
                      type="number"
                      placeholder="20"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 15-25 per day to stay within LinkedIn limits
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="weekly-limit">Weekly Connection Limit</Label>
                    <Input 
                      id="weekly-limit" 
                      type="number"
                      placeholder="100"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CampaignDetail;