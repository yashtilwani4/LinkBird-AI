import { useState } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { LeadDetailSheet } from '@/components/leads/LeadDetailSheet';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 50;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  responded: 'bg-green-100 text-green-800 hover:bg-green-100',
  converted: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  status: keyof typeof statusColors;
  last_contact_date: string | null;
  created_at: string;
  campaigns: {
    name: string;
  } | null;
}

const Leads = () => {
  const { leadFilters, setLeadFilters, setSelectedLead, setLeadSheetOpen } = useUIStore();
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);

  // Fetch campaigns for filter dropdown
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns-for-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Infinite query for leads
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['leads', leadFilters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('leads')
        .select(`
          id,
          first_name,
          last_name,
          email,
          company,
          status,
          last_contact_date,
          created_at,
          campaigns:campaign_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .range((pageParam as number) * ITEMS_PER_PAGE, ((pageParam as number) + 1) * ITEMS_PER_PAGE - 1);

      // Apply filters
      if (leadFilters.search) {
        query = query.or(`first_name.ilike.%${leadFilters.search}%,last_name.ilike.%${leadFilters.search}%,email.ilike.%${leadFilters.search}%,company.ilike.%${leadFilters.search}%`);
      }
      
      if (leadFilters.status) {
        query = query.eq('status', leadFilters.status);
      }
      
      if (leadFilters.campaign) {
        query = query.eq('campaign_id', leadFilters.campaign);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Lead[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if ((lastPage as Lead[]).length < ITEMS_PER_PAGE) return undefined;
      return pages.length;
    },
  });

  const leads = data?.pages.flat() || [];

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId);
    setLeadSheetOpen(true);
  };

  const LoadingRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    </TableRow>
  );

  return (
    <AppLayout 
      title="Leads Management" 
      breadcrumbs={[{ label: 'Leads' }]}
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={leadFilters.search}
                onChange={(e) => setLeadFilters({ search: e.target.value })}
                className="pl-10 w-64"
              />
            </div>
            
            <Select
              value={leadFilters.status || 'all'}
              onValueChange={(value) => setLeadFilters({ status: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={leadFilters.campaign || 'all'}
              onValueChange={(value) => setLeadFilters({ campaign: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campaigns</SelectItem>
                {campaigns?.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setAddLeadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>

        {/* Leads Table */}
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => <LoadingRow key={i} />)
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Error loading leads. Please try again.
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No leads found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleLeadClick(lead.id)}
                    >
                      <TableCell className="font-medium">
                        {lead.first_name} {lead.last_name}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.company || '-'}</TableCell>
                      <TableCell>{lead.campaigns?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={statusColors[lead.status]}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.last_contact_date 
                          ? format(new Date(lead.last_contact_date), 'MMM dd, yyyy')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {isFetchingNextPage && (
                    Array.from({ length: 5 }).map((_, i) => <LoadingRow key={`loading-${i}`} />)
                  )}
                </>
              )}
            </TableBody>
          </Table>

          {/* Load More Button */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center p-4">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load More Leads
              </Button>
            </div>
          )}
        </div>
      </div>

      <LeadDetailSheet />
      <AddLeadDialog 
        open={addLeadDialogOpen} 
        onOpenChange={setAddLeadDialogOpen} 
      />
    </AppLayout>
  );
};

export default Leads;