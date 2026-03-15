# 🌴 Goa Wanderer — Travel Roadmap Planner

A full-stack travel planning app for your Goa trip. Plan your stops, upload photos per location, track what you've visited, and see your entire route on an interactive map.

---

## 🗂️ Project Structure

```
goa-travel-planner/
├── backend/          ← Node.js + Express + MongoDB
└── frontend/         ← React app
```

---

## ⚙️ Setup: Backend

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your real credentials:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/goa-travel?retryWrites=true&w=majority

# Cloudinary (get from cloudinary.com → Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=5000
```

### 3. Get MongoDB Atlas URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **Connect** → **Connect your application**
3. Copy the connection string, replace `<password>` with your DB user password

### 4. Get Cloudinary credentials
1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**

### 5. Start the backend
```bash
npm run dev     # Development (with nodemon)
npm start       # Production
```
Backend runs at: `http://localhost:5000`

---

## ⚙️ Setup: Frontend

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start the React app
```bash
npm start
```
Frontend runs at: `http://localhost:3000`
(Proxies API calls to `localhost:5000` automatically)

---

## 🚀 Features

| Feature | Description |
|---|---|
| **Roadmap Timeline** | Visual timeline of all your Goa stops in order |
| **Map View** | Interactive dark map (OpenStreetMap) with all stops plotted + route line |
| **Add/Edit/Delete Stops** | Full CRUD with title, location, date, duration, category, rating, tips |
| **Photo Upload** | Upload multiple photos per stop → stored on Cloudinary, URL saved in MongoDB |
| **Photo Gallery** | Grid view with lightbox for full-screen browsing |
| **Status Tracking** | Mark stops as Planned / Visited / Skipped |
| **Filter** | Filter roadmap by status |
| **Stats Bar** | See total stops, visited count, remaining, and total photos at a glance |

---

## 🗺️ Map Tips

- If you enter **Latitude/Longitude** when adding a stop, it will be pinned exactly on the map
- Without coordinates, the app will auto-detect known Goa locations (Baga Beach, Anjuna, Panjim, etc.)
- Unknown stops are placed approximately in Goa
- A **dashed orange route line** connects your planned/visited stops in order

**How to get lat/lng for any Goa location:**
1. Open [Google Maps](https://maps.google.com)
2. Right-click on the location → click the coordinates shown at the top of the context menu
3. Paste them into the Latitude/Longitude fields when adding a stop

---

## 🛠️ API Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/stops` | Get all stops |
| POST | `/api/stops` | Create a stop |
| PUT | `/api/stops/:id` | Update a stop |
| DELETE | `/api/stops/:id` | Delete a stop |
| POST | `/api/stops/:id/images` | Upload images (multipart) |
| DELETE | `/api/stops/:id/images/:imageId` | Delete an image |
| PATCH | `/api/stops/reorder` | Reorder stops |

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Context API, Leaflet.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Image Storage | Cloudinary |
| Map | Leaflet + OpenStreetMap (CARTO dark tiles) |
| Styling | Custom CSS with CSS Variables |
