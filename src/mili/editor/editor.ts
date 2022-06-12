import { ScriptManager } from './scripting/manager';
import { WindowEvents } from '../window/window';
import { Debugger } from '../engine/utils/debug';

@Debugger.expose_class()
export class Editor
{
	public static EDITOR_MODE: boolean = false; 

	@Debugger.watch()
	public static Open(): void
	{
		this.EDITOR_MODE = true;
		WindowEvents.onKey('~', () => this.ToggleEditor());
	}

	@Debugger.watch()
	public static async ToggleEditor(): Promise<void>
	{
		if (!this.EDITOR_MODE) return;

		if (ScriptManager.isScriptEditorOpen())
		{
			console.log(`Script editor is already open...`);
		}
		else
		{
			console.log(`Opening script editor...`);
			ScriptManager.getScriptEditorProcess();
		}
	}
}