import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUIStore } from '@/store/useUIStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  User,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  responded: 'bg-green-100 text-green-800 hover:bg-green-100',
  converted: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

export function LeadDetailSheet() {
  const { selectedLead, leadSheetOpen, setLeadSheetOpen, setSelectedLead } = useUIStore();
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', selectedLead],
    queryFn: async () => {
      if (!selectedLead) return null;
      
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          campaigns:campaign_id (
            id,
            name,
            description,
            status
          )
        `)
        .eq('id', selectedLead)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedLead,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      if (!selectedLead) return;
      
      const updateData: any = { 
        status,
        last_contact_date: new Date().toISOString(),
      };
      
      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', selectedLead);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLead] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast({
        title: "Lead updated",
        description: "Lead status has been updated successfully.",
      });
      
      setNotes('');
      setNewStatus('');
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update lead status. Please try again.",
      });
    },
  });

  const handleClose = () => {
    setLeadSheetOpen(false);
    setSelectedLead(null);
    setNotes('');
    setNewStatus('');
  };

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    updateStatusMutation.mutate({ status: newStatus, notes });
  };

  const handleContactLead = () => {
    if (lead?.email) {
      window.open(`mailto:${lead.email}`, '_blank');
      // Update status to contacted if currently pending
      if (lead.status === 'pending') {
        updateStatusMutation.mutate({ status: 'contacted' });
      }
    }
  };

  if (!lead && !isLoading) return null;

  return (
    <Sheet open={leadSheetOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {lead?.first_name} {lead?.last_name}
              </SheetTitle>
              <SheetDescription>
                Lead details and interaction history
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* Status and Campaign */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge 
                    variant="secondary" 
                    className={statusColors[lead?.status as keyof typeof statusColors]}
                  >
                    {lead?.status?.charAt(0).toUpperCase() + lead?.status?.slice(1)}
                  </Badge>
                </div>
                
                {lead?.campaigns && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Campaign</span>
                    <span className="text-sm text-muted-foreground">
                      {lead.campaigns.name}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead?.email}</span>
                  </div>
                  
                  {lead?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lead.phone}</span>
                    </div>
                  )}
                  
                  {lead?.company && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lead.company}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Added {format(new Date(lead?.created_at || ''), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  {lead?.last_contact_date && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Last contact {format(new Date(lead.last_contact_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Notes */}
              {lead?.notes && (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {lead.notes}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <h4 className="font-medium">Actions</h4>
                
                <Button 
                  onClick={handleContactLead}
                  className="w-full"
                  variant="default"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Lead
                </Button>
                
                <div className="space-y-3">
                  <Label htmlFor="status-select">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes-textarea">Add Notes (Optional)</Label>
                  <Textarea
                    id="notes-textarea"
                    placeholder="Add interaction notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || updateStatusMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}