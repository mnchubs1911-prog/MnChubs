import { create } from 'zustand';
import api from '../lib/api.js';

export const useResourceStore = create((set, get) => ({
  resources: [],
  totalPages: 1,
  currentPage: 1,
  filters: {
    branch: '',
    semester: '',
    resourceType: '',
    sort: '',
    search: '',
  },
  isLoading: false,

  fetchResources: async (page = 1) => {
    set({ isLoading: true });
    const { branch, semester, resourceType, sort, search } = get().filters;
    
    try {
      const params = {
        page,
        limit: 10,
        ...(branch && { branch }),
        ...(semester && { semester }),
        ...(resourceType && { resourceType }),
        ...(sort && { sort }),
        ...(search && { search }),
      };

      const response = await api.get('/resources', { params });
      set({
        resources: response.data.data,
        totalPages: response.data.pagination.pages,
        currentPage: response.data.pagination.page,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchResources(1);
  },

  clearFilters: () => {
    set({
      filters: {
        branch: '',
        semester: '',
        resourceType: '',
        sort: '',
        search: '',
      },
    });
    get().fetchResources(1);
  },
}));
