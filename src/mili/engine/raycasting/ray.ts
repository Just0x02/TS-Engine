import { IPosition } from '../pos';

export class Ray2d implements IPosition
{
	public x: number;
	public y: number;
	public angle: number;
	public xOffset: number;
	public yOffset: number;

	constructor(
		x: number,
		y: number,
		angle: number,
		xOffset: number,
		yOffset: number
	)
	{
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
	}
}