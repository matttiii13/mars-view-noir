import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CuriosityFiltersProps {
  selectedCamera: string;
  onCameraChange: (camera: string) => void;
  onReset: () => void;
}

const curiosityCameras = [
  { 
    value: "all", 
    label: "📷 Toutes les caméras", 
    description: "Vue d'ensemble de toutes les caméras",
    category: "overview"
  },
  { 
    value: "FHAZ", 
    label: "🔍 FHAZ", 
    description: "Front Hazard Avoidance",
    category: "navigation"
  },
  { 
    value: "RHAZ", 
    label: "🔍 RHAZ", 
    description: "Rear Hazard Avoidance",
    category: "navigation"
  },
  { 
    value: "NAVCAM", 
    label: "🧭 NAVCAM", 
    description: "Navigation Camera",
    category: "navigation"
  },
  { 
    value: "MAST", 
    label: "🎯 MAST", 
    description: "Mast Camera",
    category: "science"
  },
  { 
    value: "CHEMCAM", 
    label: "🔬 CHEMCAM", 
    description: "Chemistry & Camera Complex",
    category: "science"
  },
  { 
    value: "MAHLI", 
    label: "🔬 MAHLI", 
    description: "Mars Hand Lens Imager",
    category: "science"
  },
  { 
    value: "MARDI", 
    label: "🪂 MARDI", 
    description: "Mars Descent Imager",
    category: "landing"
  },
];

const CuriosityFilters = ({
  selectedCamera,
  onCameraChange,
  onReset,
}: CuriosityFiltersProps) => {
  const navigationCameras = curiosityCameras.filter(cam => cam.category === "navigation");
  const scienceCameras = curiosityCameras.filter(cam => cam.category === "science");
  const overviewCameras = curiosityCameras.filter(cam => cam.category === "overview");
  const landingCameras = curiosityCameras.filter(cam => cam.category === "landing");

  return (
    <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-mars">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary animate-glow" />
            <label className="text-sm font-medium text-muted-foreground">
              Sélection caméra
            </label>
          </div>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300"
          >
            Reset
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Overview */}
          {overviewCameras.map((camera) => (
            <button
              key={camera.value}
              onClick={() => onCameraChange(camera.value)}
              className={`p-2 lg:p-3 rounded-lg border transition-all duration-300 text-left ${
                selectedCamera === camera.value
                  ? 'bg-primary/20 border-primary text-primary-foreground shadow-mars'
                  : 'bg-secondary/30 border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <div className="text-xs lg:text-sm font-medium truncate">
                {camera.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden lg:block">
                {camera.description}
              </div>
            </button>
          ))}
          
          {/* Navigation Cameras */}
          {navigationCameras.map((camera) => (
            <button
              key={camera.value}
              onClick={() => onCameraChange(camera.value)}
              className={`p-2 lg:p-3 rounded-lg border transition-all duration-300 text-left ${
                selectedCamera === camera.value
                  ? 'bg-primary/20 border-primary text-primary-foreground shadow-mars'
                  : 'bg-secondary/30 border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <div className="text-xs lg:text-sm font-medium truncate">
                {camera.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden lg:block">
                {camera.description}
              </div>
            </button>
          ))}
          
          {/* Science Cameras */}
          {scienceCameras.map((camera) => (
            <button
              key={camera.value}
              onClick={() => onCameraChange(camera.value)}
              className={`p-2 lg:p-3 rounded-lg border transition-all duration-300 text-left ${
                selectedCamera === camera.value
                  ? 'bg-primary/20 border-primary text-primary-foreground shadow-mars'
                  : 'bg-secondary/30 border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <div className="text-xs lg:text-sm font-medium truncate">
                {camera.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden lg:block">
                {camera.description}
              </div>
            </button>
          ))}
          
          {/* Landing Camera */}
          {landingCameras.map((camera) => (
            <button
              key={camera.value}
              onClick={() => onCameraChange(camera.value)}
              className={`p-2 lg:p-3 rounded-lg border transition-all duration-300 text-left ${
                selectedCamera === camera.value
                  ? 'bg-primary/20 border-primary text-primary-foreground shadow-mars'
                  : 'bg-secondary/30 border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <div className="text-xs lg:text-sm font-medium truncate">
                {camera.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden lg:block">
                {camera.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuriosityFilters;