import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const response = await api.get(`/properties?${params.toString()}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, 
  })
}
export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}
export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (propertyData) => {
      const response = await api.post('/properties', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['properties'])
      queryClient.invalidateQueries(['user-properties'])
    },
  })
}
export const useUpdateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const isFormData = data instanceof FormData
      const response = await api.put(`/properties/${id}`, data, {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['properties'])
      queryClient.invalidateQueries(['property', data._id])
    },
  })
}
export const useDeleteProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/properties/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['properties'])
    },
  })
}
export const useToggleFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/properties/${id}/favorite`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['properties'])
      queryClient.invalidateQueries(['property', data._id])
      queryClient.invalidateQueries(['user-favorites'])
    },
  })
}
export const useSearchProperties = (searchQuery) => {
  return useQuery({
    queryKey: ['properties', 'search', searchQuery],
    queryFn: async () => {
      const response = await api.get(`/properties/search?q=${encodeURIComponent(searchQuery)}`)
      return response.data
    },
    enabled: !!searchQuery,
    staleTime: 2 * 60 * 1000, 
  })
} 