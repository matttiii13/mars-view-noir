import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar, Filter, Camera, Hash, Clock } from "lucide-react";

interface CuriosityFiltersProps {
  selectedCamera: string;
  selectedSol: string;
  onCameraChange: (camera: string) => void;
  onSolChange: (sol: string) => void;
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
  selectedSol,
  onCameraChange,
  onSolChange,
  onReset,
}: CuriosityFiltersProps) => {
  const solValue = selectedSol ? parseInt(selectedSol) : 1000;
  
  // Fonction pour calculer approximativement la date terrestre basée sur le sol
  const getEarthDateFromSol = (sol: number) => {
    // Curiosity a atterri le 5 août 2012 (Sol 0)
    const landingDate = new Date('2012-08-05');
    // Un sol martien = ~24h 37min, approximativement 1.027 jours terrestres
    const earthDays = Math.floor(sol * 1.027);
    const earthDate = new Date(landingDate);
    earthDate.setDate(earthDate.getDate() + earthDays);
    return earthDate.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigationCameras = curiosityCameras.filter(cam => cam.category === "navigation");
  const scienceCameras = curiosityCameras.filter(cam => cam.category === "science");
  const overviewCameras = curiosityCameras.filter(cam => cam.category === "overview");
  const landingCameras = curiosityCameras.filter(cam => cam.category === "landing");

  return (
    <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-mars">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          {/* Camera Selection - Compact for mobile, expanded for desktop */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary animate-glow" />
              <label className="text-sm font-medium text-muted-foreground">
                Sélection caméra
              </label>
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

          {/* Sol Timeline - Fixed position and enhanced controls */}
          <div className="lg:flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary animate-glow" />
                <label className="text-sm font-medium text-muted-foreground">
                  Sol martien
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
            
            <div className="space-y-4 p-3 lg:p-4 bg-secondary/20 rounded-lg border border-primary/20">
              {/* Sol Display and Fine Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => onSolChange(Math.max(0, solValue - 1).toString())}
                  variant="outline"
                  size="sm"
                  disabled={solValue <= 0}
                  className="h-8 w-8 p-0 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  -1
                </Button>
                
                <Button
                  onClick={() => onSolChange(Math.max(0, solValue - 10).toString())}
                  variant="outline" 
                  size="sm"
                  disabled={solValue <= 10}
                  className="h-8 px-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  -10
                </Button>
                
                <div className="text-center min-w-[120px]">
                  <div className="text-lg lg:text-xl font-bold text-primary font-mono">
                    Sol {solValue}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    {getEarthDateFromSol(solValue)}
                  </div>
                </div>
                
                <Button
                  onClick={() => onSolChange(Math.min(4000, solValue + 10).toString())}
                  variant="outline"
                  size="sm" 
                  disabled={solValue >= 3990}
                  className="h-8 px-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  +10
                </Button>
                
                <Button
                  onClick={() => onSolChange(Math.min(4000, solValue + 1).toString())}
                  variant="outline"
                  size="sm"
                  disabled={solValue >= 4000}
                  className="h-8 w-8 p-0 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  +1
                </Button>
              </div>
              
              {/* Slider with improved sensitivity */}
              <div className="space-y-2">
                <Slider
                  value={[solValue]}
                  onValueChange={(value) => onSolChange(value[0].toString())}
                  max={4000}
                  min={0}
                  step={1}
                  className="w-full cursor-pointer"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Sol 0</span>
                  <span className="text-center">Mission Curiosity</span>
                  <span>Sol 4000+</span>
                </div>
              </div>
              
              {/* Quick jump buttons */}
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  onClick={() => onSolChange("0")}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  Atterrissage
                </Button>
                <Button
                  onClick={() => onSolChange("100")}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  Sol 100
                </Button>
                <Button
                  onClick={() => onSolChange("1000")}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  Sol 1000
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuriosityFilters;