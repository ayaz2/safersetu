import React, { useState } from 'react';
import { TelanganaLanding } from './TelanganaLanding';
import { TelanganaTripBuilder } from './TelanganaTripBuilder';
import { TelanganaTravelPassView } from './TelanganaTravelPassView';
import { TelanganaTravelPassData } from '../../types/telangana';

interface TelanganaModuleProps {
  onBackToSafarSetu: () => void;
  onBookingAdded?: (booking: any) => void;
  initialSubView?: 'landing' | 'builder' | 'pass';
}

export const TelanganaModule: React.FC<TelanganaModuleProps> = ({
  onBackToSafarSetu,
  onBookingAdded,
  initialSubView = 'landing'
}) => {
  const [subView, setSubView] = useState<'landing' | 'builder' | 'pass'>(initialSubView);
  const [activePass, setActivePass] = useState<TelanganaTravelPassData | null>(null);
  const [builderInitialDestinations, setBuilderInitialDestinations] = useState<string[]>(['hyderabad', 'warangal']);
  const [builderInitialAttractions, setBuilderInitialAttractions] = useState<string[]>([
    'charminar', 'golconda-fort', 'chowmahalla-palace', 'ramappa-temple', 'thousand-pillar-temple', 'laknavaram-lake'
  ]);

  const handleStartCustomTrip = (destinationIds?: string[], attractionIds?: string[]) => {
    if (destinationIds && destinationIds.length > 0) {
      setBuilderInitialDestinations(destinationIds);
    }
    if (attractionIds && attractionIds.length > 0) {
      setBuilderInitialAttractions(attractionIds);
    }
    setSubView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePassGenerated = (pass: TelanganaTravelPassData) => {
    setActivePass(pass);
    setSubView('pass');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewExistingPass = (pass: TelanganaTravelPassData) => {
    setActivePass(pass);
    setSubView('pass');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="telangana-tourism-ecosystem" className="w-full">
      {subView === 'landing' && (
        <TelanganaLanding
          onStartCustomTrip={handleStartCustomTrip}
          onViewPass={handleViewExistingPass}
        />
      )}

      {subView === 'builder' && (
        <TelanganaTripBuilder
          onPassGenerated={handlePassGenerated}
          onCancel={() => {
            setSubView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          initialDestinationIds={builderInitialDestinations}
          initialAttractionIds={builderInitialAttractions}
        />
      )}

      {subView === 'pass' && activePass && (
        <TelanganaTravelPassView
          pass={activePass}
          onBackToBuilder={() => {
            setSubView('builder');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToLanding={() => {
            setSubView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPassUpdated={(updated) => setActivePass(updated)}
        />
      )}
    </div>
  );
};
