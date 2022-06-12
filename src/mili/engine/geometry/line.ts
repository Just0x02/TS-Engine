import { Vec2 } from '../vec';
import { Renderer, IRenderable } from '../../renderer';
import { IDrawable } from '../drawable';

export class Line implements IDrawable
{
	public start: Vec2;
	public end: Vec2; 

	constructor(
		start: Vec2,
		end:   Vec2
	) 
	{
		this.start = start;
		this.end = end;
	}

	public get Path(): Path2D
	{
		let path: Path2D = new Path2D();

		path.moveTo(this.start.x, this.start.y);
		path.lineTo(this.end.x, this.end.y);

		return path;
	}


	public Intersects(other: Line): boolean
	{
		let t: number = Vec2.IntersectionFractionOf(this.start, this.end, other.start, other.end);

		return t > 0;
	}

	public IntersectsAt(other: Line): Nullable<Vec2> // Point of intersection
	{
		return Vec2.IntersectionOf(
			this.start, this.end,
			other.start, other.end
		);
	}
}