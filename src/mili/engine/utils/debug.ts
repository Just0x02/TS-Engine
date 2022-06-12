import fs from 'fs';
import * as path from 'path';
import { MiliEngine } from '../../mili';
export namespace Debugger
{
	export enum DebugLevels { ERROR = 0, WARN = 1, DEBUG = 3 };

	export const DEBUG_LEVEL: number = DebugLevels.DEBUG;
	export const USE_STDOUT: boolean = true;
	
	const LOG_OUT_FILE: string = path.resolve(path.resolve(__dirname, "../../../../../"), `./data/logs/${Date.now()}.log`);

	export function _getCallerFile(): Nullable<string> 
	{
		var filename: string | null = null;
	
		var _pst = Error.prepareStackTrace
		Error.prepareStackTrace = function (err, stack) { return stack; };
		try {
			var err: { stack: NodeJS.CallSite[] } = new Error() as any;
			var callerfile;
			var currentfile;
	
			currentfile = err.stack.shift()!.getFileName()!;
	
			while (err.stack.length) {
				callerfile = err.stack.shift()!.getFileName()!;
	
				if(currentfile !== callerfile) {
					filename = callerfile;
					break;
				}
			}
		} catch (err) {}
		Error.prepareStackTrace = _pst;
	
		return filename;
	}

	export function watch(level: DebugLevels = DebugLevels.DEBUG)
	{
		if (DEBUG_LEVEL < level) return function() {};

		return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)
		{
			let method: Function = descriptor.value!;

			descriptor.value = function()
			{
				const returnValue = method.apply(this, Array.from(arguments));
				let callFile: string = _getCallerFile()!;

				if (callFile.length > 10)
					callFile = "..." + callFile.slice(Math.round(callFile.length / 2));

				const logString: string = `[${callFile}][${new Date().toISOString()}][DEBUG][WATCH] >> Method '${propertyKey}' of '${target.constructor.name}' called with arguments: ${Array.from(arguments)} and returned: ${returnValue}`;

				if (USE_STDOUT) console.log(logString);
				else fs.appendFile(LOG_OUT_FILE, logString + "\n", () => {});

				return returnValue;
			}

			return descriptor;
		}
	}

	export function expose(name: string, value: any)
	{
		(window as any)[name] = value;
	}

	export function expose_class()
	{
		return function(x: any)
		{
			expose(x.name, x);

			return x;
		}
	}
}