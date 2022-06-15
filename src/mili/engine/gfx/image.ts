import { IRect } from "../geometry/rect";
import fs from 'fs';
import path from 'path';
import { MiliEngine } from "../../mili";
import { Lazy } from '../utils/lazy';
import { Debugger } from "../utils/debug";

// My own take on image loading and such
export class MiliImage implements IRect, Lazy.ILazy
{
	public readonly source: string | HTMLImageElement;

	public htmlImage: HTMLImageElement;
	public isLoaded: Promise<void>;

	constructor(
		source: string | HTMLImageElement
	)
	{
		this.source = source;


		if (source instanceof HTMLImageElement)
		{
			this.htmlImage = source;
		}
		else if (source.startsWith('data:image/png'))
		{
			this.htmlImage = new Image();
			this.htmlImage.src = source;
		}
		else
		{
			this.htmlImage = new Image();
			this.htmlImage.src = 'data:image/png;base64,' + fs.readFileSync(path.resolve(MiliEngine.RootDir, source), 'base64');
		}

		this.isLoaded = Lazy.Attach<HTMLImageElement>(this, this.htmlImage);
	}

	public get width(): number { return this.htmlImage.width; }
	public get height(): number { return this.htmlImage.height; }

	public set width(value: number) { this.htmlImage.width = value; }
	public set height(value: number) { this.htmlImage.height = value; }

	public get Size(): IRect { return { width: this.htmlImage.width, height: this.htmlImage.height }; }
	public set Size(value: IRect) { this.htmlImage.width = value.width; this.htmlImage.height = value.height; }

	public Debug(x: number, y: number) 
	{
		const div = document.createElement('div');
		div.style.cssText = `position: absolute; left: ${x}px; top: ${y}px; z-index: 100000;`;

		div.appendChild(this.htmlImage);
		document.body.appendChild(div);
	}

	@Debugger.watch()
	public static async Load(source: string | HTMLImageElement): Promise<MiliImage>
	{
		const img: MiliImage = new MiliImage(source);

		await img.isLoaded;

		return img;
	}
}