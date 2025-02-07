'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from '@/Store/store';

const LocationFetcher: React.FC = () => {
  const { setLocation, setError } = useStore(); // Get the functions from store

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch the location name using OpenCage API
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          setError(error.message); // Update error in zustand store
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, [setLocation, setError]);

  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: `${latitude},${longitude}`, // Correct parameter for OpenCage API
          key: '3bd02655bfaa443f862769c40b18ac58', // Your OpenCage API key
        },
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const placeName = response.data.results[0].formatted || 'Unknown location';
        setLocation(latitude, longitude, placeName); // Store the location name in Zustand
      } else {
        throw new Error('No results found from the API.');
      }
    } catch (error: any) {
      console.error('Error fetching location name:', error.response?.data || error.message);
      setError('Failed to fetch location name.');
    }
  };

  return null; // This component runs in the background to update the Zustand store
};

export default LocationFetcher;
