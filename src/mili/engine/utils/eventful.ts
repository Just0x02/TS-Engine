import { Debugger } from "./debug";

export type StandardEvents = 'ready' | 'close';
export type EventCallback<T extends readonly any[] = any[]> = (...args: T) => void | Promise<void>;
export type ListenerEntry = { listener: EventCallback, id: number, once?: boolean };
export type ListenableSource = { addEventListener: (event: string, handler: EventListener, opts?: AddEventListenerOptions) => void };

export class Eventful<EVENT_SCHEME extends string = StandardEvents>
{
	private static _instance: Eventful | null = null;

	public static getInstance<T extends Eventful>(): T
	{
		if (!this._instance)
		{
			this._instance = new this;
		}

		return this._instance! as T;
	}
	
	private listenerSum: number = 0;
	private listeners: Map<EVENT_SCHEME, ListenerEntry[]> = new Map();
	private linkedEvents: Record<string, string> = {};

	
	protected Register(id: EVENT_SCHEME, listener: EventCallback, opts: Partial<Exclude<ListenerEntry, 'id'>> = {}): number
	{
		const entry: ListenerEntry = { listener: listener, id: this.listenerSum, ...opts };
		
		if (!this.listeners.has(id)) this.listeners.set(id, [entry]);
		else this.listeners.get(id)!.push(entry);
		
		return this.listenerSum++;
	}
	
	protected Captures<T extends ListenableSource>(source: T, event: string | string[], handler?: EventListener, opts?: AddEventListenerOptions): void
	{
		if (typeof event === 'string')
		{
			source.addEventListener(event, handler ?? (() => { this.Dispatch(event as EVENT_SCHEME); }), opts);
			return;
		}
		
		for (let eventId of event)
			source.addEventListener(eventId, handler ?? (() => { this.Dispatch(eventId as EVENT_SCHEME); }), opts);
		}
		
		public Remove(listenerId: number, eventId?: EVENT_SCHEME): Nullable<ListenerEntry>
		{
			if (eventId !== undefined)
			{
				if (!this.listeners.has(eventId)) return null;
				
				const entries: ListenerEntry[] = this.listeners.get(eventId)!;
				
				let targetIndex: number = entries.findIndex((entry: ListenerEntry) => entry.id == listenerId);
				
				if (targetIndex === -1) return null;
				
				let target: ListenerEntry = entries.slice(targetIndex, targetIndex).pop()!;
				
				this.listeners.set(eventId, entries.splice(targetIndex, 1));
				
				return target;
			}
			else
			{
				for (let id of this.listeners.keys())
			{
				let res = this.Remove(listenerId, id);
				
				if (res !== null) return res;
			}
		}
		
		return null;
	}
	
	public once(eventId: EVENT_SCHEME, cb: EventCallback): number
	{
		const listenerId: number = this.Register(eventId, cb, { once: true });
		
		console.log(`New ONCE Listener: id=${eventId}`);
		
		return listenerId;
	}
	
	public on(eventId: EVENT_SCHEME, cb: EventCallback): number
	{
		const listenerId: number = this.Register(eventId, cb);
		
		console.log(`New ON Listener: id=${eventId}`);
		
		return listenerId;
	}

	public LinkEvent<EVENT_SCHEME extends string>(eventId: EVENT_SCHEME, handler: any, handlerMethod: Function | string): void
	{
		let handlerKey: string = typeof handlerMethod === 'string' ? handlerMethod : handlerMethod.name;

		this.on(<any>eventId, (...args: any) => {
			let method: Nullable<Function> = handler[handlerKey];
			
			method?.call(method, ...args);
		});
	}
	
	public async Dispatch<T extends EVENT_SCHEME, K extends readonly any[] = any[]>(id: T, ...data: K): Promise<void>
	{
		if (!this.listeners.has(id) || this.listeners.get(id)!.length == 0) return;

		this.listeners.set(id, this.listeners.get(id)!.filter((entry: ListenerEntry) => {
			entry.listener(...data);
			return !entry.once;
		}));
	}

	// Waits until an event has been dispatched
	public async Until<T extends EVENT_SCHEME, K extends readonly any[] = any[]>(eventId: T): Promise<K>
	{
		return new Promise<K>(resolve => {
			this.Register(eventId, resolve, { once: true });
		});
	}

	public static UseCustomHandler<T_EVENT_SCHEME extends string = StandardEvents, T extends Eventful<T_EVENT_SCHEME> = Eventful<T_EVENT_SCHEME>>(eventId: T_EVENT_SCHEME, eventer?: Nullable<Eventful<T_EVENT_SCHEME>>)
	{
		return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
			const base: Function = descriptor.value!;

			descriptor.value = function(cb: EventCallback) {
				let newListenerId: number = (eventer != null || eventer != undefined ? eventer : target).on.apply(this, [eventId as T_EVENT_SCHEME, cb]);

				base.apply(this, [cb]);

				return newListenerId;
			}
			
		}
	}
}