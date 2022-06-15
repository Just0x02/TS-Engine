import { SpriteSheet, SpriteSheetMeta } from './spritesheet';
import { Lazy } from '../utils/lazy';
import { Sprite } from './sprite';
import { IDrawable } from './drawable';
import { Renderer } from '../../renderer';
import { Vec2 } from '../geometry/vec';

// Instead of making all subsprites at once this will dynamically load them
// based on it's current FrameIndex
export class DynamicSprite implements Lazy.ILazy
{
	private _frameIndex: number = 0;
	
	public isLoaded: Promise<void>;
	
	public spriteSheet: SpriteSheet = null as unknown as any;

	constructor(meta: string | SpriteSheetMeta | SpriteSheet, startingIndex: number = 0)
	{
		this._frameIndex = startingIndex;

		this.isLoaded = new Promise<void>(async resolve => {
			if (!(meta instanceof SpriteSheet)) this.spriteSheet = await SpriteSheet.LoadSheetMeta(meta, false);
			else this.spriteSheet = meta;

			resolve(void 0);
		});
	}

	public set FrameIndex(value: number)
	{
		this._frameIndex = value % this.spriteSheet.size;
	}

	public get FrameIndex(): number
	{
		return this._frameIndex;
	}

	public async Draw(renderer: Renderer, at: Vec2)
	{
		const spriteIndex: Vec2 = this.spriteSheet.AsSpriteIndex(this._frameIndex);

		renderer.ctx.drawImage(
			this.spriteSheet.image.htmlImage,
			spriteIndex.x, spriteIndex.y, this.spriteSheet.spriteSize.width, this.spriteSheet.spriteSize.height,
			at.x, at.y, this.spriteSheet.spriteSize.width, this.spriteSheet.spriteSize.height
		);
	}

	public static async Load(meta: string): Promise<DynamicSprite>
	{
		let dSprite: DynamicSprite = new DynamicSprite(meta);

		await dSprite.isLoaded;

		return dSprite;
	}
}