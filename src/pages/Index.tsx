import { useState, useEffect } from 'react';
import { useRoverPhotos } from '@/hooks/useNASAApi';
import { RoverPhoto } from '@/types/nasa';
import StarField from '@/components/StarField';
import FilterBar from '@/components/FilterBar';
import RoverCard from '@/components/RoverCard';
import PhotoModal from '@/components/PhotoModal';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Rocket } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<RoverPhoto | null>(null);
  const [allPhotos, setAllPhotos] = useState<RoverPhoto[]>([]);

  const { data, isLoading, error, refetch } = useRoverPhotos({
    rover: selectedRover,
    camera: selectedCamera,
    earthDate: selectedDate,
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

  const handleRoverChange = (rover: string) => {
    setSelectedRover(rover);
    handleFilterChange();
  };

  const handleCameraChange = (camera: string) => {
    setSelectedCamera(camera);
    handleFilterChange();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    handleFilterChange();
  };

  const handleReset = () => {
    setSelectedRover('curiosity');
    setSelectedCamera('all');
    setSelectedDate('');
    handleFilterChange();
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const hasMorePhotos = data?.photos && data.photos.length === 25; // NASA API returns 25 photos per page

  return (
    <div className="min-h-screen bg-gradient-space relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/20 bg-card/10 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 animate-float">
                <Rocket className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-mono">
                  Mars Rover Explorer
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explorez les merveilles de Mars à travers les yeux des rovers de la NASA
              </p>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8 space-y-8">
          <FilterBar
            selectedRover={selectedRover}
            selectedCamera={selectedCamera}
            selectedDate={selectedDate}
            onRoverChange={handleRoverChange}
            onCameraChange={handleCameraChange}
            onDateChange={handleDateChange}
            onReset={handleReset}
          />

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
                          onClick={() => setSelectedPhoto(photo)}
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
                        className="border-primary/50 hover:bg-primary/10 hover:border-primary"
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
      />
    </div>
  );
};

export default Index;