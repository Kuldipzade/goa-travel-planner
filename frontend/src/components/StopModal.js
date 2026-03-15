import React, { useState } from 'react';
import { useStops } from '../context/StopsContext';

const CATEGORIES = ['beach', 'food', 'culture', 'adventure', 'nightlife', 'nature', 'shopping', 'other'];
const CATEGORY_ICONS = { beach:'🏖️',food:'🍽️',culture:'🏛️',adventure:'🪂',nightlife:'🍹',nature:'🌿',shopping:'🛍️',other:'📍' };

export default function StopModal({ stop, onClose }) {
  const { addStop, updateStop } = useStops();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: stop?.title || '',
    location: stop?.location || '',
    description: stop?.description || '',
    visitDate: stop?.visitDate ? stop.visitDate.split('T')[0] : '',
    duration: stop?.duration || '',
    category: stop?.category || 'other',
    status: stop?.status || 'planned',
    rating: stop?.rating || '',
    tips: stop?.tips || '',
    lat: stop?.coordinates?.lat || '',
    lng: stop?.coordinates?.lng || '',
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
    const payload = {
      ...form,
      rating: form.rating ? Number(form.rating) : undefined,
      coordinates: (form.lat && form.lng) ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined,
    };
    delete payload.lat; delete payload.lng;
      if (stop) await updateStop(stop._id, payload);
      else await addStop(payload);
      onClose();
    } catch { /* toast already shown */ }
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{stop ? '✏️ Edit Stop' : '📍 Add New Stop'}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Stop Name *</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Baga Beach" required />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. North Goa" required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="What's special about this place?" rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Visit Date</label>
              <input type="date" value={form.visitDate} onChange={set('visitDate')} />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input type="text" value={form.duration} onChange={set('duration')} placeholder="e.g. 2 hours, Half day" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="planned">📍 Planned</option>
                <option value="visited">✅ Visited</option>
                <option value="skipped">⏭️ Skipped</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rating</label>
              <select value={form.rating} onChange={set('rating')}>
                <option value="">No rating</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{'⭐'.repeat(n)}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>💡 Tips & Notes</label>
            <textarea value={form.tips} onChange={set('tips')} placeholder="Personal tips, reminders, things to try..." rows={2} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📍 Latitude (optional)</label>
              <input type="number" step="any" value={form.lat} onChange={set('lat')} placeholder="e.g. 15.5556" />
            </div>
            <div className="form-group">
              <label>📍 Longitude (optional)</label>
              <input type="number" step="any" value={form.lng} onChange={set('lng')} placeholder="e.g. 73.7517" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : stop ? 'Update Stop' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
