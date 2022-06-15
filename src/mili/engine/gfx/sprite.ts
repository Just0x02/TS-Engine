import { IDrawable } from './drawable';
import { IRect } from '../geometry/rect';
import { MiliImage } from './image';
import { Renderer } from '../renderer/renderer';
import { Vec2 } from '../geometry/vec';

export class Sprite implements IRect
{
	public image: MiliImage;

	constructor(
		image: MiliImage,
		width?: number,
		height?: number
	)
	{
		this.image = image;

		if (width) this.width = width;
		if (height) this.height = height;
	}

	public get width(): number { return this.image.width; }
	public get height(): number { return this.image.height; }
	
	public set width(value: number) { this.image.width = value; }
	public set height(value: number) { this.image.height = value; }

	public async Draw(renderer: Renderer, at: Vec2)
	{
		renderer.ctx.drawImage(this.image.htmlImage, at.x, at.y);
	}
}