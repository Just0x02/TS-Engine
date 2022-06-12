import { Mili } from './src';
import { Renderer } from './src/mili/renderer';
import { Vec2 } from './src/mili/engine/vec';
import { Tilemap } from './src/mili/engine/tilemap';

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

	const renderer: Renderer = Mili.MiliEngine.renderer!; // Should be initialized already.

	var player: Vec2 = new Vec2(8, 8);
	var playerDelta: Vec2 = new Vec2(0, 0);
	var playerAngle: number = 0.0;
	const mapWidth: number = 8, mapHeight: number = 8;
	const map: number[] = [
		1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 1, 1, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1
	];


	
}

Mili.Dev();
Mili.OnLoad(main);

(window as any).Mili = Mili;