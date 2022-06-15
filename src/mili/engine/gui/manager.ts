import { Widget } from './widget';
import { MiliImage } from '../gfx/image';
import { Vec2 } from '../geometry/vec';

/**
 * Uses a ECS system because making each individual widget is gonna be a fucking headache.
 */
export class GUI
{
	private static _instance: GUI = new GUI;
	public static getInstance(): GUI { return this._instance; }
	private constructor() {}
}