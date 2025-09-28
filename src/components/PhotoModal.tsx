import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Download, ExternalLink, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { RoverPhoto } from "@/types/nasa";
import { useEffect, useState, useRef } from "react";

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
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!photo) return null;

  // Reset zoom and position when photo changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [photo.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (hasNext && onNext) onNext();
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case '=':
        case '+':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'f':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, onClose, isFullscreen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // If zoomed, don't navigate on click
    if (zoom > 1) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    
    if (isLeftHalf && hasPrevious && onPrevious) {
      onPrevious();
    } else if (!isLeftHalf && hasNext && onNext) {
      onNext();
    }
  };

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

  const imageStyle = {
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'max-w-none w-screen h-screen max-h-none p-0 bg-black border-none'
            : 'max-w-4xl bg-card/95 backdrop-blur-sm border-border'
        } transition-all duration-300`}
      >
        {!isFullscreen ? (
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
                    title="Précédent (←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNext}
                    className="h-8 w-8 p-0"
                    title="Suivant (→)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        ) : null}
        
        <div className={`${isFullscreen ? 'h-full' : 'space-y-6'}`}>
          <div 
            ref={containerRef}
            className={`relative group ${
              isFullscreen 
                ? 'h-full bg-black flex items-center justify-center' 
                : ''
            }`}
          >
            <img
              ref={imageRef}
              src={photo.img_src}
              alt={`Mars photo by ${photo.rover.name} rover`}
              className={`${
                isFullscreen 
                  ? 'max-h-full max-w-full' 
                  : 'w-full max-h-[60vh]'
              } object-contain rounded-lg shadow-deep select-none`}
              style={imageStyle}
              onClick={handleImageClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              draggable={false}
            />
            
            {/* Navigation indicators */}
            {zoom === 1 && (
              <div className="absolute inset-0 flex pointer-events-none">
                <div className={`w-1/2 flex items-center justify-start pl-4 ${
                  hasPrevious ? 'opacity-0 group-hover:opacity-70' : 'opacity-0'
                } transition-opacity`}>
                  {hasPrevious && (
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 pointer-events-auto cursor-pointer"
                         onClick={onPrevious}>
                      <ChevronLeft className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className={`w-1/2 flex items-center justify-end pr-4 ${
                  hasNext ? 'opacity-0 group-hover:opacity-70' : 'opacity-0'
                } transition-opacity`}>
                  {hasNext && (
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 pointer-events-auto cursor-pointer"
                         onClick={onNext}>
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Zoom controls */}
            <div className={`absolute ${
              isFullscreen ? 'top-4 left-4' : 'top-4 left-4'
            } flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="h-8 w-8 p-0 bg-secondary/80 backdrop-blur-sm"
                title="Zoom avant (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="h-8 w-8 p-0 bg-secondary/80 backdrop-blur-sm"
                title="Zoom arrière (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleResetZoom}
                disabled={zoom === 1 && position.x === 0 && position.y === 0}
                className="h-8 w-8 p-0 bg-secondary/80 backdrop-blur-sm"
                title="Réinitialiser (0)"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <div className={`absolute ${
              isFullscreen ? 'top-4 right-4' : 'top-4 right-4'
            } flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0 bg-secondary/80 backdrop-blur-sm"
                title={isFullscreen ? "Quitter plein écran (F)" : "Plein écran (F)"}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-secondary/80 backdrop-blur-sm"
                title="Télécharger"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenOriginal}
                className="border-border bg-card/80 backdrop-blur-sm"
                title="Ouvrir l'original"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Original
              </Button>
            </div>

            {/* Zoom indicator */}
            {zoom !== 1 && (
              <div className={`absolute ${
                isFullscreen ? 'bottom-4 left-4' : 'bottom-4 left-4'
              } bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-mono`}>
                {Math.round(zoom * 100)}%
              </div>
            )}

            {/* Navigation counter for fullscreen */}
            {isFullscreen && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-mono">
                {currentIndex} / {totalPhotos}
              </div>
            )}
          </div>

          {!isFullscreen && (
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

                {/* Keyboard shortcuts help */}
                <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Raccourcis clavier:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <div>← → : Navigation</div>
                    <div>+ - : Zoom</div>
                    <div>0 : Réinitialiser</div>
                    <div>F : Plein écran</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;