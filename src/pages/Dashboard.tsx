import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Megaphone, TrendingUp, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [campaignsResponse, leadsResponse] = await Promise.all([
        supabase.from('campaigns').select('id, status, name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('id, status, first_name, last_name, campaign_id, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      if (campaignsResponse.error) throw campaignsResponse.error;
      if (leadsResponse.error) throw leadsResponse.error;

      const campaigns = campaignsResponse.data || [];
      const leads = leadsResponse.data || [];

      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const totalLeads = leads.length;
      const connectedLeads = leads.filter(l => l.status === 'connected').length;
      const repliedLeads = leads.filter(l => l.status === 'replied').length;
      const responseRate = totalLeads > 0 ? Math.round((repliedLeads / totalLeads) * 100) : 0;

      return {
        totalCampaigns: campaigns.length,
        activeCampaigns,
        totalLeads,
        connectedLeads,
        repliedLeads,
        responseRate,
        recentCampaigns: campaigns,
        recentLeads: leads,
      };
    },
  });

  const StatCard = ({ title, value, description, icon: Icon, isLoading }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'connected': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">LinkBird</h1>
            <p className="text-muted-foreground">
              Automate your LinkedIn outreach and manage connections efficiently
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <NavLink to="/campaigns">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </NavLink>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Campaigns"
            value={stats?.totalCampaigns ?? 0}
            description="LinkedIn outreach campaigns"
            icon={Megaphone}
            isLoading={isLoading}
          />
          <StatCard
            title="Active Campaigns"
            value={stats?.activeCampaigns ?? 0}
            description="Currently running"
            icon={TrendingUp}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads ?? 0}
            description="Connection targets"
            icon={Users}
            isLoading={isLoading}
          />
          <StatCard
            title="Response Rate"
            value={`${stats?.responseRate ?? 0}%`}
            description="Leads who replied"
            icon={MessageSquare}
            isLoading={isLoading}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Your latest LinkedIn outreach campaigns</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/campaigns">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : stats?.recentCampaigns?.length ? (
                  stats.recentCampaigns.map((campaign: any) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No campaigns yet</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <NavLink to="/campaigns">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Campaign
                      </NavLink>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>Latest LinkedIn connection targets</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/leads">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : stats?.recentLeads?.length ? (
                  stats.recentLeads.map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-medium">
                            {lead.first_name[0]}{lead.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No leads yet</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <NavLink to="/leads">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Lead
                      </NavLink>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with your LinkedIn automation workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Megaphone className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-medium mb-2">Create Campaign</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Set up automated LinkedIn connection sequences
                </p>
                <Button size="sm" asChild>
                  <NavLink to="/campaigns">Get Started</NavLink>
                </Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-medium mb-2">Import Leads</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload your target LinkedIn profiles for outreach
                </p>
                <Button size="sm" variant="outline" asChild>
                  <NavLink to="/leads">Import Now</NavLink>
                </Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <MessageSquare className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-medium mb-2">View Messages</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor conversations and engagement
                </p>
                <Button size="sm" variant="outline" asChild>
                  <NavLink to="/messages">View All</NavLink>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;