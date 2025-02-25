'use client';

import { EventEmitter } from 'events';
import type { Hackathon, Team } from '@/types/hackathon';
import { P2P_CONFIG } from '@/config/p2p';
import RAM from 'random-access-memory';

const HACKATHON_KEY = 'hackathon:';
const TEAM_KEY = 'team:';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Bootstrap servers for WebRTC signaling
const BOOTSTRAP_SERVERS = [
  'ws://localhost:3003',  // Local signaling server
  'wss://dht1.pear.pro',
  'wss://dht2.pear.pro'
];

export class P2PService extends EventEmitter {
  private drive: any;
  private bee: any;
  private swarm: any;
  private store: any;
  private peers: Set<string>;
  private isInitialized: boolean;

  constructor() {
    super();
    this.peers = new Set();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Only initialize in browser
      if (!isBrowser) {
        console.log('P2P service skipped in server environment');
        return;
      }

      console.log('Initializing P2P service...');

      // Dynamically import modules
      const [
        { default: Hyperdrive },
        { default: Hyperbee },
        { default: HyperswarmWeb },
        { default: Corestore },
        { keyPair }
      ] = await Promise.all([
        import('hyperdrive'),
        import('hyperbee'),
        import('hyperswarm-web'),
        import('corestore'),
        import('hypercore-crypto')
      ]);

      const crypto = await import('crypto');

      console.log('Modules loaded successfully');

      // Initialize Corestore with RAM storage
      this.store = new Corestore(RAM);
      await this.store.ready();
      console.log('Corestore ready');

      // Generate keypair for the drive
      const keys = keyPair();
      
      // Initialize Hyperdrive with Corestore
      this.drive = new Hyperdrive(this.store, {
        keyPair: keys,
        extension: false // Disable extensions for browser compatibility
      });
      await this.drive.ready();
      console.log('Hyperdrive ready');

      // Create Hyperbee database for indexing
      this.bee = new Hyperbee(this.drive.core, {
        keyEncoding: 'utf-8',
        valueEncoding: 'json'
      });
      await this.bee.ready();
      console.log('Hyperbee database initialized and ready');

      // Initialize browser-compatible swarm
      this.swarm = new HyperswarmWeb({
        bootstrap: BOOTSTRAP_SERVERS
      });
      
      // Create a 32-byte topic by hashing the network topic
      const topic = crypto.createHash('sha256').update(P2P_CONFIG.NETWORK_TOPIC).digest();
      await this.swarm.join(topic);
      console.log('Joined swarm with topic:', P2P_CONFIG.NETWORK_TOPIC);

      // Handle new peer connections
      this.swarm.on('connection', (conn: any) => {
        const peerId = Math.random().toString(36).substring(7);
        this.peers.add(peerId);
        
        // Set up replication for both store and drive
        const stream = this.store.replicate(true);
        stream.pipe(conn).pipe(stream);
        
        this.emit('peer-connected', peerId);
        console.log('Peer connected:', peerId);
        
        conn.once('close', () => {
          this.peers.delete(peerId);
          this.emit('peer-disconnected', peerId);
          console.log('Peer disconnected:', peerId);
        });
      });

      this.isInitialized = true;
      console.log('P2P service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize P2P service:', error);
      throw error;
    }
  }

  async createHackathon(hackathon: Hackathon) {
    try {
      if (!this.isInitialized) {
        console.log('Initializing P2P service before creating hackathon...');
        await this.init();
      }

      if (!this.bee || !this.drive) {
        throw new Error('P2P storage not initialized');
      }

      console.log('Creating hackathon:', hackathon);
      
      // Store hackathon metadata in Hyperbee
      const key = `${HACKATHON_KEY}${hackathon.id}`;
      await this.bee.put(key, hackathon);
      
      // Create a directory for the hackathon in Hyperdrive
      const hackathonPath = `/hackathons/${hackathon.id}`;
      await this.drive.put(hackathonPath, null, { metadata: { type: 'directory' } });
      
      // Create a README with hackathon details
      const readmeContent = `# ${hackathon.name}\n\n${hackathon.description}\n\nStart Date: ${hackathon.startDate}\nEnd Date: ${hackathon.endDate}`;
      await this.drive.put(`${hackathonPath}/README.md`, Buffer.from(readmeContent));
      
      console.log('Hackathon created and verified successfully');
      return true;
    } catch (error) {
      console.error('Failed to create hackathon:', error);
      throw error;
    }
  }

  async getHackathon(id: string): Promise<Hackathon | null> {
    try {
      if (!this.isInitialized) {
        console.log('Initializing P2P service before getting hackathon...');
        await this.init();
      }

      if (!this.bee) {
        throw new Error('Hyperbee database not initialized');
      }

      const key = `${HACKATHON_KEY}${id}`;
      console.log('Getting hackathon with key:', key);
      
      const node = await this.bee.get(key);
      console.log('Retrieved hackathon:', id, node?.value);
      return node ? node.value : null;
    } catch (error) {
      console.error('Failed to get hackathon:', error);
      throw error;
    }
  }

  async listHackathons(): Promise<Hackathon[]> {
    try {
      if (!this.isInitialized) {
        console.log('Initializing P2P service before listing hackathons...');
        await this.init();
      }

      if (!this.bee) {
        throw new Error('Hyperbee database not initialized');
      }

      const hackathons = [];
      console.log('Listing hackathons...');
      
      for await (const { key, value } of this.bee.createReadStream({
        gte: HACKATHON_KEY,
        lte: `${HACKATHON_KEY}\xff`,
      })) {
        console.log('Found hackathon:', { key, value });
        hackathons.push(value);
      }
      
      console.log('Listed hackathons:', hackathons.length);
      return hackathons;
    } catch (error) {
      console.error('Failed to list hackathons:', error);
      throw error;
    }
  }

  async createTeam(hackathonId: string, team: Team) {
    if (!this.isInitialized) await this.init();
    await this.bee.put(`${TEAM_KEY}${hackathonId}:${team.id}`, team);
  }

  async getTeams(hackathonId: string): Promise<Team[]> {
    if (!this.isInitialized) await this.init();
    const teams = [];
    for await (const { value } of this.bee.createReadStream({
      gte: `${TEAM_KEY}${hackathonId}:`,
      lte: `${TEAM_KEY}${hackathonId}:\xff`,
    })) {
      teams.push(value);
    }
    return teams;
  }

  getPeerCount(): number {
    return this.peers.size;
  }

  async destroy() {
    if (!this.isInitialized) return;
    
    // Leave the swarm and close connections
    await this.swarm.destroy();
    
    // Close the drive
    await this.drive.close();
    
    this.isInitialized = false;
    this.peers.clear();
  }
} 