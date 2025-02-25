declare module 'hypercore' {
  import { EventEmitter } from 'events';
  
  export default class Hypercore<T> extends EventEmitter {
    ready(): Promise<void>;
    append(data: T): Promise<void>;
    get(index: number): Promise<T>;
    length: number;
  }
}

declare module 'hyperswarm' {
  import { EventEmitter } from 'events';
  
  export default class Hyperswarm extends EventEmitter {
    join(topic: Buffer): void;
    leave(topic: Buffer): void;
    destroy(): Promise<void>;
    on(event: 'connection', callback: (connection: any, info: any) => void): this;
  }
}

declare module 'hyperbee' {
  export default class Hyperbee {
    constructor(core: any, options?: { keyEncoding?: string; valueEncoding?: string });
    get(key: string): Promise<{ key: string; value: any } | null>;
    put(key: string, value: any): Promise<void>;
    createReadStream(options?: { gte?: string; lte?: string }): AsyncIterableIterator<{ key: string; value: any }>;
  }
}

declare module 'corestore' {
  import { EventEmitter } from 'events';

  export default class Corestore extends EventEmitter {
    constructor(storage: any);
    ready(): Promise<void>;
    namespace(name: string): Corestore;
    get(options: { name?: string; key?: Buffer }): any;
    replicate(initiator: boolean): any;
    close(): Promise<void>;
  }
}

declare module 'hyperdrive' {
  import { EventEmitter } from 'events';
  
  interface HyperdriveOptions {
    keyPair?: { publicKey: Buffer; secretKey: Buffer };
    extension?: boolean;
  }

  interface PutOptions {
    metadata?: {
      type?: 'directory' | 'file';
      [key: string]: any;
    };
  }

  export default class Hyperdrive extends EventEmitter {
    constructor(storage: any, options?: HyperdriveOptions);
    ready(): Promise<void>;
    put(path: string, content: Buffer | null, options?: PutOptions): Promise<void>;
    get(path: string): Promise<{ value: Buffer; metadata: any }>;
    del(path: string): Promise<void>;
    list(path?: string): AsyncIterableIterator<{ key: string; value: Buffer; metadata: any }>;
    core: any;
    replicate(initiator: boolean): any;
    close(): Promise<void>;
  }
}

declare module 'hypercore-crypto' {
  export function keyPair(): { publicKey: Buffer; secretKey: Buffer };
} 