declare module 'hyperswarm-web' {
  import { EventEmitter } from 'events';

  interface HyperswarmWebOptions {
    bootstrap?: string[];
  }

  class HyperswarmWeb extends EventEmitter {
    constructor(options?: HyperswarmWebOptions);
    join(topic: Buffer): Promise<void>;
    leave(topic: Buffer): Promise<void>;
    connect(peer: any): void;
    destroy(): Promise<void>;
    on(event: 'connection', listener: (socket: any) => void): this;
    on(event: string, listener: Function): this;
  }

  export default HyperswarmWeb;
} 