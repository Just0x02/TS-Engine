import { ChildProcess, ChildProcessWithoutNullStreams, execFile, spawn } from "child_process";
import * as path from 'path';
import { Debugger } from "../../engine/utils/debug";
import { MiliEngine } from "../../mili";

@Debugger.expose_class()
export class ScriptManager
{
	private static readonly editorScriptFile: string = path.resolve(MiliEngine.RootDir, 'open_in_editor.sh');
	private static vsCodeInstance: Nullable<ChildProcess> = null;

	@Debugger.watch()
	public static getScriptEditorProcess(): ChildProcess
	{
		if (this.vsCodeInstance && !this.vsCodeInstance.killed) return this.vsCodeInstance;

		this.vsCodeInstance = execFile(
			"bash", [this.editorScriptFile, "./"]
		);

		this.vsCodeInstance.on('exit', () => this.vsCodeInstance = null);
		this.vsCodeInstance.on('close', () => this.vsCodeInstance = null);
		this.vsCodeInstance.on('error', () => this.vsCodeInstance = null);

		return this.vsCodeInstance;
	}

	@Debugger.watch()
	public static isScriptEditorOpen(): boolean
	{
		return this.vsCodeInstance != null;
	}
}