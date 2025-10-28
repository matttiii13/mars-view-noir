import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RoverPhoto, NASAApiResponse } from '@/types/nasa';

const NASA_API_KEY = 'ND82eSeT3GHG9KAXe5xLI6JDPH4smLWbfKLIMwZy';
const BASE_URL = 'https://mars.nasa.gov/api/v1';

interface UseRoverPhotosParams {
  camera?: string;
  earthDate?: string;
  sol?: string;
  page?: number;
}

export const useCuriosityPhotos = ({ camera, earthDate, sol, page = 1 }: UseRoverPhotosParams) => {
  const buildUrl = () => {
    // Use a recent sol if neither earthDate nor sol is provided
    const defaultSol = '4701';
    
    const params = new URLSearchParams({
      order: 'sol+desc,instrument_sort+asc,sample_type_sort+asc,+date_taken+desc',
      per_page: '50', // Get more results to filter client-side
      page: (page - 1).toString(), // API uses 0-based indexing
      mission: 'msl', // Mars Science Laboratory (Curiosity)
    });
    
    // Get a wider range and filter client-side since the API filtering is inconsistent
    const targetSol = sol && sol.trim() !== '' ? parseInt(sol) : parseInt(defaultSol);
    const solRange = 100; // Get a range around the target sol
    params.set('sol__gte', Math.max(0, targetSol - solRange).toString());
    params.set('sol__lte', (targetSol + solRange).toString());
    
    if (camera && camera !== 'all') {
      // Map camera names to instruments
      const cameraMapping: { [key: string]: string } = {
        'FHAZ': 'FHAZ',
        'RHAZ': 'RHAZ', 
        'MAST': 'MAST_LEFT,MAST_RIGHT',
        'CHEMCAM': 'CHEMCAM_RMI',
        'MAHLI': 'MAHLI',
        'MARDI': 'MARDI'
      };
      const instrument = cameraMapping[camera.toUpperCase()];
      if (instrument) {
        params.set('instrument', instrument);
      }
    }
    
    return `${BASE_URL}/raw_image_items/?${params}`;
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
      
      // Filter by exact sol client-side since API filtering is inconsistent
      const targetSol = sol && sol.trim() !== '' ? parseInt(sol) : parseInt(defaultSol);
      const filteredItems = data.items?.filter((item: any) => item.sol === targetSol) || [];
      
      // Take only the first 25 results for pagination
      const startIndex = (page - 1) * 25;
      const paginatedItems = filteredItems.slice(startIndex, startIndex + 25);
      
      // Transform the new API response to match the expected format
      return {
        photos: paginatedItems.map((item: any) => ({
          id: item.id,
          img_src: item.https_url || item.url,
          earth_date: item.date_taken?.split('T')[0] || '',
          sol: item.sol,
          camera: {
            id: 1,
            name: item.instrument || 'UNKNOWN',
            rover_id: 5,
            full_name: item.title || item.instrument || 'Unknown Camera'
          },
          rover: {
            id: 5,
            name: 'Curiosity',
            landing_date: '2012-08-05',
            launch_date: '2011-11-26',
            status: 'active',
            max_sol: item.sol || 1000,
            max_date: item.date_taken?.split('T')[0] || '2023-06-15',
            total_photos: 400000
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