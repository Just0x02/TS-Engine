import { SpriteSheet } from './mili/engine/sprite/spritesheet';
declare global {
	type ConstructorOf<T, K extends readonly any[] = any[]> = { new (...args: K): T };
	type NeverNull<T> = T extends null ? never : T extends void ? never : T;
	type Nullable<T> = T | null;
	type Soon<T> = T extends undefined ? T : T;
	type Constructor = ConstructorOf<{}>;
	type ForcedCast<IS, EXPECTED> = IS extends EXPECTED ? EXPECTED : EXPECTED; 

	interface Index<T = any> { [ index: string ]: T }
	type IsEqual<T, U> =
	(<G>() => G extends T ? 1 : 2) extends
	(<G>() => G extends U ? 1 : 2)
		? true
		: false;

	type IteratorInt = { [Symbol.iterator](): IterableIterator<number>; };


	function ForcedCast<TO>(x?: any): TO;
	function sleep(ms: number): Promise<void>;

	function DebugSpriteSheet(source: string): Promise<void>;
}

(window as any).DebugSpriteSheet = async function (source: string): Promise<void> 
{
	await SpriteSheet.LoadSheetMeta(`./data/resources/${source}.mili.json`, true); 	
};

(window as any).ForcedCast = function<TO>(x?: any): TO
{
	return x;
};

(window as any).sleep = function(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); };

export {};