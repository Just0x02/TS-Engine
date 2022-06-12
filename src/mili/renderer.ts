import { CanvasBuffer } from './engine/canvasbuffer';
import { IRect } from './engine/geometry/rect';
import { Debugger } from './engine/utils/debug';
import { Eventful, EventCallback } from './engine/utils/eventful';

export interface IRenderable
{
	Render(renderer: Renderer): Promise<void>
};

export type RendererEvents = 'post-render' | 'pre-render' | 'ready' | 'resize';

export class Renderer extends Eventful<RendererEvents>
{
	public readonly DEBUG_MODE: boolean = true;

	public screenSize: IRect = { width: window.innerWidth, height: window.innerHeight };

	public cbuffer: CanvasBuffer = new CanvasBuffer(
		this.screenSize.width, this.screenSize.height
	);

	public drawBuffer: CanvasBuffer = this.cbuffer; // TODO: Add ability to swap buffers

	private isPaused: boolean = false;
	private isAlive: boolean = false;

	public ticks: number = 0;
	public frame: number = 0;
	public lastTick: number = performance.now();
	public elapsedTime: number = 0;
	public delta: number = 0;

	protected renderTargets: IRenderable[] = [];

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
				async Render(renderer: Renderer): Promise<void>
				{
					renderer.ctx.fillStyle = "red";
					renderer.ctx.font = "bold 14px monospace";

					renderer.ctx.fillText(`TICK=${renderer.ticks}`, 5, 20);
					renderer.ctx.fillText(`FRAME=${renderer.frame}`, 5, 40);
					renderer.ctx.fillText(`ELAPSED=${renderer.elapsedTime}`, 5, 60);
					renderer.ctx.fillText(`DELTA=${renderer.delta}`, 5, 80);
					renderer.ctx.fillText(`FPS=${1000 * renderer.delta}`, 5, 100);
				}
			});
		}
	}

	public get ctx(): CanvasRenderingContext2D { return this.drawBuffer.ctx; }
	public get canvas(): HTMLCanvasElement { return this.drawBuffer.canvas; }

	public Resize(): void
	{
		this.screenSize.width = window.innerWidth;
		this.screenSize.height = window.innerHeight;

		this.canvas.width = this.screenSize.width;
		this.canvas.height = this.screenSize.height;

		this.canvas.style.cssText = `position: absolute; left: 0; top: 0; width: ${this.screenSize.width}px; height: ${this.screenSize.height}px;`;
	}

	@Debugger.watch()
	public RegisterTarget(renderTarget: IRenderable): void
	{
		// this.renderTargets.push(renderTarget);
	}

	public async Render(): Promise<void>
	{
		this.Dispatch('pre-render');
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();


		for (let target of this.renderTargets)
			target.Render(this);

		this.ctx.restore();

		this.ticks++;
		this.frame++;
		this.elapsedTime = performance.now() - this.lastTick;
		this.lastTick = performance.now();
		this.delta = 1.0 / this.elapsedTime;

		this.Dispatch('post-render');

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