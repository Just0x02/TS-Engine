import { IPosition } from './pos';
import { Clamp } from './utils/utils';
import { Immutable } from './utils/immutable';
import { IObservable } from './observable';

export class Vec2
{
	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0)
	{
		this.x = x;
		this.y = y;
	}

	public AsImut(): Vec2
	{
		return Immutable(this.Copy());
	}

	//////////////////////////////////////////////////////

	public Clear(): Vec2
	{
		this.x = this.y = 0;
		
		return this;
	}

	public Copy(): this
	{
		return new (this.constructor as ConstructorOf<this>)(this.x, this.y);
	}

	//////////////////////////////////////////////////////

	public Add(x: number | IPosition, y: number = 0): Vec2
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		return new Vec2(this.x + x, this.y + y);
	}

	public static Add(a: IPosition, b: IPosition): Vec2
	{
		return new Vec2(a.x + b.x, a.y + b.y);
	}

	public Dot(x: number | IPosition, y: number = 0): Vec2
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		return new Vec2(this.x * x, this.y * y);
	}

	public static Dot(a: IPosition, b: IPosition): Vec2
	{
		return new Vec2(a.x * b.x, a.y * b.y);
	}

	//////////////////////////////////////////////////////

	public ClampX(min: number, max: number): Vec2
	{
		this.x = Clamp(min, this.x, max);

		return this;
	}

	public ClampY(min: number, max: number): Vec2
	{
		this.y = Clamp(min, this.y, max);

		return this;
	}

	public Clamp(...between: [IPosition, IPosition]): Vec2
	{
		const pos1: IPosition = between[0];
		const pos2: IPosition = between[1];

		return this
				.ClampX(pos1.x, pos2.x)
				.ClampY(pos1.y, pos2.y); 
	}
	
	//////////////////////////////////////////////////////

	public DistanceTo(other: IPosition): number
	{
		return Math.sqrt((other.x - this.x) ** 2 + (other.x - this.x) ** 2)
	}

	public Length(): number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	//////////////////////////////////////////////////////


	public Round(roundingCB: (coord: number) => number = Math.round): Vec2
	{
		this.x = roundingCB(this.x);
		this.y = roundingCB(this.y);

		return this;
	}

	public Normalize(): Vec2
	{
		let len: number = this.x * this.x + this.y * this.y;

		if (len > 0)
		{
			len = 1 / Math.sqrt(len);

			this.x *= len;
			this.y *= len;
		}

		return this;
	}

	public Reflect(pivot: IPosition): Vec2
	{
		let dot: number = this.x * pivot.x + this.y * pivot.y;

		this.x = this.x - 2 * pivot.x * dot;
		this.y = this.y - 2 * pivot.y * dot;

		return this;
	}


	//////////////////////////////////////////////////////

	public static From(position: IPosition | IObservable): Vec2
	{
		if ((<Index> position).pos !== undefined)
		{
			position = position as IObservable;
			return new Vec2(position.pos.x, position.pos.y);
		}

		position = position as IPosition;
		return new Vec2(position.x, position.y);
	}

	public static FromAngle(angle: number, length: number = 1): Vec2
	{
		return new Vec2(Math.cos(angle) * length, Math.sin(angle) * length);
	}

	public static Lerp(a: IPosition, b: IPosition, t: number): Vec2
	{
		return new Vec2(
			a.x + t * (b.x - a.x),
			a.y + t * (b.y - a.y)
		);
	}

	public static IntersectionFractionOf(point0: IPosition, point1: IPosition, point2: IPosition, point3: IPosition): number
	{
		const seg1: Vec2 = new Vec2(point1.x - point0.x, point1.y - point0.y);
		const seg2: Vec2 = new Vec2(point3.x - point2.x, point3.y - point2.y);

		let s: number, t: number, segProd: number = (-seg2.x * seg1.y + seg1.x * seg2.y);

		s = (-seg1.y * (point0.x - point2.x) + seg1.x * (point0.y - point2.y)) / segProd;
		t = ( seg2.x * (point0.y - point2.y) - seg2.y * (point0.x - point2.x)) / segProd;

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) // Collision detected
		{ 
			return t;
		}

		return -1; // No collision
	}

	public static IntersectionOf(point0: IPosition, point1: IPosition, point2: IPosition, point3: IPosition): Nullable<Vec2>
	{
		let t: number = Vec2.IntersectionFractionOf(point0, point1, point2, point3);

		if (t < 0) return null;

		let intersection: Vec2 = new Vec2(
			point0.x + (t * (point1.x - point0.x)),
			point0.y + (t * (point1.y - point0.y))
		);

		return intersection;
	}

	public static get ZERO(): Vec2
	{
		return new Vec2();
	}
}
