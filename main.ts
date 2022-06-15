import { Mili } from './src';
import { Renderer } from './src/mili/engine/renderer/renderer';
import { Vec2 } from './src/mili/engine/geometry/vec';
import { Tilemap } from './src/mili/engine/gfx/tilemap';
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
	const player: Vec2 = renderer.WindowCenter;
	const dSprite: Mili.DynamicSprite = await Mili.DynamicSprite.Load("./data/resources/sprite_sheet_meta.mili.json");

	renderer.RegisterTarget({
		async Render(renderer: Renderer)
		{
			dSprite.Draw(renderer, player);
		}
	});

	Mili.WindowEvents.onKeyPress(async ({ key }) => {
		if (key == 'w')
		{
			player.y -= 10;
			dSprite.FrameIndex = 0;
		}
		else if (key == 's')
		{
			player.y += 10;
			dSprite.FrameIndex = 18;
		}
		else if (key == 'a')
		{
			player.x -= 10;
			dSprite.FrameIndex = 27;
		}
		else if (key == 'd')
		{
			player.x += 10;
			dSprite.FrameIndex = 9;
		}
		else if (key == 'e')
		{
			dSprite.FrameIndex++;
			console.log(dSprite.FrameIndex);
		}
	});
	// const spriteSheet: Mili.SpriteSheet = await Mili.SpriteSheet.LoadSheetMeta("./data/resources/sprite_sheet_meta.mili.json", false); 




	// const walls: Mili.Line[] = [];
	// const windowRect: Mili.Rect = renderer.WindowRect;

	// walls.push(new Mili.Line(windowRect.TopLeft.Add(-1, -1), windowRect.TopRight.Add(-1, -1)));
	// walls.push(new Mili.Line(windowRect.TopRight.Add(-1, -1), windowRect.BottomRight.Add(1, 1)));
	// walls.push(new Mili.Line(windowRect.BottomRight.Add(1, 1), windowRect.BottomLeft.Add(1, 1)));
	// walls.push(new Mili.Line(windowRect.BottomLeft.Add(1, 1), windowRect.TopLeft.Add(-1, -1)));

	// for (let i = 0; i < 4; i++)
	// {
	// 	walls.push(
	// 		new Line(
	// 			Mili.Vec2.Random(windowRect),
	// 			Mili.Vec2.Random(windowRect)
	// 		)
	// 	);
	// }

	// const view: Mili.Ray2dView = new Mili.Ray2dView(renderer.WindowCenter);

	// renderer.RegisterTarget({
	// 	async Render(renderer: Renderer)
	// 	{
	// 		renderer.ctx.strokeStyle = "#999";
	// 		for (let wall of walls)
	// 			renderer.ctx.stroke(wall.Path);

	// 		view.pos.Set(Mili.MiliEngine.MousePos);
	// 		await view.Render(renderer);
	// 		await view.Look(renderer, walls);
	// 	}
	// });
}

Mili.Dev();
Mili.OnLoad(main);

(window as any).Mili = Mili;