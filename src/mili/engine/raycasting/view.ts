import { IObservable } from '../observable';
import { DegToRad, RadToDeg } from '../utils/utils';
import { Vec2 } from '../vec';
import { Ray2d } from './ray';
import { Renderer, IRenderable } from '../../renderer';
import { Line } from '../geometry/line';

export class Ray2dView implements IObservable, IRenderable
{
	// public fov: number;
	public pos: Vec2;
	public rays: Ray2d[] = [];

	constructor(
		pos: Vec2 = new Vec2()
	)
	{
		this.pos = pos;
		this.rays = [];

		for (let deg = 0; deg < 360; deg++)
		{
			this.rays[deg] = new Ray2d(this.pos, DegToRad(deg));
		}
	}

	public async Look(renderer: Renderer, walls: Line[])
	{
		for (let i = 0; i < this.rays.length; i++)
		{
			const ray: Ray2d = this.rays[i];

			let closest: Nullable<Vec2> = null;
			let record: number = Infinity;

			for (let wall of walls)
			{
				let intersect: Nullable<Vec2> = ray.Cast(wall);

				if (!intersect) continue;

				const dist: number = this.pos.DistanceTo(intersect);

				if (dist < record)
				{
					record = dist;
					closest = intersect;
				}
			}

			// BUG: Rays facing both down and up won't hit any walls? 
			if (closest)
			{
				renderer.ctx.strokeStyle = "#ffffff99";
				renderer.ctx.lineWidth = 2;

				renderer.ctx.beginPath();
				renderer.ctx.moveTo(this.pos.x, this.pos.y);
				renderer.ctx.lineTo(closest.x, closest.y);
				renderer.ctx.stroke();

				// if (ray.angle == (Math.PI / 2))
				// {
				// 	console.log(`DOWN-FACING RAY -> ${closest} (${ray})`);
				// }
			}
		}
	}

	public async Render(renderer: Renderer)
	{
		renderer.ctx.fillStyle = "#8f8";
		renderer.ctx.beginPath();
		renderer.ctx.arc(this.pos.x, this.pos.y, 8, 0, Math.PI * 2, false);
		renderer.ctx.fill();

		// renderer.ctx.strokeStyle = "#fff";
		// renderer.ctx.lineWidth = 2;

		// for (let ray of this.rays)
		// {
		// 	let rayLine: Line = ray.Line;
		// 	rayLine.end = rayLine.end.Multiply(10, 10);
		// }
	}
}