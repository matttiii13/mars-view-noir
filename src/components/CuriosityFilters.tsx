import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Camera, Hash } from "lucide-react";

interface CuriosityFiltersProps {
  selectedCamera: string;
  selectedDate: string;
  selectedSol: string;
  onCameraChange: (camera: string) => void;
  onDateChange: (date: string) => void;
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
  selectedDate,
  selectedSol,
  onCameraChange,
  onDateChange,
  onSolChange,
  onReset,
}: CuriosityFiltersProps) => {
  return (
    <div className="bg-card/70 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4 shadow-dust">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary animate-glow" />
        <h2 className="text-lg font-semibold text-foreground">Filtres Curiosity</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent ml-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Terrestre
          </label>
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-secondary/50 border-border hover:border-primary/50 transition-colors pl-10"
              placeholder="2023-06-15"
              max="2024-12-31"
              min="2012-08-06"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Défaut: 15 juin 2023</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Sol martien
          </label>
          <div className="relative">
            <Input
              type="number"
              value={selectedSol}
              onChange={(e) => onSolChange(e.target.value)}
              className="bg-secondary/50 border-border hover:border-primary/50 transition-colors pl-10"
              placeholder="1000"
              min="0"
              max="4000"
            />
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Jour martien (0-4000+)
          </p>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="border-border hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300"
        >
          Réinitialiser
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground bg-secondary/30 rounded px-3 py-1 inline-block">
          💡 Utilisez soit la date terrestre, soit le sol martien (pas les deux)
        </p>
      </div>
    </div>
  );
};

export default CuriosityFilters;