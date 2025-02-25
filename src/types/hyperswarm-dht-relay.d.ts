declare module '@hyperswarm/dht-relay' {
  import { Server as SocketIOServer } from 'socket.io';
  import { EventEmitter } from 'events';

  export interface SignalServerOptions {
    io: SocketIOServer;
  }

  export class SignalServer extends EventEmitter {
    constructor(io: SocketIOServer);
    destroy(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
  }
} 