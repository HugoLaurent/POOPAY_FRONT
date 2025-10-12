// Polyfill complet pour @adonisjs/transmit-client sur React Native

// 1. EventTarget
if (typeof global.EventTarget === 'undefined') {
    class EventTargetPolyfill {
        private listeners: Map<string, Set<Function>> = new Map();

        addEventListener(type: string, callback: Function) {
            if (!this.listeners.has(type)) {
                this.listeners.set(type, new Set());
            }
            this.listeners.get(type)!.add(callback);
        }

        removeEventListener(type: string, callback: Function) {
            if (this.listeners.has(type)) {
                this.listeners.get(type)!.delete(callback);
            }
        }

        dispatchEvent(event: any) {
            const type = event.type;
            if (this.listeners.has(type)) {
                this.listeners.get(type)!.forEach(callback => {
                    callback(event);
                });
            }
            return true;
        }
    }

    (global as any).EventTarget = EventTargetPolyfill;
}

// 2. Event
if (typeof global.Event === 'undefined') {
    class EventPolyfill {
        type: string;
        target: any;
        currentTarget: any;

        constructor(type: string, eventInitDict?: any) {
            this.type = type;
            this.target = eventInitDict?.target || null;
            this.currentTarget = eventInitDict?.currentTarget || null;
        }
    }

    (global as any).Event = EventPolyfill;
}

// 3. CustomEvent (IMPORTANT pour Transmit)
if (typeof global.CustomEvent === 'undefined') {
    class CustomEventPolyfill extends (global as any).Event {
        detail: any;

        constructor(type: string, eventInitDict?: any) {
            super(type, eventInitDict);
            this.detail = eventInitDict?.detail || null;
        }
    }

    (global as any).CustomEvent = CustomEventPolyfill;
}

// 4. MessageEvent
if (typeof global.MessageEvent === 'undefined') {
    class MessageEventPolyfill extends (global as any).Event {
        data: any;

        constructor(type: string, eventInitDict?: any) {
            super(type, eventInitDict);
            this.data = eventInitDict?.data;
        }
    }

    (global as any).MessageEvent = MessageEventPolyfill;
}

console.log('✅ Polyfills chargés : EventTarget, Event, CustomEvent, MessageEvent');
