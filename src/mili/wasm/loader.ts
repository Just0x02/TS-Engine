import { WASMModule } from './module';
import fs from 'fs';

export class WASMLoader
{
	public static async Mount(src: string, imports: WebAssembly.Imports): Promise<WASMModule>
	{
		return new WASMModule(await WebAssembly.instantiate(fs.readFileSync(src), imports), imports);
	}
}