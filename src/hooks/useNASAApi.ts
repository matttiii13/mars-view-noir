import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RoverPhoto, NASAApiResponse } from '@/types/nasa';

const NASA_API_KEY = 'ND82eSeT3GHG9KAXe5xLI6JDPH4smLWbfKLIMwZy';
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

interface UseRoverPhotosParams {
  rover: string;
  camera?: string;
  earthDate?: string;
  page?: number;
}

export const useRoverPhotos = ({ rover, camera, earthDate, page = 1 }: UseRoverPhotosParams) => {
  const buildUrl = () => {
    // Use a default date if none is provided to ensure we get photos
    // Using a date that's more likely to have photos for most rovers
    const defaultDate = '2023-06-15'; // Mid-2023 date with activity
    const dateToUse = earthDate || defaultDate;
    
    const targetRover = rover === 'all' ? 'curiosity' : rover;
    
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      page: page.toString(),
      earth_date: dateToUse,
    });
    
    if (camera && camera !== 'all') {
      params.append('camera', camera);
    }
    
    return `${BASE_URL}/rovers/${targetRover}/photos?${params}`;
  };

  return useQuery<NASAApiResponse>({
    queryKey: ['rover-photos', rover, camera, earthDate, page],
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
    enabled: !!rover,
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