import { Mili } from './src';

async function main()
{	
	await Mili.MiliEngine.Init();
	
	Mili.MiliEngine.Run();

	Mili.WindowEvents.onKey('r', async () => {
		// const spriteSheet: Mili.SpriteSheet = Mili.SpriteSheet.LoadSheetMeta("./data/resources/sprite_sheet_meta.mili.json", false); 
		const dSprite: Mili.DynamicSprite = new Mili.DynamicSprite("./data/resources/sprite_sheet_meta.mili.json");

		await dSprite.isLoaded;

		dSprite.spriteSheet.image.Debug(100, 100);

		dSprite.Draw(Mili.MiliEngine.renderer!, new Mili.Vec2(50, 50));
	});
}

Mili.Dev();
Mili.OnLoad(main);

(window as any).Mili = Mili;