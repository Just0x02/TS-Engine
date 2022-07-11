import { IRect } from "../geometry/rect";
import fs from 'fs';
import path from 'path';
import { MiliEngine } from "../../mili";
import { Lazy } from '../utils/lazy';
import { Debugger } from "../utils/debug";
import Settings from '../../../../mili-settings.json';

// My own take on image loading and such
export class MiliImage implements IRect, Lazy.ILazy
{
	public static readonly USE_CACHE: boolean = Settings.engine.cache_images;
	public static readonly ImageCache: Index<MiliImage> = {};
	public readonly source: string;

	public htmlImage: HTMLImageElement;
	public isLoaded: Promise<void>;

	constructor(
		source: string | HTMLImageElement
	)
	{
		if (source instanceof HTMLImageElement)
		{
			this.htmlImage = source;
			source = this.htmlImage.src;
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

		this.source = source;
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

	public static CacheContainsSource(src: string): boolean
	{
		return Object.keys(MiliImage.ImageCache).includes(src);
	}

	@Debugger.time()
	public static async Load(source: string | HTMLImageElement): Promise<MiliImage>
	{
		if (MiliImage.USE_CACHE)
		{
			let cacheCheck: Nullable<MiliImage> = MiliImage.ImageCache[<string> source];
			if (cacheCheck) return cacheCheck;
		}

		const img: MiliImage = new MiliImage(source);

		await img.isLoaded;

		if (MiliImage.USE_CACHE) MiliImage.ImageCache[typeof source === 'string' ? source : source.src] = img;

		return img;
	}
}