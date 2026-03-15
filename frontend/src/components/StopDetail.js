import React, { useState, useRef } from 'react';
import { useStops } from '../context/StopsContext';
import { format } from 'date-fns';

export default function StopDetail({ stop, onClose, onEdit }) {
  const { uploadImages, deleteImage } = useStops();
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    await uploadImages(stop._id, files);
    setUploading(false);
    fileRef.current.value = '';
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <h2>{stop.title}</h2>
            <p className="detail-location">📍 {stop.location}</p>
          </div>
          <div className="detail-header-actions">
            <button className="btn-edit" onClick={onEdit}>✏️ Edit</button>
            <button className="btn-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="detail-meta">
          {stop.visitDate && <span className="meta-chip">📅 {format(new Date(stop.visitDate), 'MMMM d, yyyy')}</span>}
          {stop.duration && <span className="meta-chip">⏱️ {stop.duration}</span>}
          {stop.category && <span className="meta-chip">🏷️ {stop.category}</span>}
          {stop.rating && <span className="meta-chip">{'⭐'.repeat(stop.rating)}</span>}
        </div>

        {stop.description && (
          <div className="detail-section">
            <h4>About this stop</h4>
            <p>{stop.description}</p>
          </div>
        )}

        {stop.tips && (
          <div className="detail-section tips-section">
            <h4>💡 Tips & Notes</h4>
            <p>{stop.tips}</p>
          </div>
        )}

        {/* Photo Gallery */}
        <div className="detail-section">
          <div className="gallery-header">
            <h4>📸 Photos ({stop.images.length})</h4>
            <label className={`btn-upload ${uploading ? 'loading' : ''}`}>
              {uploading ? 'Uploading...' : '+ Add Photos'}
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {stop.images.length === 0 ? (
            <div className="no-photos">
              <span>🖼️</span>
              <p>No photos yet. Add some memories!</p>
            </div>
          ) : (
            <div className="photo-grid">
              {stop.images.map((img, i) => (
                <div key={img._id} className="photo-item">
                  <img src={img.url} alt={img.caption || `Photo ${i + 1}`} onClick={() => setLightbox(i)} />
                  <button
                    className="photo-delete"
                    onClick={() => { if (window.confirm('Delete this photo?')) deleteImage(stop._id, img._id); }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); setLightbox(l => Math.max(0, l - 1)); }}>‹</button>
          <img src={stop.images[lightbox].url} alt="" onClick={e => e.stopPropagation()} />
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); setLightbox(l => Math.min(stop.images.length - 1, l + 1)); }}>›</button>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lightbox-counter">{lightbox + 1} / {stop.images.length}</div>
        </div>
      )}
    </div>
  );
}
