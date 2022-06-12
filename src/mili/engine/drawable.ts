import { Vec2 } from './vec';
import { Renderer } from '../renderer';

export interface IDrawable
{
	Draw(renderer: Renderer, at: Vec2): Promise<void>
};