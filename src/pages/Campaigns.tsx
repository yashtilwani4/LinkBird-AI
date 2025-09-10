import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Target,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { format } from 'date-fns';
import { useUIStore } from '@/store/useUIStore';
import { AddCampaignDialog } from '@/components/campaigns/AddCampaignDialog';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  paused: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: keyof typeof statusColors;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  lead_count: number;
  converted_count: number;
}

const Campaigns = () => {
  const { campaignFilters, setCampaignFilters } = useUIStore();
  const [addCampaignDialogOpen, setAddCampaignDialogOpen] = useState(false);

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns', campaignFilters],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          leads!campaigns_lead_count_fkey:campaign_id (
            id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (campaignFilters.search) {
        query = query.ilike('name', `%${campaignFilters.search}%`);
      }
      
      if (campaignFilters.status) {
        query = query.eq('status', campaignFilters.status);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Transform data to include lead statistics
      return data.map((campaign: any) => ({
        ...campaign,
        lead_count: campaign.leads?.length || 0,
        converted_count: campaign.leads?.filter((lead: any) => lead.status === 'converted').length || 0,
      })) as Campaign[];
    },
  });

  // Calculate summary statistics
  const stats = campaigns ? {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.lead_count, 0),
    avgConversionRate: campaigns.length > 0 
      ? Math.round(campaigns.reduce((sum, c) => {
          const rate = c.lead_count > 0 ? (c.converted_count / c.lead_count) * 100 : 0;
          return sum + rate;
        }, 0) / campaigns.length)
      : 0,
  } : null;

  const getProgressPercentage = (campaign: Campaign) => {
    if (campaign.lead_count === 0) return 0;
    return Math.round((campaign.converted_count / campaign.lead_count) * 100);
  };

  const LoadingRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-2 w-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  );

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

  return (
    <AppLayout 
      title="Campaign Management" 
      breadcrumbs={[{ label: 'Campaigns' }]}
    >
      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Campaigns"
            value={stats?.totalCampaigns ?? 0}
            description="All created campaigns"
            icon={Target}
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
            description="Across all campaigns"
            icon={Users}
            isLoading={isLoading}
          />
          <StatCard
            title="Avg Conversion"
            value={`${stats?.avgConversionRate ?? 0}%`}
            description="Average success rate"
            icon={DollarSign}
            isLoading={isLoading}
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={campaignFilters.search}
                onChange={(e) => setCampaignFilters({ search: e.target.value })}
                className="pl-10 w-64"
              />
            </div>
            
            <Select
              value={campaignFilters.status || 'all'}
              onValueChange={(value) => setCampaignFilters({ status: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setAddCampaignDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Campaigns Table */}
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Leads</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Error loading campaigns. Please try again.
                  </TableCell>
                </TableRow>
              ) : campaigns?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No campaigns found. Try adjusting your filters or create your first campaign.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns?.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        {campaign.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {campaign.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={statusColors[campaign.status]}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.lead_count}</TableCell>
                    <TableCell>{campaign.converted_count}</TableCell>
                    <TableCell>{getProgressPercentage(campaign)}%</TableCell>
                    <TableCell className="w-32">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={getProgressPercentage(campaign)} 
                          className="h-2 flex-1" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {getProgressPercentage(campaign)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(campaign.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            {campaign.status === 'active' ? 'Pause' : 'Resume'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddCampaignDialog 
        open={addCampaignDialogOpen} 
        onOpenChange={setAddCampaignDialogOpen} 
      />
    </AppLayout>
  );
};

export default Campaigns;