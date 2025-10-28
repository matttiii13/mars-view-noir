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
    // Use a recent sol if neither earthDate nor sol is provided
    const defaultSol = '4600';
    const targetSol = sol && sol.trim() !== '' ? sol : defaultSol;
    
    const params = new URLSearchParams({
      sol: targetSol,
      page: page.toString(),
      api_key: NASA_API_KEY
    });
    
    if (camera && camera !== 'all') {
      params.set('camera', camera.toLowerCase());
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
      const data = await response.json();
      
      // The NASA public API returns data in the format { photos: [...] }
      return {
        photos: data.photos.map((photo: any) => ({
          id: photo.id,
          img_src: photo.img_src,
          earth_date: photo.earth_date,
          sol: photo.sol,
          camera: {
            id: photo.camera.id,
            name: photo.camera.name,
            rover_id: photo.camera.rover_id,
            full_name: photo.camera.full_name
          },
          rover: {
            id: photo.rover.id,
            name: photo.rover.name,
            landing_date: photo.rover.landing_date,
            launch_date: photo.rover.launch_date,
            status: photo.rover.status,
            max_sol: photo.rover.max_sol || 0,
            max_date: photo.rover.max_date || '',
            total_photos: photo.rover.total_photos || 0
          }
        }))
      };
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
      // For now, return a mock manifest since the new API doesn't have a direct manifest endpoint
      // This could be enhanced to fetch actual rover stats from the API
      return {
        photo_manifest: {
          name: 'Curiosity',
          landing_date: '2012-08-05',
          launch_date: '2011-11-26',
          status: 'active',
          max_sol: 4687,
          max_date: '2025-10-12',
          total_photos: 400000,
          photos: []
        }
      };
    },
    enabled: !!rover && rover !== 'all',
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};