export class WASMModule
{
	public readonly source: WebAssembly.WebAssemblyInstantiatedSource;
	public readonly imports: Readonly<WebAssembly.Imports>;

	constructor(source: WebAssembly.WebAssemblyInstantiatedSource, imports: WebAssembly.Imports)
	{
		this.source = source;
		this.imports = imports;
	}

	public get Exports(): WebAssembly.Exports
	{
		return this.source.instance.exports;
	}
}