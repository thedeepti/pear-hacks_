'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { P2PService } from '@/lib/p2p';
import type { Hackathon, Team, Project } from '@/types/hackathon';

interface P2PContextType {
  isConnected: boolean;
  peerCount: number;
  hackathons: Hackathon[];
  createHackathon: (hackathon: Hackathon) => Promise<void>;
  getHackathon: (id: string) => Promise<Hackathon | null>;
  createTeam: (hackathonId: string, team: Team) => Promise<void>;
  getTeams: (hackathonId: string) => Promise<Team[]>;
  refreshHackathons: () => Promise<void>;
}

const P2PContext = createContext<P2PContextType | null>(null);

export function useP2P() {
  const context = useContext(P2PContext);
  if (!context) {
    throw new Error('useP2P must be used within a P2PProvider');
  }
  return context;
}

export function P2PProvider({ children }: { children: React.ReactNode }) {
  const [p2pService] = useState(() => new P2PService());
  const [isConnected, setIsConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const initP2P = async () => {
      try {
        await p2pService.init();
        setIsConnected(true);
        refreshHackathons();
      } catch (error) {
        console.error('Failed to initialize P2P service:', error);
        setIsConnected(false);
      }
    };

    initP2P();

    p2pService.on('peer-connected', () => {
      setPeerCount(p2pService.getPeerCount());
    });

    p2pService.on('peer-disconnected', () => {
      setPeerCount(p2pService.getPeerCount());
    });

    return () => {
      p2pService.destroy();
    };
  }, [p2pService]);

  const refreshHackathons = async () => {
    try {
      const hackathonList = await p2pService.listHackathons();
      setHackathons(hackathonList);
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
    }
  };

  const createHackathon = async (hackathon: Hackathon) => {
    await p2pService.createHackathon(hackathon);
    await refreshHackathons();
  };

  const getHackathon = async (id: string) => {
    return p2pService.getHackathon(id);
  };

  const createTeam = async (hackathonId: string, team: Team) => {
    await p2pService.createTeam(hackathonId, team);
  };

  const getTeams = async (hackathonId: string) => {
    return p2pService.getTeams(hackathonId);
  };

  const value = {
    isConnected,
    peerCount,
    hackathons,
    createHackathon,
    getHackathon,
    createTeam,
    getTeams,
    refreshHackathons,
  };

  return <P2PContext.Provider value={value}>{children}</P2PContext.Provider>;
} 