import { useState, useEffect } from 'react';
import { useCuriosityPhotos } from '@/hooks/useNASAApi';
import { RoverPhoto } from '@/types/nasa';
import StarField from '@/components/MarsStars';
import CuriosityFilters from '@/components/CuriosityFilters';
import SolSlider from '@/components/SolSlider';
import RoverCard from '@/components/RoverCard';
import PhotoModal from '@/components/PhotoModal';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Rocket } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedSol, setSelectedSol] = useState('4600');
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<RoverPhoto | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState<RoverPhoto[]>([]);

  const { data, isLoading, error, refetch } = useCuriosityPhotos({
    camera: selectedCamera,
    sol: selectedSol,
    page,
  });

  useEffect(() => {
    if (data?.photos) {
      if (page === 1) {
        setAllPhotos(data.photos);
      } else {
        setAllPhotos(prev => [...prev, ...data.photos]);
      }
    }
  }, [data, page]);

  const handleFilterChange = () => {
    setPage(1);
    setAllPhotos([]);
  };

  const handleCameraChange = (camera: string) => {
    setSelectedCamera(camera);
    handleFilterChange();
  };

  const handleSolChange = (sol: string) => {
    setSelectedSol(sol);
    handleFilterChange();
  };

  const handleReset = () => {
    setSelectedCamera('all');
    setSelectedSol('4600');
    handleFilterChange();
  };

  const handlePhotoClick = (photo: RoverPhoto, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < allPhotos.length - 1) {
      const nextIndex = selectedPhotoIndex + 1;
      setSelectedPhotoIndex(nextIndex);
      setSelectedPhoto(allPhotos[nextIndex]);
    }
  };

  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const prevIndex = selectedPhotoIndex - 1;
      setSelectedPhotoIndex(prevIndex);
      setSelectedPhoto(allPhotos[prevIndex]);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const hasMorePhotos = data?.photos && data.photos.length === 25; // NASA API returns 25 photos per page

  return (
    <div className="min-h-screen bg-gradient-mars relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/20 bg-card/10 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 animate-float">
                <Rocket className="w-8 h-8 text-primary animate-glow" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-mono glow-text">
                  Curiosity Mars Explorer
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                Découvrez Mars à travers les yeux du rover Curiosity de la NASA
              </p>
              <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border/50 max-w-3xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  🔴 Mission Curiosity active depuis 2012 • Plus de 400 000 photos capturées
                </p>
              </div>
              <div className="h-px w-32 bg-gradient-sunset mx-auto mt-4" />
            </div>
          </div>
        </header>

        {/* Sticky Filters */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/20 shadow-md">
          <div className="container mx-auto px-6 py-4">
            <CuriosityFilters
              selectedCamera={selectedCamera}
              onCameraChange={handleCameraChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8 pb-24 space-y-8">{/* pb-24 pour faire de la place au slider fixe */}
          {error && (
            <Alert className="bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors du chargement des photos. 
                <Button 
                  variant="link" 
                  className="h-auto p-0 ml-2 text-primary"
                  onClick={() => refetch()}
                >
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Chargement des photos Mars...</p>
              </div>
            </div>
          ) : (
            <>
              {allPhotos.length > 0 ? (
                <>
                  <div className="text-center">
                    <p className="text-muted-foreground font-mono">
                      {allPhotos.length} photo{allPhotos.length > 1 ? 's' : ''} trouvée{allPhotos.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allPhotos.map((photo, index) => (
                      <div
                        key={`${photo.id}-${index}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <RoverCard
                          photo={photo}
                          onClick={() => handlePhotoClick(photo, index)}
                        />
                      </div>
                    ))}
                  </div>

                  {hasMorePhotos && (
                    <div className="text-center py-8">
                      <Button
                        onClick={loadMore}
                        disabled={isLoading}
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:shadow-mars transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Chargement...
                          </>
                        ) : (
                          'Charger plus de photos'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                !isLoading && (
                  <div className="text-center py-20">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Aucune photo trouvée</h3>
                        <p className="text-muted-foreground">
                          Essayez de modifier vos filtres ou de sélectionner une autre date.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>

      <PhotoModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        hasNext={selectedPhotoIndex < allPhotos.length - 1}
        hasPrevious={selectedPhotoIndex > 0}
        currentIndex={selectedPhotoIndex + 1}
        totalPhotos={allPhotos.length}
      />

      <SolSlider
        selectedSol={selectedSol}
        onSolChange={handleSolChange}
      />
    </div>
  );
};

export default Index;