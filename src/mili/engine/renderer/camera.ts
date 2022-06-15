import { IObservable } from './observable';
import { Vec2 } from '../geometry/vec';
import { Renderer } from './renderer';

export class Camera implements IObservable
{
	public pos: Vec2;
	public zoom: number = 1.0;
	public renderer: Renderer;

	constructor(
		pos: Vec2,
		zoom: number = 1.0,
		renderer: Renderer
	)
	{
		this.pos = pos;
		this.zoom = zoom;
		this.renderer = renderer;
	}
}