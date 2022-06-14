import * as path from 'path';
import { MiliEngine } from '../mili';

export function PreloadImage(imageSrc: string, relativeSrc?: boolean): void
{
	const preloadLink: HTMLLinkElement = document.createElement('link');

	preloadLink.rel = "preload";
	preloadLink.as = "image";
	preloadLink.href = relativeSrc ? imageSrc : path.resolve(MiliEngine.RootDir, imageSrc);

	document.head.appendChild(preloadLink);
}