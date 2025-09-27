import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoverPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
  };
}

interface RoverCardProps {
  photo: RoverPhoto;
  onClick: () => void;
}

const RoverCard = ({ photo, onClick }: RoverCardProps) => {
  return (
    <Card
      className="group bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-glow animate-slide-up"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={photo.img_src}
            alt={`Mars photo by ${photo.rover.name} rover using ${photo.camera.full_name}`}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm">
                  {photo.rover.name}
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {photo.camera.name}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {photo.earth_date}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoverCard;