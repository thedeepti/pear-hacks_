'use client';

import { useEffect, useState } from 'react';
import { useP2P } from '@/contexts/P2PContext';
import Link from 'next/link';
import type { Hackathon } from '@/types/hackathon';

export default function HackathonList() {
  const { hackathons, refreshHackathons } = useP2P();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');

  useEffect(() => {
    refreshHackathons();
  }, [refreshHackathons]);

  const filteredHackathons = hackathons.filter(
    (hackathon) => filter === 'all' || hackathon.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Hackathons</h1>
        <Link
          href="/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Create New
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'upcoming', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${filter === status
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Hackathon Grid */}
      {filteredHackathons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hackathons found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <Link
              key={hackathon.id}
              href={`/hackathons/${hackathon.id}`}
              className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900">{hackathon.name}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hackathon.status)}`}>
                    {hackathon.status}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-2">{hackathon.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Start:</span>
                    <span className="ml-2">{new Date(hackathon.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">End:</span>
                    <span className="ml-2">{new Date(hackathon.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tracks.map((track, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {track.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 