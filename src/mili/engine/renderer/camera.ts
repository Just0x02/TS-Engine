import { IObservable } from './observable';
import { Vec2 } from '../geometry/vec';

export class Camera implements IObservable
{
	public pos: Vec2;
	public zoom: number = 1.0;

	constructor(
		pos: Vec2,
		zoom: number = 1.0
	)
	{
		this.pos = pos;
		this.zoom = zoom;
	}
}