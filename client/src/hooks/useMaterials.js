// client/src/hooks/useMaterials.js (fixed version)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';

// Helper function for safe translations
const safeTranslate = (t, key, fallback) => {
  try {
    if (t) {
      const translated = t(key);
      return translated === key ? fallback : translated;
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
};

// Hook to fetch all materials
export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await apiService.materials.getAll();
      
      // Transform data to match our React component's expected format
      const transformedData = response.data.data.map(item => ({
        id: item.id,
        packetNo: parseInt(item.packet_no),
        partName: item.part_name,
        length: parseInt(item.length),
        width: parseInt(item.width),
        height: parseInt(item.height),
        quantity: parseInt(item.quantity),
        supplier: item.supplier,
        updatedBy: item.updated_by,
        lastUpdated: item.last_updated
      }));
      
      return transformedData;
    },
    retry: 1,
  });
};

// Hook to create a new material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  return useMutation({
    mutationFn: (materialData) => apiService.materials.create(materialData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(safeTranslate(t, 'materialAdded', 'Material added successfully'));
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || safeTranslate(t, 'materialAddFailed', 'Failed to add material'));
    },
  });
};

// Hook to update an existing material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.materials.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(safeTranslate(t, 'materialUpdated', 'Material updated successfully'));
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || safeTranslate(t, 'materialUpdateFailed', 'Failed to update material'));
    },
  });
};

// Hook to delete a material
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  return useMutation({
    mutationFn: (id) => apiService.materials.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(safeTranslate(t, 'materialDeleted', 'Material deleted successfully'));
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || safeTranslate(t, 'materialDeleteFailed', 'Failed to delete material'));
    },
  });
};

// Hook to delete multiple materials
export const useDeleteBatchMaterials = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  return useMutation({
    mutationFn: (ids) => apiService.materials.deleteBatch(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(safeTranslate(t, 'materialsDeleted', 'Materials deleted successfully'));
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || safeTranslate(t, 'materialsDeleteFailed', 'Failed to delete materials'));
    },
  });
};