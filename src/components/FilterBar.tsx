import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Search } from "lucide-react";

interface FilterBarProps {
  selectedRover: string;
  selectedCamera: string;
  selectedDate: string;
  onRoverChange: (rover: string) => void;
  onCameraChange: (camera: string) => void;
  onDateChange: (date: string) => void;
  onReset: () => void;
}

const rovers = [
  { value: "all", label: "Tous les Rovers" },
  { value: "curiosity", label: "Curiosity" },
  { value: "opportunity", label: "Opportunity" },
  { value: "spirit", label: "Spirit" },
  { value: "perseverance", label: "Perseverance" },
];

const cameras = [
  { value: "all", label: "Toutes les caméras" },
  { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
  { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
  { value: "MAST", label: "Mast Camera" },
  { value: "CHEMCAM", label: "Chemistry and Camera Complex" },
  { value: "MAHLI", label: "Mars Hand Lens Imager" },
  { value: "MARDI", label: "Mars Descent Imager" },
  { value: "NAVCAM", label: "Navigation Camera" },
  { value: "PANCAM", label: "Panoramic Camera" },
  { value: "MINITES", label: "Miniature Thermal Emission Spectrometer" },
];

const FilterBar = ({
  selectedRover,
  selectedCamera,
  selectedDate,
  onRoverChange,
  onCameraChange,
  onDateChange,
  onReset,
}: FilterBarProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Rover</label>
          <Select value={selectedRover} onValueChange={onRoverChange}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {rovers.map((rover) => (
                <SelectItem
                  key={rover.value}
                  value={rover.value}
                  className="focus:bg-secondary/50"
                >
                  {rover.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Caméra</label>
          <Select value={selectedCamera} onValueChange={onCameraChange}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {cameras.map((camera) => (
                <SelectItem
                  key={camera.value}
                  value={camera.value}
                  className="focus:bg-secondary/50"
                >
                  {camera.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date (YYYY-MM-DD)</label>
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-secondary/50 border-border pl-10"
              placeholder="2023-06-15"
              max="2024-12-31"
              min="2004-01-04"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Défaut: 15 juin 2023</p>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="border-border hover:bg-secondary/50"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;