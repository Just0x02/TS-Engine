import { IPosition } from '../pos';
import { IObservable } from '../observable';
import { Vec2 } from '../vec';
import { Line } from '../geometry/line';
import { Renderer } from 'src/mili/renderer';
import { IRenderable } from '../../renderer';

export class Ray2d implements IObservable
{
	public pos: Vec2;
	public angle: number;
	public dir: Vec2; // Direction

	constructor(
		pos: Vec2,
		angle: number
	)
	{
		this.pos = pos;
		this.angle = angle;
		this.dir = Vec2.FromAngle(angle);
	}

	public get Line(): Line
	{
		return new Line(this.pos, new Vec2(this.pos.x + this.dir.x, this.pos.y + this.dir.y));
	}

	public LookAt(x: number | IPosition, y: number = 0)
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		this.dir.Set(
			x - this.pos.x,
			y - this.pos.y
		).Normalize();
	}

	public Cast(wall: Line): Nullable<Vec2> // Returns point of intersection
	{
		let ray: Line = this.Line;

		const denom: number = ((wall.start.x - wall.end.x) * (ray.start.y - ray.end.y) - (wall.start.y - wall.end.y) * (ray.start.x - ray.end.x));

		if (denom == 0) return null;

		const t: number = ((wall.start.x - ray.start.x) * (ray.start.y - ray.end.y) - (wall.start.y - ray.start.y) * (ray.start.x - ray.end.x)) / denom;
		const u: number = -((wall.start.x - wall.end.x) * (wall.start.y - ray.start.y) - (wall.start.y - wall.end.y) * (wall.start.x - ray.start.x)) / denom;

		if (t > 0 && t < 1 && u > 0) 
			return Vec2.Lerp(
				wall.start, wall.end, t
			);

		return null;
	}

	public toString(): string
	{
		return `Ray2d(starts: ${this.pos}, ends: ${this.pos.Add(this.dir)})`;
	}
}