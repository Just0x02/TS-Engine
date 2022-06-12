export function Immutable<T>(target: T): T
{
	return Object.freeze(target);
}