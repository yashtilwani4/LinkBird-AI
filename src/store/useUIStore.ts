import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  selectedLead: string | null;
  leadSheetOpen: boolean;
  campaignFilters: {
    status: string | null;
    search: string;
  };
  leadFilters: {
    status: string | null;
    search: string;
    campaign: string | null;
  };
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedLead: (leadId: string | null) => void;
  setLeadSheetOpen: (open: boolean) => void;
  setCampaignFilters: (filters: Partial<UIState['campaignFilters']>) => void;
  setLeadFilters: (filters: Partial<UIState['leadFilters']>) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  selectedLead: null,
  leadSheetOpen: false,
  campaignFilters: {
    status: null,
    search: '',
  },
  leadFilters: {
    status: null,
    search: '',
    campaign: null,
  },
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedLead: (leadId) => set({ selectedLead: leadId }),
  setLeadSheetOpen: (open) => set({ leadSheetOpen: open }),
  setCampaignFilters: (filters) => 
    set({ campaignFilters: { ...get().campaignFilters, ...filters } }),
  setLeadFilters: (filters) => 
    set({ leadFilters: { ...get().leadFilters, ...filters } }),
}));