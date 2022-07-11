import { IRect } from '../geometry/rect';
import { IRenderable, Renderer } from '../renderer/renderer';
import { Sprite } from './sprite';
import { IPosition } from '../geometry/pos';
import { Vec2 } from '../geometry/vec';
import { IObservable } from '../renderer/observable';
import { IDrawable } from './drawable';

export interface TileEntry
{
	spriteSrc?: string
};

// TODO: Fix this shit
export class Tilemap implements Readonly<IRect>
{
	public readonly width: number;
	public readonly height: number;
	
	public readonly tileColumns: number;
	public readonly tileRows: number;

	public readonly tileSize: number; // Tile size in pixels
	
	private tiles: string[][];
	private cachedTileSprites: Record<string, Sprite> = {};

	constructor(
		tileSize: number,
		tileColumns: number,
		tileRows: number,
		tileIndex: Index<TileEntry>
	)
	{
		this.tileSize = tileSize;

		this.tileColumns = tileColumns;
		this.tileRows = tileRows;
		
		this.width = this.tileSize * this.tileColumns;
		this.height = this.tileSize * this.tileRows;

		this.tiles = Array(this.tileColumns).fill(Array(this.tileRows)).fill(0);

		this.RebuildCache();
	}	

	public RebuildCache(): void
	{
		
	}

	public At(x: number | IPosition, y: number = 0): string
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		return this.tiles[y][x];
	}

	public async Draw(renderer: Renderer, offset: Vec2 = Vec2.ZERO, scale?: number): Promise<void>
	{
		let tileOffset: Vec2 = Vec2.ZERO;

		for (let y = 0; y < this.tileRows; y++)
		{
			for (let x = 0; x < this.tileColumns; x++)
			{
				let tileKey: string = this.At(tileOffset); 
				tileOffset.x += this.tileSize;
			}

			tileOffset.x = 0;
			tileOffset.y += this.tileSize;
		}
	}
}