import { IRect } from "../geometry/rect";
import { MiliImage } from '../image';
import { Sprite } from "./sprite";
import { ReadJSON } from "../utils/utils";
import { CanvasBuffer } from "../canvasbuffer";
import { Vec2 } from "../vec";

export interface SpriteSheetMeta
{
	source: string,
	spriteMeta: IRect,
	rows: number,
	columns: number,
	scale?: number
	borderWidth?: number,
	spacingWidth?: number,
};

export type SpriteSheetIndex = { row: number, column: number } | [number, number] | Vec2;

export class SpriteSheet
{
	public image: MiliImage;

	public spriteSize: IRect;

	public borderWidth: number;
	public spacingWidth: number;
	public rows: number;
	public columns: number;

	public subSprites: Sprite[] = [];

	constructor(
		image: MiliImage,
		spriteSize: IRect,
		borderWidth: number,
		spacingWidth: number,
		columns: number,
		rows: number,
	)
	{
		this.image = image;
		this.spriteSize = spriteSize;
		
		this.borderWidth = borderWidth;
		this.spacingWidth = spacingWidth;
		
		this.columns = columns;
		this.rows = rows;
	}

	public AsSpriteIndex(col: number, row?: number): Vec2
	{
		if (row === undefined)
			row = Math.floor(col / this.columns);

		col %= this.columns;
		row %= this.rows;

		return new Vec2(
			this.borderWidth + col * (this.spacingWidth + this.spriteSize.width),
			this.borderWidth + row * (this.spacingWidth + this.spriteSize.height),
		);
	}

	public async SubSprite(col: number, row: number, buffer?: CanvasBuffer): Promise<Sprite>
	{
		let cBuffer: CanvasBuffer = buffer ?? new CanvasBuffer();
		let spriteIndex: Vec2 = this.AsSpriteIndex(col, row);

		cBuffer.canvas.width = this.spriteSize.width;
		cBuffer.canvas.height = this.spriteSize.height;

		cBuffer.ctx.drawImage(this.image.htmlImage, spriteIndex.x, spriteIndex.y, this.spriteSize.width, this.spriteSize.height, 0, 0, this.spriteSize.width, this.spriteSize.height);

		const image: MiliImage = await MiliImage.Load(cBuffer.canvas.toDataURL('image/png'));

		cBuffer.Close();

		return new Sprite(
			image, this.spriteSize.width, this.spriteSize.height
		);
	}

	public async MakeSubSprites(): Promise<Sprite[]>
	{
		let canvasBuffer: CanvasBuffer = new CanvasBuffer();
		
		for (let row = 0; row < this.rows; row++)
		{
			for (let col = 0; col < this.columns; col++)
			{
				this.subSprites.push(
					await this.SubSprite(col, row, canvasBuffer)
				);

				console.log(`MADE SUBSPRITE: `, col, row);
				console.log(this.subSprites[this.subSprites.length - 1]);

				this.subSprites[this.subSprites.length - 1].image.Debug((col * this.spriteSize.width) + 100, (row * this.spriteSize.height) + 100);
			}
		}

		canvasBuffer.Close();

		return this.subSprites;
	}

	public static async LoadSheetMeta(source: string | SpriteSheetMeta, autoCreateSubSprites: boolean = false): Promise<SpriteSheet>
	{
		let meta: SpriteSheetMeta;
		
		if (typeof source === 'string')
			meta = ReadJSON<SpriteSheetMeta>(source);
		else
			meta = source;

		console.log(`Loaded Meta:`, meta);

		const sourceImage: MiliImage = await MiliImage.Load(meta.source);

		let spriteSheet: SpriteSheet = new SpriteSheet(
			sourceImage, meta.spriteMeta,
			meta.borderWidth ?? 0, meta.spacingWidth ?? 0, 
			meta.columns, meta.rows
		);

		if (autoCreateSubSprites)
			await spriteSheet.MakeSubSprites();

		return spriteSheet;
	}
}