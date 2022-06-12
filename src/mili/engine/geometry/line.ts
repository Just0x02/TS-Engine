import { Vec2 } from '../vec';

export class Line
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

	public Intersects(other: Line): boolean
	{
		let t: number = Vec2.IntersectionFractionOf(this.start, this.end, other.start, other.end);

		return t > 0;
	}

	public IntersectsAt(other: Line): Nullable<Vec2>
	{
		return Vec2.IntersectionOf(
			this.start, this.end,
			other.start, other.end
		);
	}
}