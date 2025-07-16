import { create } from 'zustand';
import { getFolderHierarchy } from '../api/folders';

interface FolderBreadcrumb {
    id: string;
    name: string;
}

interface FolderHierarchyState {
    hierarchy: FolderBreadcrumb[];
    isLoading: boolean;
    error: string | null;
    fetchHierarchy: (folderId: string) => Promise<void>;
    clearHierarchy: () => void;
    setHierarchy: (hierarchy: FolderBreadcrumb[]) => void;
}

export const useFolderHierarchy = create<FolderHierarchyState>((set) => ({
    hierarchy: [],
    isLoading: false,
    error: null,
    fetchHierarchy: async (folderId: string) => {
        try {
            set({ isLoading: true, error: null }); // do not clear hierarchy here
            const response = await getFolderHierarchy(folderId);
            set({ hierarchy: response.data, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch folder hierarchy', isLoading: false });
        }
    },
    clearHierarchy: () => set({ hierarchy: [] }),
    setHierarchy: (hierarchy: FolderBreadcrumb[]) => set({ hierarchy }),
})); 