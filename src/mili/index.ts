export * from './mili';
export * from './renderer';
export * from './window/window';
export * from './editor/scripting/manager';
export * from './engine/sprite/spritesheet';
export * from './engine/sprite/sprite';
export * from './engine/sprite/dynamic-sprite';
export * from './engine/vec';
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