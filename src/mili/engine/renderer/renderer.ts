import { CanvasBuffer } from './canvasbuffer';
import { IRect, Rect } from '../geometry/rect';
import { Debugger } from '../utils/debug';
import { Eventful, EventCallback } from '../utils/eventful';
import { Vec2 } from '../geometry/vec';
import { WindowEvents } from '../../window/window';
import { RendererSubProcess, SubProcessStep, SubProcessType } from './subprocess';

export interface IRenderable
{
	zIndex?: number,
	Render(renderer: Renderer): Promise<void>
};

export type RendererEvents = 'post-render' | 'pre-render' | 'ready' | 'resize';

export class Renderer extends Eventful<RendererEvents>
{
	public DEBUG_MODE: boolean = false;

	public screenSize: IRect = { width: window.innerWidth, height: window.innerHeight };

	public cbuffer: CanvasBuffer = new CanvasBuffer(
		this.screenSize.width, this.screenSize.height
	);

	public drawBuffer: CanvasBuffer = this.cbuffer; // TODO: Add ability to swap buffers

	public customClearColor: Nullable<string> = "#000";

	private isPaused: boolean = false;
	private isAlive: boolean = false;

	public ticks: number = 0;
	public frame: number = 0;
	public lastTick: number = performance.now();
	public elapsedTime: number = 0;
	public delta: number = 0;

	public readonly renderTargets: IRenderable[] = [];
	public readonly subProcesses: Readonly<Map<SubProcessType, RendererSubProcess[]>> = new Map([
		['pre-render', []], 
		['post-render', []]
	]);

	constructor()
	{
		super();
		window.addEventListener('resize', () => {
			this.Resize();

			this.Dispatch('resize');
		});

		this.Dispatch('ready');

		this.cbuffer.DisplayOn(document.body, true);

		if (this.DEBUG_MODE)
		{
			this.RegisterTarget({
				zIndex: 3,

				async Render(renderer: Renderer): Promise<void>
				{
					if (!renderer.DEBUG_MODE) return;

					renderer.ctx.fillStyle = "black";
					renderer.ctx.fillRect(0, 0, 300, 120);

					renderer.ctx.fillStyle = "red";
					renderer.ctx.font = "bold 14px monospace";

					renderer.ctx.fillText(`TICK=${renderer.ticks}`, 5, 20);
					renderer.ctx.fillText(`FRAME=${renderer.frame}`, 5, 40);
					renderer.ctx.fillText(`ELAPSED=${renderer.elapsedTime}`, 5, 60);
					renderer.ctx.fillText(`DELTA=${renderer.delta}`, 5, 80);
					renderer.ctx.fillText(`FPS=${1000 * renderer.delta}`, 5, 100);
				}
			});

			WindowEvents.onKey('`', () => {
				this.DEBUG_MODE = !this.DEBUG_MODE;
			});
		}
	}

	public get ctx(): CanvasRenderingContext2D { return this.drawBuffer.ctx; }
	public get canvas(): HTMLCanvasElement { return this.drawBuffer.canvas; }
	public get WindowCenter(): Vec2 { return new Vec2(this.drawBuffer.width / 2, this.drawBuffer.height / 2).Round(); }
	public get WindowRect(): Rect { return new Rect(new Vec2(0, 0), this.canvas.width, this.canvas.height); }

	public Resize(): void
	{
		this.screenSize.width = window.innerWidth;
		this.screenSize.height = window.innerHeight;

		this.canvas.width = this.screenSize.width;
		this.canvas.height = this.screenSize.height;

		this.canvas.style.cssText = `position: absolute; left: 0; top: 0; width: ${this.screenSize.width}px; height: ${this.screenSize.height}px;`;
	}

	public RegisterSubProcess(sproc: RendererSubProcess): void
	{
		this.subProcesses.get(sproc.type)!.push(sproc);
	}

	public RegisterTarget(renderTarget: IRenderable): void
	{
		this.renderTargets.push(renderTarget);

		this.renderTargets.sort((a: IRenderable, b: IRenderable) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
	}

	public UseSubProcess(type: SubProcessType, step: SubProcessStep): RendererSubProcess
	{
		return new RendererSubProcess(
			type, step
		).Attach(this);
	}

	public async Render(): Promise<void>
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();
		
		if (this.customClearColor) 
		{
			this.ctx.fillStyle = this.customClearColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		this.Dispatch('pre-render');

		{ // Rendering and such
			for (let sproc of this.subProcesses.get('pre-render')!)
				await sproc.Render(this);
			
			for (let target of this.renderTargets)
				await target.Render(this);
	
			for (let sproc of this.subProcesses.get('post-render')!)
				await sproc.Render(this);
		}

		this.Dispatch('post-render');
		this.ctx.restore();

		this.ticks++;
		this.frame++;
		this.elapsedTime = performance.now() - this.lastTick;
		this.lastTick = performance.now();
		this.delta = 1.0 / this.elapsedTime;


		if (this.isAlive)
			requestAnimationFrame(async () => await this.Render());
	}

	@Debugger.watch()
	public Stop(): void
	{
		this.isAlive = false;
	}

	@Debugger.watch()
	public async Begin(): Promise<void>
	{
		this.isAlive = true;

		this.Render();
	}

	@Eventful.UseCustomHandler<RendererEvents>('ready')
	public onReady(cb: EventCallback) {}

	@Eventful.UseCustomHandler<RendererEvents>('pre-render')
	public onPreRender(cb: EventCallback<[]>) {}

	@Eventful.UseCustomHandler<RendererEvents>('post-render')
	public onPostRender(cb: EventCallback<[]>) {}
}