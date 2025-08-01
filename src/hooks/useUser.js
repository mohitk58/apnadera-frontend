import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
export const useUserProperties = () => {
  return useQuery({
    queryKey: ['user-properties'],
    queryFn: async () => {
      const response = await api.get('/users/properties')
      return response.data.properties
    },
    staleTime: 2 * 60 * 1000, 
  })
}
export const useUserFavorites = () => {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: async () => {
      const response = await api.get('/users/favorites')
      return { favorites: response.data }
    },
    staleTime: 2 * 60 * 1000, 
  })
}
export const useUserStats = (options = {}) => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await api.get('/users/stats')
      return response.data
    },
    staleTime: 5 * 60 * 1000, 
    enabled: options.enabled !== false, 
  })
}
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (profileData) => {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-properties'])
      queryClient.invalidateQueries(['user-favorites'])
      queryClient.invalidateQueries(['user-stats'])
    },
  })
} 