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
  { value: "all", label: "Toutes les caméras" },
  { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
  { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
  { value: "MAST", label: "Mast Camera" },
  { value: "CHEMCAM", label: "Chemistry and Camera Complex" },
  { value: "MAHLI", label: "Mars Hand Lens Imager" },
  { value: "MARDI", label: "Mars Descent Imager" },
  { value: "NAVCAM", label: "Navigation Camera" },
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

  return (
    <div className="bg-card/70 backdrop-blur-sm border border-border rounded-lg p-6 space-y-6 shadow-dust">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary animate-glow" />
        <h2 className="text-lg font-semibold text-foreground">Filtres Curiosity</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent ml-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Caméra
          </label>
          <Select value={selectedCamera} onValueChange={onCameraChange}>
            <SelectTrigger className="bg-secondary/50 border-border hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {curiosityCameras.map((camera) => (
                <SelectItem
                  key={camera.value}
                  value={camera.value}
                  className="focus:bg-secondary/50 hover:bg-secondary/30"
                >
                  {camera.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary animate-glow" />
            <label className="text-sm font-medium text-muted-foreground">
              Chronologie martienne
            </label>
          </div>
          
          <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sol 0</span>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">
                  Sol {solValue}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getEarthDateFromSol(solValue)}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Sol 4000+</span>
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
              <span>5 août 2012</span>
              <span>Atterrissage Curiosity</span>
              <span>Aujourd'hui</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-border hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300"
        >
          Réinitialiser
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground bg-secondary/30 rounded px-3 py-1 inline-block">
          🔴 Explorez la chronologie de la mission Curiosity sur Mars
        </p>
      </div>
    </div>
  );
};

export default CuriosityFilters;