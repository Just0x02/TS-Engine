import { Mili } from './src';
import { Renderer } from './src/mili/engine/renderer/renderer';
import { Vec2 } from './src/mili/engine/geometry/vec';
import { Tilemap } from './src/mili/engine/gfx/tilemap';
import { Line } from './src/mili/engine/geometry/line';
import { WindowEvents } from './src/mili/window/window';
import { RendererSubProcess, SubProcessType } from './src/mili/engine/renderer/subprocess';
import { SpriteSheet } from './src/mili/engine/gfx/spritesheet';
import { Sprite } from './src/mili/engine/gfx/sprite';

async function main()
{	
	await Mili.MiliEngine.Init();
	
	Mili.MiliEngine.Run();

	const renderer: Mili.Renderer = Mili.MiliEngine.renderer!;

	let spritesheet: SpriteSheet = await SpriteSheet.LoadSheetMeta('./data/resources/sprite_sheet_meta.mili.json');
	let idx: number = 0;
	let sprite: Sprite = await spritesheet.SubSprite(0, 0);
	
	WindowEvents.onKey('r', async () => {
		idx++;

		let spriteidx: Vec2 = spritesheet.AsSpriteIndex(idx);

		sprite = await spritesheet.SubSprite(spriteidx.x, spriteidx.y);
	});

	renderer.RegisterTarget({
		async Render(): Promise<void>
		{
			sprite.Draw(renderer, renderer.WindowCenter);
		}
	});
}

Mili.Dev();
Mili.OnLoad(main);

(window as any).Mili = Mili;