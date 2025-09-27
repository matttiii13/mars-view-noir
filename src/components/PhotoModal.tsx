import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { RoverPhoto } from "@/types/nasa";

interface PhotoModalProps {
  photo: RoverPhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentIndex?: number;
  totalPhotos?: number;
}

const PhotoModal = ({ 
  photo, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false,
  currentIndex = 1,
  totalPhotos = 1
}: PhotoModalProps) => {
  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.img_src;
    link.download = `mars-rover-${photo.rover.name}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenOriginal = () => {
    window.open(photo.img_src, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center justify-between">
            <span>Photo Mars #{photo.id}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono">
                {currentIndex} / {totalPhotos}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={!hasNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative group">
            <img
              src={photo.img_src}
              alt={`Mars photo by ${photo.rover.name} rover`}
              className="w-full max-h-[60vh] object-contain rounded-lg shadow-deep cursor-pointer"
              onClick={onNext}
            />
            
            {/* Navigation overlay */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 cursor-pointer flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity"
                onClick={onPrevious}
              >
                {hasPrevious && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div 
                className="w-1/2 cursor-pointer flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity"
                onClick={onNext}
              >
                {hasNext && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-secondary/80 backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenOriginal}
                className="border-border bg-card/80 backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Original
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Rover</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nom:</span>
                    <Badge variant="secondary" className="font-mono">
                      {photo.rover.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge 
                      variant={photo.rover.status === 'active' ? 'default' : 'outline'}
                      className={photo.rover.status === 'active' ? 'bg-primary' : ''}
                    >
                      {photo.rover.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Atterrissage:</span>
                    <span className="font-mono text-sm">{photo.rover.landing_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Photos totales:</span>
                    <span className="font-mono text-sm">{photo.rover.total_photos.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Détails de la photo</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Caméra:</span>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      {photo.camera.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Date (Terre):</span>
                    <span className="font-mono text-sm">{photo.earth_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Sol:</span>
                    <span className="font-mono text-sm">{photo.sol}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Nom complet de la caméra:</p>
                <p className="text-sm font-medium">{photo.camera.full_name}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;