import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";

interface SolSliderProps {
  selectedSol: string;
  onSolChange: (sol: string) => void;
}

const SolSlider = ({ selectedSol, onSolChange }: SolSliderProps) => {
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
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-lg">
      <div className="container mx-auto px-3 py-2 md:px-4 md:py-3">
        {/* Layout mobile : 2 lignes */}
        <div className="md:hidden space-y-2">
          {/* Ligne 1: Info Sol + Contrôles principaux */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary animate-glow" />
              <div className="text-center">
                <div className="text-sm font-bold text-primary font-mono">
                  Sol {solValue}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getEarthDateFromSol(solValue)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                onClick={() => onSolChange(Math.max(0, solValue - 10).toString())}
                variant="outline"
                size="sm"
                disabled={solValue <= 10}
                className="h-7 px-2 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                -10
              </Button>
              
              <Button
                onClick={() => onSolChange(Math.max(0, solValue - 1).toString())}
                variant="outline"
                size="sm"
                disabled={solValue <= 0}
                className="h-7 w-7 p-0 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                -1
              </Button>
              
              <Button
                onClick={() => onSolChange(Math.min(4000, solValue + 1).toString())}
                variant="outline"
                size="sm"
                disabled={solValue >= 4000}
                className="h-7 w-7 p-0 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                +1
              </Button>
              
              <Button
                onClick={() => onSolChange(Math.min(4000, solValue + 10).toString())}
                variant="outline"
                size="sm" 
                disabled={solValue >= 3990}
                className="h-7 px-2 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                +10
              </Button>
            </div>
          </div>
          
          {/* Ligne 2: Slider + Jump rapides */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Slider
                value={[solValue]}
                onValueChange={(value) => onSolChange(value[0].toString())}
                max={4000}
                min={0}
                step={1}
                className="w-full cursor-pointer"
              />
            </div>
            
            <div className="flex gap-1">
              <Button
                onClick={() => onSolChange("0")}
                variant="ghost"
                size="sm"
                className="text-xs px-1 py-1 h-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                0
              </Button>
              <Button
                onClick={() => onSolChange("1000")}
                variant="ghost"
                size="sm"
                className="text-xs px-1 py-1 h-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                1K
              </Button>
            </div>
          </div>
        </div>

        {/* Layout desktop : 1 ligne */}
        <div className="hidden md:flex items-center gap-4">
          {/* Sol Info */}
          <div className="flex items-center gap-2 min-w-fit">
            <Clock className="w-4 h-4 text-primary animate-glow" />
            <div className="text-center">
              <div className="text-sm font-bold text-primary font-mono">
                Sol {solValue}
              </div>
              <div className="text-xs text-muted-foreground">
                {getEarthDateFromSol(solValue)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onSolChange(Math.max(0, solValue - 10).toString())}
              variant="outline"
              size="sm"
              disabled={solValue <= 10}
              className="h-7 px-2 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              -10
            </Button>
            
            <Button
              onClick={() => onSolChange(Math.max(0, solValue - 1).toString())}
              variant="outline"
              size="sm"
              disabled={solValue <= 0}
              className="h-7 w-7 p-0 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              -1
            </Button>
            
            <Button
              onClick={() => onSolChange(Math.min(4000, solValue + 1).toString())}
              variant="outline"
              size="sm"
              disabled={solValue >= 4000}
              className="h-7 w-7 p-0 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              +1
            </Button>
            
            <Button
              onClick={() => onSolChange(Math.min(4000, solValue + 10).toString())}
              variant="outline"
              size="sm" 
              disabled={solValue >= 3990}
              className="h-7 px-2 text-xs border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              +10
            </Button>
          </div>

          {/* Slider */}
          <div className="flex-1 mx-4">
            <Slider
              value={[solValue]}
              onValueChange={(value) => onSolChange(value[0].toString())}
              max={4000}
              min={0}
              step={1}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex gap-1">
            <Button
              onClick={() => onSolChange("0")}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              Sol 0
            </Button>
            <Button
              onClick={() => onSolChange("100")}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              Sol 100
            </Button>
            <Button
              onClick={() => onSolChange("1000")}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              Sol 1000
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolSlider;