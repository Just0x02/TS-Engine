import { Renderer, IRenderable } from './renderer';
import { Snowflake, SnowflakeID } from '../utils/snowflake';

export type SubProcessType = 'post-render' | 'pre-render';
export type SubProcessStep = (renderer: Renderer, process: RendererSubProcess) => Promise<boolean | void>;


/**
 * TODO: Have all subprocesses be delegated to web workers through OffscreenCanvas API
 */
export class RendererSubProcess implements IRenderable, Snowflake
{
	public readonly id: SnowflakeID = new SnowflakeID();
	public readonly type: SubProcessType;
	public readonly step: SubProcessStep;
	public startTime: number = performance.now();
	public lastStep: number = 0; // Time since last step

	constructor(type: SubProcessType, step: SubProcessStep)
	{
		this.type = type;
		this.step = step;
	}
	
	public Attach(renderer: Renderer): this
	{
		this.startTime = performance.now();
		
		renderer.RegisterSubProcess(
			this
		);
			
		return this;
	}

	public Detach(renderer: Renderer): this
	{
		renderer.subProcesses.set(this.type, 
			renderer.subProcesses.get(this.type)!.filter((sproc: RendererSubProcess) => !sproc.id.is(this))
		);

		return this;
	}

	public async Render(renderer: Renderer) 
	{
		if (await this.step(renderer, this) === false) this.Detach(renderer);
		this.lastStep = performance.now();
	}
}