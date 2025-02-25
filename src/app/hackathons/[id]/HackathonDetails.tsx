'use client';

import { useEffect, useState } from 'react';
import { useP2P } from '@/contexts/P2PContext';
import type { Hackathon, Team } from '@/types/hackathon';

interface HackathonDetailsProps {
  id: string;
}

export default function HackathonDetails({ id }: HackathonDetailsProps) {
  const { getHackathon, getTeams, createTeam } = useP2P();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    projectName: '',
    projectDescription: '',
  });

  useEffect(() => {
    const loadHackathon = async () => {
      try {
        const hackathonData = await getHackathon(id);
        if (hackathonData) {
          setHackathon(hackathonData);
          const teamsData = await getTeams(id);
          setTeams(teamsData);
        }
      } catch (error) {
        console.error('Error loading hackathon:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHackathon();
  }, [id, getHackathon, getTeams]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackathon) return;

    const team: Team = {
      id: crypto.randomUUID(),
      hackathonId: hackathon.id,
      name: newTeam.name,
      members: [{ id: 'user', name: 'Current User', skills: [] }], // In a real app, this would be the actual user
      projectName: newTeam.projectName,
      projectDescription: newTeam.projectDescription,
    };

    try {
      await createTeam(hackathon.id, team);
      const updatedTeams = await getTeams(hackathon.id);
      setTeams(updatedTeams);
      setShowCreateTeam(false);
      setNewTeam({ name: '', projectName: '', projectDescription: '' });
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Hackathon not found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hackathon Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{hackathon.name}</h1>
            <p className="mt-2 text-gray-600">{hackathon.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
            hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {hackathon.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(hackathon.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">End Date</h3>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(hackathon.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tracks and Prizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tracks</h2>
          <div className="space-y-4">
            {hackathon.tracks.map((track, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-900">{track.name}</h3>
                <p className="text-gray-600">{track.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prizes</h2>
          <div className="space-y-4">
            {hackathon.prizes.map((prize, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium text-gray-900">{prize.name}</h3>
                <p className="text-gray-600">{prize.description}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">{prize.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Teams</h2>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Create Team
          </button>
        </div>

        {showCreateTeam && (
          <div className="mb-6">
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newTeam.projectName}
                  onChange={(e) => setNewTeam({ ...newTeam, projectName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newTeam.projectDescription}
                  onChange={(e) => setNewTeam({ ...newTeam, projectDescription: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{team.name}</h3>
              {team.projectName && (
                <p className="text-sm text-gray-600 mt-1">Project: {team.projectName}</p>
              )}
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700">Members:</h4>
                <ul className="mt-1 space-y-1">
                  {team.members.map((member) => (
                    <li key={member.id} className="text-sm text-gray-600">
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 