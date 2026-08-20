import React from 'react';
import { Island, ChildProgress, PageRoute } from '../types';
import { FlightRouteMap } from '../components/illustrations/FlightRouteMap';

interface MapPageProps {
  islands: Island[];
  progress: ChildProgress;
  onNavigate: (route: PageRoute) => void;
  onSelectIsland: (island: Island) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  islands,
  progress,
  onNavigate: _onNavigate,
  onSelectIsland,
}) => {
  return (
    <div className="space-y-4 pb-16">
      {/* Full-Bleed Interactive Archipelago Flight Route Map */}
      <FlightRouteMap
        islands={islands}
        progress={progress}
        onSelectIsland={onSelectIsland}
        onStartFlight={onSelectIsland}
      />
    </div>
  );
};
