export namespace Lazy
{
	export interface ILazy
	{
		isLoaded: Promise<void>
	};

	export function Attach<T extends GlobalEventHandlers>(target: ILazy, loadable: T): Promise<void>
	{
		return target.isLoaded = new Promise<void>(resolve => {
			loadable.onload = async () => resolve(void 0);
		});
	}
}
