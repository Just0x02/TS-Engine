import { Renderer } from "./renderer";
import path from 'path';
import { Debugger } from "./engine/utils/debug";

export class MiliEngine
{
	public static readonly RootDir: string = path.resolve(__dirname, "../../../");
	public static renderer: Nullable<Renderer> = null;

	@Debugger.watch()
	public static async Init(): Promise<void>
	{
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