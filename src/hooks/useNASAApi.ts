import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RoverPhoto, NASAApiResponse } from '@/types/nasa';

const NASA_API_KEY = 'ND82eSeT3GHG9KAXe5xLI6JDPH4smLWbfKLIMwZy';
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

interface UseRoverPhotosParams {
  camera?: string;
  earthDate?: string;
  sol?: string;
  page?: number;
}

export const useCuriosityPhotos = ({ camera, earthDate, sol, page = 1 }: UseRoverPhotosParams) => {
  const buildUrl = () => {
    // Use a default date if neither earthDate nor sol is provided
    const defaultDate = '2023-06-15';
    
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      page: page.toString(),
    });
    
    // Prioritize sol over earth_date if both are provided
    if (sol && sol.trim() !== '') {
      params.append('sol', sol);
    } else if (earthDate && earthDate.trim() !== '') {
      params.append('earth_date', earthDate);
    } else {
      params.append('earth_date', defaultDate);
    }
    
    if (camera && camera !== 'all') {
      params.append('camera', camera);
    }
    
    return `${BASE_URL}/rovers/curiosity/photos?${params}`;
  };

  return useQuery<NASAApiResponse>({
    queryKey: ['curiosity-photos', camera, earthDate, sol, page],
    queryFn: async () => {
      const response = await fetch(buildUrl());
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit dépassé. Veuillez réessayer dans quelques minutes.');
        }
        throw new Error(`Erreur API: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error.message.includes('Rate limit')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 2000, // 2 seconds between retries
  });
};

export const useRoverManifest = (rover: string) => {
  return useQuery({
    queryKey: ['rover-manifest', rover],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/manifests/${rover}?api_key=${NASA_API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rover manifest');
      }
      return response.json();
    },
    enabled: !!rover && rover !== 'all',
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};