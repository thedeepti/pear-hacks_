'use client';

import { useP2P } from '@/contexts/P2PContext';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { isConnected, peerCount, hackathons, refreshHackathons } = useP2P();

  useEffect(() => {
    refreshHackathons();
  }, [refreshHackathons]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl tracking-tight">
          Welcome to <span className="text-green-600 dark:text-green-500">PearHacks</span>
        </h1>
        <p className="mt-6 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:mt-8 md:max-w-3xl">
          The first truly decentralized hackathon platform. Create, join, and collaborate in hackathons - all powered by P2P technology.
        </p>
        <div className="mt-8 max-w-md mx-auto flex justify-center md:mt-10">
          <Link
            href="/create"
            className="animate-scale inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create a Hackathon
          </Link>
        </div>
      </div>

      {/* Connection Status */}
      <div className="animate-slide-up bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-lg mx-auto transform hover:scale-102 transition-all duration-200">
        <div className="flex items-center space-x-4">
          <div className={`status-dot h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {isConnected ? 'Connected to P2P Network' : 'Disconnected'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {peerCount} peer{peerCount !== 1 ? 's' : ''} connected
            </p>
          </div>
        </div>
      </div>

      {/* Active Hackathons */}
      <div className="animate-slide-up bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Active Hackathons</h2>
          <button 
            onClick={refreshHackathons}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh hackathons"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        {hackathons.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">No active hackathons found.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hackathons.map((hackathon) => (
              <Link
                key={hackathon.id}
                href={`/hackathons/${hackathon.id}`}
                className="group block bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl card-hover"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                  {hackathon.name}
                </h3>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{hackathon.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    hackathon.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
