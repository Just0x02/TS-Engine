export * from './mili';
export * from './engine/renderer/renderer';
export * from './window/window';
export * from './editor/scripting/manager';
export * from './engine/gfx/spritesheet';
export * from './engine/gfx/sprite';
export * from './engine/gfx/dynamic-sprite';
export * from './engine/geometry/vec';
export * from './engine/utils/utils';
export * from './engine/raycasting/ray';
export * from './engine/raycasting/view';
export * from './engine/geometry/rect';
export * from './engine/geometry/line';
export * from './editor/editor';

import { Editor } from './editor/editor';
import { WindowEvents } from './window/window';
export function OnLoad(cb: () => any) { WindowEvents.onReady(cb); };
export function Dev() { Editor.Open(); };