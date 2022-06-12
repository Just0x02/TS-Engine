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

	public Mul(x: number | IPosition, y: number = 0): Vec2
	{
		if (typeof x !== 'number')
		{
			y = x.y;
			x = x.x;
		}

		return new Vec2(this.x * x, this.y * y);
	}

	public static Mul(a: IPosition, b: IPosition): Vec2
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

	public static get ZERO(): Vec2
	{
		return new Vec2();
	}
}
