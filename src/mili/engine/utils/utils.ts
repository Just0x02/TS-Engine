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