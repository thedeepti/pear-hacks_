'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useP2P } from '@/contexts/P2PContext';
import type { Hackathon, Track, Prize } from '@/types/hackathon';

const FORM_STORAGE_KEY = 'hackathon_form_data';

export default function CreateHackathon() {
  const router = useRouter();
  const { createHackathon } = useP2P();
  const [tracks, setTracks] = useState<Track[]>([{ name: '', description: '' }]);
  const [prizes, setPrizes] = useState<Prize[]>([{ name: '', description: '', value: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxTeamSize: 4,
  });

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      const { formData: savedFormData, tracks: savedTracks, prizes: savedPrizes } = JSON.parse(savedData);
      setFormData(savedFormData);
      setTracks(savedTracks);
      setPrizes(savedPrizes);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      formData,
      tracks,
      prizes
    }));
  }, [formData, tracks, prizes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      const hackathon: Hackathon = {
        id: crypto.randomUUID(),
        ...formData,
        tracks: tracks.filter(track => track.name),
        prizes: prizes.filter(prize => prize.name),
        status: 'upcoming',
        createdBy: 'user',
      };

      await createHackathon(hackathon);
      setSuccessMessage('Hackathon created successfully!');
      
      // Clear the form data from localStorage
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/hackathons');
      }, 1500);
    } catch (error) {
      console.error('Failed to create hackathon:', error);
      setError(error instanceof Error ? error.message : 'Failed to create hackathon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTrack = () => {
    setTracks([...tracks, { name: '', description: '' }]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const addPrize = () => {
    setPrizes([...prizes, { name: '', description: '', value: '' }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg p-8 text-white">
        <h1 className="text-3xl font-bold">Create a New Hackathon</h1>
        <p className="mt-2 text-green-100">Set up your hackathon and inspire innovation</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-b-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            <div className="grid gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Hackathon Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a catchy name for your hackathon"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your hackathon's mission and goals"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    id="maxTeamSize"
                    min="1"
                    max="10"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                    value={formData.maxTeamSize}
                    onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
              <button
                type="button"
                onClick={addTrack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Track
              </button>
            </div>
            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Track Name"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                      value={track.name}
                      onChange={(e) => {
                        const newTracks = [...tracks];
                        newTracks[index].name = e.target.value;
                        setTracks(newTracks);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Track Description"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                      value={track.description}
                      onChange={(e) => {
                        const newTracks = [...tracks];
                        newTracks[index].description = e.target.value;
                        setTracks(newTracks);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Prizes</h2>
              <button
                type="button"
                onClick={addPrize}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Prize
              </button>
            </div>
            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Prize Name"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                      value={prize.name}
                      onChange={(e) => {
                        const newPrizes = [...prizes];
                        newPrizes[index].name = e.target.value;
                        setPrizes(newPrizes);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Prize Description"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                      value={prize.description}
                      onChange={(e) => {
                        const newPrizes = [...prizes];
                        newPrizes[index].description = e.target.value;
                        setPrizes(newPrizes);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Prize Value"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                      value={prize.value}
                      onChange={(e) => {
                        const newPrizes = [...prizes];
                        newPrizes[index].value = e.target.value;
                        setPrizes(newPrizes);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Hackathon'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 