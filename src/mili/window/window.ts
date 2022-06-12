import { Debugger } from '../engine/utils/debug';
import { EventCallback, Eventful } from '../engine/utils/eventful';

export type WindowEventIds = 'preload' | 'ready' | 'close' | 'resize' | 'keydown' | 'keyup' | 'mousedown' | 'mouseup' | 'mousemove';

export enum ClickType
{
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2
};

@Debugger.expose_class()
class WindowEventHandler extends Eventful<WindowEventIds>
{
	constructor()
	{
		super();

		window.addEventListener('load', () => {
			this.Dispatch('ready');
		}, { once: true });

		window.addEventListener('close', () => {
			this.Dispatch('close');
		}, { once: true });
	
		window.addEventListener('resize', () => {
			this.Dispatch('resize', { width: window.innerWidth, height: window.innerHeight });
		}, { once: true });

		window.addEventListener('keydown', (ev: KeyboardEvent) => {
			this.Dispatch('keydown', { ev: ev, key: ev.key });
		});

		window.addEventListener('keyup', (ev: KeyboardEvent) => {
			this.Dispatch('keyup', { ev: ev, key: ev.key });
		});

		window.addEventListener('mousedown', (ev: MouseEvent) => {
			this.Dispatch('mousedown', { ev: ev, button: ev.button as ClickType, x: ev.clientX, y: ev.clientY });
		});

		window.addEventListener('mouseup', (ev: MouseEvent) => {
			this.Dispatch('mouseup', { ev: ev, button: ev.button as ClickType, x: ev.clientX, y: ev.clientY });
		});

		window.addEventListener('mousemove', (ev: MouseEvent) => {
			this.Dispatch('mousemove', { ev: ev, x: ev.clientX, y: ev.clientY });
		});
	}

	public onKey(key: string, cb: EventCallback<[{ ev: KeyboardEvent, key: string }]>, once?: boolean): number
	{
		if (!once) return this.on('keydown', (...args: [{ ev: KeyboardEvent, key: string }]) => { if (args[0].key == key) cb(...args); });
		
		return this.once('keydown', (...args: [{ ev: KeyboardEvent, key: string }]) => { if (args[0].key == key) cb(...args); });
	}

	@Eventful.UseCustomHandler<WindowEventIds>('ready')
	public onReady(cb: EventCallback<[]>) {}

	@Eventful.UseCustomHandler<WindowEventIds>('keydown')
	public onKeyPress(cb: EventCallback<[{ ev: KeyboardEvent, key: string }]>) {}

	@Eventful.UseCustomHandler<WindowEventIds>('mousedown')
	public onClick(cb: EventCallback<[{ ev: MouseEvent, button: ClickType, x: number, y: number }]>) {}

	@Eventful.UseCustomHandler<WindowEventIds>('mousemove')
	public onMouseMove(cb: EventCallback<[{ ev: MouseEvent, x: number, y: number }]>) {}
}

export const WindowEvents: WindowEventHandler = WindowEventHandler.getInstance() as any;