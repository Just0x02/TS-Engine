import { IRenderable, Renderer } from '../../renderer';
import { IRect, Rect } from '../geometry/rect';
import { IObservable } from '../renderer/observable';
import { Vec2 } from '../geometry/vec';

export interface IWidgetEvents
{
	onReady(): any,
	onClick(ev: MouseEvent): any,
	onMouseOver(ev: MouseEvent): any,
	onMouseLeave(ev: MouseEvent): any,
}

export class Widget extends Rect implements IRenderable, IRect, IObservable, IWidgetEvents
{
	public id: string;
	public zIndex: number = 0;
	public children: Widget[];

	constructor(
		id: string,
		pos: Vec2,
		width: number,
		height: number,
		...children: Widget[]
	)
	{
		super(pos, width, height);
		this.id = id;
		this.children = children;
	}

	public async Render(renderer: Renderer): Promise<void>
	{
		renderer.ctx.fillStyle = "red";

		renderer.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}

	public onReady()                    {};
	public onClick(ev: MouseEvent)      {};
	public onMouseOver(ev: MouseEvent)  {};
	public onMouseLeave(ev: MouseEvent) {};

	// magic or spaghetti? You decide
	public static Create<T extends Widget, X extends typeof this>(...args: ConstructorParameters<X>): T { return new (this as any)(...args); }
}