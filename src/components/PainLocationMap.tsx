import React from 'react';
import { PainLocation } from '../types';

interface PainLocationMapProps {
  selectedLocations: PainLocation[];
  magnitudes: Partial<Record<PainLocation, number>>;
  labels: Record<PainLocation, string>;
  frontLabel: string;
  backLabel: string;
  mapNote: string;
  onSelectLocation: (location: PainLocation) => void;
}

type MapSpot = { location: PainLocation; x: number; y: number };

// Coordinates are pixels over the uploaded 188 × 443/448 body illustrations.
const frontSpots: MapSpot[] = [
  { location: 'chest_ribs', x: 94, y: 130 },
  { location: 'lower_abdomen', x: 82, y: 190 },
  { location: 'bladder', x: 106, y: 217 },
  { location: 'pelvis', x: 88, y: 245 },
  { location: 'thighs', x: 94, y: 291 },
  { location: 'legs', x: 94, y: 360 },
];

const backSpots: MapSpot[] = [
  { location: 'lower_back', x: 94, y: 200 },
  { location: 'rectum', x: 94, y: 250 },
];

const BodyFigure: React.FC<{
  side: 'front' | 'back';
  label: string;
  image: string;
  spots: MapSpot[];
  selectedLocations: PainLocation[];
  magnitudes: Partial<Record<PainLocation, number>>;
  labels: Record<PainLocation, string>;
  mapNote: string;
  onSelectLocation: (location: PainLocation) => void;
}> = ({ side, label, image, spots, selectedLocations, magnitudes, labels, mapNote, onSelectLocation }) => (
  <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl border border-stone-200 bg-white px-2 pt-2">
    <span className="text-xs font-semibold text-slate-700">{label}</span>
    <div className={`pain-body-map pain-body-map-${side}`} role="group" aria-label={`${label}: ${mapNote}`}>
      <img className="pain-body-image" src={image} alt="" draggable={false} />
      <svg className="pain-body-hotspots" viewBox="0 0 188 443" preserveAspectRatio="none" aria-hidden="false">
        {spots.map(({ location, x, y }) => {
          const selected = selectedLocations.includes(location);
          const magnitude = Math.max(0, Math.min(10, magnitudes[location] ?? 0));
          const heatRadius = 28 + magnitude * 2.2;
          const heatOpacity = selected ? 0.25 + magnitude * 0.065 : 0;
          const gradientId = `${side}-${location}-heat`;
          return (
            <g
              key={location}
              role="button"
              tabIndex={0}
              aria-label={`${labels[location]}${selected ? `, ${magnitude}/10` : ''}`}
              aria-pressed={selected}
              aria-describedby={`${side}-body-map-hint`}
              onClick={() => onSelectLocation(location)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectLocation(location);
                }
              }}
              className="pain-map-spot"
              style={{ cursor: 'pointer' }}
            >
              <title>{labels[location]}</title>
              <defs>
                <radialGradient id={gradientId}>
                  <stop offset="0%" stopColor="#78364f" stopOpacity="1" />
                  <stop offset="18%" stopColor="#9b4864" stopOpacity="0.82" />
                  <stop offset="54%" stopColor="#bd7185" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#d49aaa" stopOpacity="0" />
                </radialGradient>
              </defs>
              {selected && <circle cx={x} cy={y} r={heatRadius} fill={`url(#${gradientId})`} opacity={heatOpacity} />}
              <circle className="pain-map-hit-area" cx={x} cy={y} r="19" fill="transparent" />
              <circle className="pain-map-focus-ring" cx={x} cy={y} r="23" fill="transparent" />
            </g>
          );
        })}
      </svg>
    </div>
    <span id={`${side}-body-map-hint`} className="sr-only">{mapNote}</span>
  </div>
);

export const PainLocationMap: React.FC<PainLocationMapProps> = ({ selectedLocations, magnitudes, labels, frontLabel, backLabel, mapNote, onSelectLocation }) => (
  <div className="mb-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
    <p className="mb-2 text-xs font-semibold text-slate-700">{frontLabel} / {backLabel}</p>
    <div className="flex items-start gap-2">
      <BodyFigure side="front" label={frontLabel} image="/images/pain-map-front.png" spots={frontSpots} selectedLocations={selectedLocations} magnitudes={magnitudes} labels={labels} mapNote={mapNote} onSelectLocation={onSelectLocation} />
      <BodyFigure side="back" label={backLabel} image="/images/pain-map-back.png" spots={backSpots} selectedLocations={selectedLocations} magnitudes={magnitudes} labels={labels} mapNote={mapNote} onSelectLocation={onSelectLocation} />
    </div>
    <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-600">{mapNote}</p>
  </div>
);
