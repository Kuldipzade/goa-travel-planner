import React from 'react';
import { useStops } from '../context/StopsContext';
import { format } from 'date-fns';

const STATUS_LABELS = { planned: '📍 Planned', visited: '✅ Visited', skipped: '⏭️ Skipped' };
const STATUS_CLASSES = { planned: 'status-planned', visited: 'status-visited', skipped: 'status-skipped' };

export default function StopCard({ stop, onEdit, onSelect }) {
  const { deleteStop, updateStop } = useStops();

  const markVisited = async (e) => {
    e.stopPropagation();
    await updateStop(stop._id, { status: stop.status === 'visited' ? 'planned' : 'visited' });
  };

  return (
    <div className="stop-card" onClick={onSelect}>
      {stop.images.length > 0 && (
        <div className="card-image-strip">
          {stop.images.slice(0, 3).map((img, i) => (
            <img key={i} src={img.url} alt={img.caption || stop.title} className="card-thumb" />
          ))}
          {stop.images.length > 3 && (
            <div className="card-thumb card-thumb-more">+{stop.images.length - 3}</div>
          )}
        </div>
      )}

      <div className="card-body">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">{stop.title}</h3>
            <p className="card-location">📍 {stop.location}</p>
          </div>
          <span className={`status-badge ${STATUS_CLASSES[stop.status]}`}>
            {STATUS_LABELS[stop.status]}
          </span>
        </div>

        {stop.description && <p className="card-desc">{stop.description}</p>}

        <div className="card-meta">
          {stop.visitDate && (
            <span className="meta-chip">📅 {format(new Date(stop.visitDate), 'MMM d, yyyy')}</span>
          )}
          {stop.duration && <span className="meta-chip">⏱️ {stop.duration}</span>}
          {stop.rating && <span className="meta-chip">{'⭐'.repeat(stop.rating)}</span>}
          {stop.images.length > 0 && <span className="meta-chip">📸 {stop.images.length} photo{stop.images.length !== 1 ? 's' : ''}</span>}
        </div>

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className="btn-mark" onClick={markVisited}>
            {stop.status === 'visited' ? '↩️ Unmark' : '✅ Mark Visited'}
          </button>
          <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onEdit(); }}>✏️ Edit</button>
          <button className="btn-delete" onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this stop?')) deleteStop(stop._id); }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}
