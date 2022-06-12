import { Vec2 } from '../vec';
import { IPosition } from '../pos';
import { IsBetween } from '../utils/utils';
import { IObservable } from '../observable';

export interface IRect
{
	width: number,
	height: number
};

export class Rect implements IRect, IObservable
{
	public static readonly TOP_LEFT: Vec2     = new Vec2(0, 0).AsImut();
	public static readonly TOP_RIGHT: Vec2    = new Vec2(1, 0).AsImut();
	public static readonly BOTTOM_LEFT: Vec2  = new Vec2(0, 1).AsImut();
	public static readonly BOTTOM_RIGHT: Vec2 = new Vec2(1, 1).AsImut();

	public readonly TOP_LEFT_OFFSET: Vec2     = Vec2.ZERO.AsImut();
	public readonly TOP_RIGHT_OFFSET: Vec2    = Rect.TOP_RIGHT.Mul(this.width, this.height).AsImut();
	public readonly BOTTOM_LEFT_OFFSET: Vec2  = Rect.BOTTOM_LEFT.Mul(this.width, this.height).AsImut();
	public readonly BOTTOM_RIGHT_OFFSET: Vec2 = Rect.BOTTOM_RIGHT.Mul(this.width, this.height).AsImut();

	constructor(
		public pos: Vec2,
		public width: number,
		public height: number
	)
	{

	}

	public get TopLeft(): Vec2
	{
		return this.pos;
	}

	public get TopRight(): Vec2
	{
		return this.TOP_RIGHT_OFFSET
			.Add(this.pos);
	}

	public get BottomLeft(): Vec2
	{
		return this.BOTTOM_LEFT_OFFSET
			.Add(this.pos);
	}

	public get BottomRight(): Vec2
	{
		return this.BOTTOM_RIGHT_OFFSET
			.Add(this.pos);
	}

	public Contains(pos: IPosition)
	{
		let topLeft: Vec2 = this.TopLeft;
		let bottomRight: Vec2 = this.BottomRight;

		return IsBetween(topLeft.x, pos.x, bottomRight.x) && IsBetween(topLeft.y, pos.y, bottomRight.y);  
	}
}