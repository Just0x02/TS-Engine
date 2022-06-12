import { Mili } from './src';
import { Renderer } from './src/mili/renderer';
import { Vec2 } from './src/mili/engine/vec';
import { Tilemap } from './src/mili/engine/tilemap';
import { Line } from './src/mili/engine/geometry/line';

async function main()
{	
	await Mili.MiliEngine.Init();
	
	Mili.MiliEngine.Run();

	// Mili.WindowEvents.onKey('r', async () => {
	// 	// const spriteSheet: Mili.SpriteSheet = Mili.SpriteSheet.LoadSheetMeta("./data/resources/sprite_sheet_meta.mili.json", false); 
	// 	const dSprite: Mili.DynamicSprite = new Mili.DynamicSprite("./data/resources/sprite_sheet_meta.mili.json");

	// 	await dSprite.isLoaded;

	// 	dSprite.spriteSheet.image.Debug(100, 100);

	// 	dSprite.Draw(Mili.MiliEngine.renderer!, new Mili.Vec2(50, 50));
	// });

	const renderer: Mili.Renderer = Mili.MiliEngine.renderer!; // Should be initialized already.
	const walls: Mili.Line[] = [];
	const windowRect: Mili.Rect = renderer.WindowRect;

	walls.push(new Mili.Line(windowRect.TopLeft.Add(-1, -1), windowRect.TopRight.Add(-1, -1)));
	walls.push(new Mili.Line(windowRect.TopRight.Add(-1, -1), windowRect.BottomRight.Add(1, 1)));
	walls.push(new Mili.Line(windowRect.BottomRight.Add(1, 1), windowRect.BottomLeft.Add(1, 1)));
	walls.push(new Mili.Line(windowRect.BottomLeft.Add(1, 1), windowRect.TopLeft.Add(-1, -1)));

	for (let i = 0; i < 4; i++)
	{
		walls.push(
			new Line(
				Mili.Vec2.Random(windowRect),
				Mili.Vec2.Random(windowRect)
			)
		);
	}

	const view: Mili.Ray2dView = new Mili.Ray2dView(renderer.WindowCenter);

	renderer.RegisterTarget({
		async Render(renderer: Renderer)
		{
			renderer.ctx.strokeStyle = "#999";
			for (let wall of walls)
				renderer.ctx.stroke(wall.Path);

			view.pos.Set(Mili.MiliEngine.MousePos);
			await view.Render(renderer);
			await view.Look(renderer, walls);
		}
	});
}

Mili.Dev();
Mili.OnLoad(main);

(window as any).Mili = Mili;