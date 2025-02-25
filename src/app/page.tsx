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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to PearHacks
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          The first truly decentralized hackathon platform. Create, join, and collaborate in hackathons - all powered by P2P technology.
        </p>
        <div className="mt-5 max-w-md mx-auto flex justify-center md:mt-8">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-8"
          >
            Create a Hackathon
          </Link>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center space-x-4">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isConnected ? 'Connected to P2P Network' : 'Disconnected'}
            </p>
            <p className="text-sm text-gray-500">
              {peerCount} peer{peerCount !== 1 ? 's' : ''} connected
            </p>
          </div>
        </div>
      </div>

      {/* Active Hackathons */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Hackathons</h2>
        {hackathons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active hackathons found. Be the first to create one!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hackathons.map((hackathon) => (
              <Link
                key={hackathon.id}
                href={`/hackathons/${hackathon.id}`}
                className="block bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{hackathon.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{hackathon.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
                    hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
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
