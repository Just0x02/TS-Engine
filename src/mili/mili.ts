import { Renderer } from "./engine/renderer/renderer";
import path from 'path';
import { Debugger } from "./engine/utils/debug";
import { Vec2 } from './engine/geometry/vec';
import { WindowEvents } from './window/window';
import { IPosition } from './engine/geometry/pos';

export class MiliEngine
{
	public static readonly RootDir: string = path.resolve(__dirname, "../../../");
	public static renderer: Nullable<Renderer> = null;
	private static lastMousePosition: Vec2 = new Vec2(0, 0);

	public static get MousePos(): Vec2
	{
		return this.lastMousePosition;
	}

	@Debugger.watch()
	public static async Init(): Promise<void>
	{
		WindowEvents.onMouseMove((mouseEvent: IPosition) => {
			this.lastMousePosition.Set(mouseEvent);
		});

		this.renderer = new Renderer();
	}

	@Debugger.watch()
	public static Run(): void
	{
		this.renderer!.Begin();
	}

	// For manual rendering targets
	@Debugger.watch()
	public static Use(cb: (renderer: Renderer) => void | Promise<void>)
	{
		if (!this.renderer) throw "You must initialize before assigning tasks to the renderer!";

		this.renderer.RegisterTarget({
			async Render(renderer: Renderer) { await cb(renderer); }
		});
	}
}