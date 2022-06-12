import fs from 'fs';
import * as path from 'path';
import { MiliEngine } from '../../mili';

export function ReadJSON<T>(source: string, validate?: (jsonObj: T) => boolean): T
{
	const rawJSON: string = fs.readFileSync(path.resolve(MiliEngine.RootDir, source), 'utf-8');
	const jsonObj: any = JSON.parse(rawJSON);

	if (validate && !validate(jsonObj)) throw `Incorrectly formatted json was read. ${source} -> ${rawJSON} -> ${jsonObj}`; 

	return jsonObj as T;
}

export function Clamp(min: number, x: number, max: number): number
{
	return Math.min(Math.max(x, min), max);
}

export function IsBetween(min: number, x: number, max: number): boolean
{
	return x >= min && x <= max;
}

export function Lerp(a: number, b: number, t: number = 0.5): number
{
	return a + (b - a) * t;
}

export function DegToRad(deg: number): number
{
	return deg * (Math.PI / 180);
}

export function RadToDeg(rad: number): number
{
	return rad * (180 / Math.PI);
}

export function random(min: number, max: number): number
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function random0(max: number): number
{
	return random(0, max);
}