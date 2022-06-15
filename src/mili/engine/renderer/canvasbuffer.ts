import { IPosition } from "../geometry/pos";
import { IRect } from '../geometry/rect';
import { MiliImage } from '../gfx/image';
import { Debugger } from "../utils/debug";

export type ImageRenderingType = 'auto' | 'pixelated' | 'crisp-edges';

export class CanvasBuffer implements Readonly<IRect>
{
	public static readonly RENDERING_TYPE: ImageRenderingType = 'pixelated';

	public canvas: HTMLCanvasElement = document.createElement('canvas');
	public ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;

	constructor(
		width?: number, height?: number
	) 
	{
		if (width)
			this.canvas.width = width;

		if (height)
			this.canvas.height = height;
	}

	public get width(): number { return this.canvas.width; }
	public get height(): number { return this.canvas.height; }

	public Resize(newSize: Partial<IRect>): this
	{
		if (newSize.width)  this.canvas.width  = newSize.width;
		if (newSize.height) this.canvas.height = newSize.height;

		return this;
	}

	public DisplayOn(base: HTMLElement, resizeToFit?: boolean): void
	{
		base.appendChild(this.canvas);

		if (resizeToFit)
		{
			let css: string = `position: absolute; left: 0; top: 0; width: ${this.canvas.width}px; height: ${this.canvas.height}px; image-rendering: ${CanvasBuffer.RENDERING_TYPE};`;
			this.canvas.style.cssText = css;
		}
	}

	public Clear(): void
	{
		// Store the current transformation matrix
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Restore the transform
		this.ctx.restore();
	}

	// Manually flag canvas and ctx to be deleted by garbage collector
	// but this could potentially cause UB... so... i dunno
	@Debugger.watch()
	public Close(): void
	{
		this.canvas = null as any;
		this.ctx = null as any;
	}

	// Closes buffer and returns whatever it had drawn 
	public Flush(at?: IPosition, size?: IRect): ImageData
	{
		const data: ImageData = this.Get(at, size);

		this.Close();

		return data;
	}

	public FlushToImage(): MiliImage
	{
		const dataURL: string = this.canvas.toDataURL('image/png', 1.0);
		const img: MiliImage = new MiliImage(dataURL);

		this.Close();

		return img;
	}

	public Get(at?: IPosition, size?: IRect): ImageData
	{
		return <ImageData> this.ctx.getImageData(
			at?.x ?? 0, at?.y ?? 0, 
			size?.width ?? this.canvas.width, size?.height ?? this.canvas.height, 
			{ colorSpace: 'srgb' }
		);
	}

	public Put(data: ImageData, at?: IPosition): void
	{
		this.ctx.putImageData(data, at?.x ?? 0, at?.y ?? 0);
	}

	public static From(parentBuffer: CanvasBuffer, offset?: IPosition, size?: IRect): CanvasBuffer
	{
		let tmp: CanvasBuffer = new CanvasBuffer(size?.width ?? parentBuffer.canvas.width, size?.height ?? parentBuffer.canvas.height);
		
		tmp.Put(
			parentBuffer.Get(
				offset, size
			)
		);

		return tmp;
	}
}