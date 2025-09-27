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

          {/* Sol Timeline - Vertical on mobile, horizontal on desktop */}
          <div className="lg:flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary animate-glow" />
              <label className="text-sm font-medium text-muted-foreground">
                Sol martien
              </label>
            </div>
            
            <div className="space-y-3 p-3 lg:p-4 bg-secondary/20 rounded-lg border border-primary/20">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                <span className="text-xs text-muted-foreground order-1 lg:order-1">Sol 0</span>
                <div className="text-center order-2 lg:order-2">
                  <div className="text-lg lg:text-xl font-bold text-primary font-mono">
                    Sol {solValue}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    {getEarthDateFromSol(solValue)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground order-3 lg:order-3">Sol 4000+</span>
              </div>
              
              <Slider
                value={[solValue]}
                onValueChange={(value) => onSolChange(value[0].toString())}
                max={4000}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="hidden lg:inline">5 août 2012</span>
                <span className="lg:hidden">Début</span>
                <span className="text-center">Mission Curiosity</span>
                <span>Présent</span>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="border-border hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuriosityFilters;