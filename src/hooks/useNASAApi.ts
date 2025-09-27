import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RoverPhoto, NASAApiResponse } from '@/types/nasa';

const NASA_API_KEY = 'DEMO_KEY'; // Using demo key for public access
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

interface UseRoverPhotosParams {
  rover: string;
  camera?: string;
  earthDate?: string;
  page?: number;
}

export const useRoverPhotos = ({ rover, camera, earthDate, page = 1 }: UseRoverPhotosParams) => {
  const buildUrl = () => {
    if (rover === 'all') {
      // For "all rovers", we'll fetch from Curiosity by default
      // In a real app, you might want to fetch from multiple rovers and combine
      const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        page: page.toString(),
      });
      
      if (camera && camera !== 'all') params.append('camera', camera);
      if (earthDate) params.append('earth_date', earthDate);
      
      return `${BASE_URL}/rovers/curiosity/photos?${params}`;
    }
    
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
      page: page.toString(),
    });
    
    if (camera && camera !== 'all') params.append('camera', camera);
    if (earthDate) params.append('earth_date', earthDate);
    
    return `${BASE_URL}/rovers/${rover}/photos${earthDate ? '' : '/latest'}?${params}`;
  };

  return useQuery<NASAApiResponse>({
    queryKey: ['rover-photos', rover, camera, earthDate, page],
    queryFn: async () => {
      const response = await fetch(buildUrl());
      if (!response.ok) {
        throw new Error('Failed to fetch rover photos');
      }
      return response.json();
    },
    enabled: !!rover,
    staleTime: 5 * 60 * 1000, // 5 minutes
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