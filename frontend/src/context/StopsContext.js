import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { stopsApi } from '../api/stops';
import toast from 'react-hot-toast';

const StopsContext = createContext();

const initialState = { stops: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_STOPS': return { ...state, stops: action.payload, loading: false };
    case 'ADD_STOP': return { ...state, stops: [...state.stops, action.payload] };
    case 'UPDATE_STOP': return {
      ...state,
      stops: state.stops.map(s => s._id === action.payload._id ? action.payload : s)
    };
    case 'DELETE_STOP': return {
      ...state,
      stops: state.stops.filter(s => s._id !== action.payload)
    };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    default: return state;
  }
}

export function StopsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchStops = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await stopsApi.getAll();
      dispatch({ type: 'SET_STOPS', payload: res.data.data });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load stops' });
      toast.error('Failed to load your trip stops');
    }
  }, []);

  useEffect(() => { fetchStops(); }, [fetchStops]);

  const addStop = async (data) => {
    try {
      const res = await stopsApi.create(data);
      dispatch({ type: 'ADD_STOP', payload: res.data.data });
      toast.success('Stop added! 🌴');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add stop');
      throw err;
    }
  };

  const updateStop = async (id, data) => {
    try {
      const res = await stopsApi.update(id, data);
      dispatch({ type: 'UPDATE_STOP', payload: res.data.data });
      toast.success('Stop updated!');
      return res.data.data;
    } catch (err) {
      toast.error('Failed to update stop');
      throw err;
    }
  };

  const deleteStop = async (id) => {
    try {
      await stopsApi.delete(id);
      dispatch({ type: 'DELETE_STOP', payload: id });
      toast.success('Stop removed');
    } catch {
      toast.error('Failed to delete stop');
    }
  };

  const uploadImages = async (id, files) => {
    try {
      const res = await stopsApi.uploadImages(id, files);
      dispatch({ type: 'UPDATE_STOP', payload: res.data.data });
      toast.success(`${files.length} photo(s) uploaded! 📸`);
      return res.data.data;
    } catch {
      toast.error('Failed to upload images');
    }
  };

  const deleteImage = async (stopId, imageId) => {
    try {
      const res = await stopsApi.deleteImage(stopId, imageId);
      dispatch({ type: 'UPDATE_STOP', payload: res.data.data });
      toast.success('Photo deleted');
    } catch {
      toast.error('Failed to delete photo');
    }
  };

  return (
    <StopsContext.Provider value={{
      ...state,
      fetchStops,
      addStop,
      updateStop,
      deleteStop,
      uploadImages,
      deleteImage,
    }}>
      {children}
    </StopsContext.Provider>
  );
}

export const useStops = () => useContext(StopsContext);
