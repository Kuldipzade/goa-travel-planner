import React, { useState } from 'react';
import { useStops } from '../context/StopsContext';
import StopCard from '../components/StopCard';
import StopDetail from '../components/StopDetail';

const CATEGORY_ICONS = {
  beach: '🏖️', food: '🍽️', culture: '🏛️', adventure: '🪂',
  nightlife: '🍹', nature: '🌿', shopping: '🛍️', other: '📍'
};

const STATUS_COLORS = { planned: '#f97316', visited: '#22c55e', skipped: '#6b7280' };

export default function Roadmap({ onEditStop }) {
  const { stops = [], loading } = useStops();  // ✅ default to []
  const [selectedStop, setSelectedStop] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? stops : stops.filter(s => s.status === filterStatus);
  const visitedCount = stops.filter(s => s.status === 'visited').length;

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading your Goa adventure...</p>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-num">{stops.length}</span>
          <span className="stat-label">Total Stops</span>
        </div>
        <div className="stat">
          <span className="stat-num" style={{ color: '#22c55e' }}>{visitedCount}</span>
          <span className="stat-label">Visited</span>
        </div>
        <div className="stat">
          <span className="stat-num" style={{ color: '#f97316' }}>{stops.length - visitedCount}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stops.reduce((a, s) => a + (s.images?.length || 0), 0)}</span>  {/* ✅ safe access */}
          <span className="stat-label">Photos</span>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'planned', 'visited', 'skipped'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filterStatus === f ? 'active' : ''}`}
            onClick={() => setFilterStatus(f)}
          >
            {f === 'all' ? '🗺️ All' : f === 'planned' ? '📍 Planned' : f === 'visited' ? '✅ Visited' : '⏭️ Skipped'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌊</div>
          <h2>No stops yet!</h2>
          <p>Start planning your Goa adventure by adding your first stop.</p>
        </div>
      ) : (
        <div className="roadmap-timeline">
          {filtered.map((stop, index) => (
            <div key={stop._id} className="timeline-item">
              <div className="timeline-connector">
                <div className="timeline-dot" style={{ background: STATUS_COLORS[stop.status] }}>
                  <span>{CATEGORY_ICONS[stop.category]}</span>
                </div>
                {index < filtered.length - 1 && <div className="timeline-line" />}
              </div>
              <StopCard
                stop={stop}
                onEdit={() => onEditStop(stop)}
                onSelect={() => setSelectedStop(stop)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedStop && (
        <StopDetail
          stop={selectedStop}
          onClose={() => setSelectedStop(null)}
          onEdit={() => { onEditStop(selectedStop); setSelectedStop(null); }}
        />
      )}
    </div>
  );
}