import { Widget } from './widget';
import { MiliImage } from '../gfx/image';
import { Renderer } from 'src/mili/renderer';
import { Vec2 } from '../geometry/vec';

export class ImageWidget extends Widget
{
	public image: MiliImage;

	constructor(
		id: string,
		width: number,
		height: number,
		pos: Vec2,
		image: MiliImage
	)
	{
		super(id, pos, width, height);

		this.image = image;
	}

	// public static override Create<T extends ImageWidget, X extends typeof this, K extends ConstructorParameters<X>>(...args: K): T 
	// {
	// 	return super.Create(...args as any);	
	// }
}