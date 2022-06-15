import { IRect } from '../geometry/rect';
import { IRenderable, Renderer } from '../../renderer';
import { Sprite } from './sprite';
import { IPosition } from '../geometry/pos';
import { Vec2 } from '../geometry/vec';
import { IObservable } from '../renderer/observable';
import { IDrawable } from './drawable';

// export class Tile implements Readonly<IRect>, IDrawable, IObservable
// {
// 	public readonly width: number;
// 	public readonly height: number;
// 	public readonly mapPosition: Vec2 = new Vec2(); // Position in tile map
// 	public readonly pos: Vec2 = new Vec2(); // Position on screen

// 	constructor(
// 		size: number,
// 		mapPos: IPosition,
// 		at: Vec2
// 	)
// 	{
// 		this.width = size;
// 		this.height = size;
// 	}
	
// 	Draw(renderer: Renderer, at: Vec2): Promise<void> {
// 		throw new Error('Method not implemented.');
// 	}

// 	public async Render(renderer: Renderer)
// 	{
		
// 	}
// }

// TODO: Fix this shit
export class Tilemap implements Readonly<IRect>
{
	public readonly width: number;
	public readonly height: number;
	
	public readonly tileColumns: number;
	public readonly tileRows: number;

	public readonly tileSize: number; // Tile size in pixels
	
	private tiles: number[][];

	constructor(
		tileSize: number,
		tileColumns: number,
		tileRows: number,
	)
	{
		this.tileSize = tileSize;

		this.tileColumns = tileColumns;
		this.tileRows = tileRows;
		
		this.width = this.tileSize * this.tileColumns;
		this.height = this.tileSize * this.tileRows;

		this.tiles = Array(this.tileColumns).fill(Array(this.tileRows)).fill(0);
	}

	public At(x: number | IPosition, y: number = 0)
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		return this.tiles[y][x];
	}
}