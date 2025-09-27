export interface RoverPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
  };
}

export interface NASAApiResponse {
  photos: RoverPhoto[];
}

export interface RoverInfo {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: Array<{
    name: string;
    full_name: string;
  }>;
}