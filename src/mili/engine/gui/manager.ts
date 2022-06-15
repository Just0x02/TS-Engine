import { Widget } from './widget';
import { ImageWidget } from './img';
import { MiliImage } from '../gfx/image';
import { Vec2 } from '../geometry/vec';


export class GUI
{
	// public static root: Widget = Widget.Create("root", new Vec2(0, 0), 100, 100);
	// public static test: ImageWidget = ImageWidget.Create("test-image", 200, new Vec2(0, 0), new MiliImage("./data/resources/drawing.png"));
	// public static test: ImageWidget = GUI.Create(ImageWidget, 50, 50, new Vec2(150, 150), new MiliImage("./data/resources/drawing.png"));

	// magic or spaghetti? You decide
	// public static Create<T extends Widget>(type: T): ConstructorOf<T>
	// {
	// 	const typeConstructor: ConstructorOf<T> = type.constructor as ConstructorOf<T>;

	// 	return typeConstructor;
	// }
}