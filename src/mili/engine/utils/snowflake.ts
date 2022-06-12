import { v4 } from './uuid';

export interface Snowflake
{
	readonly id: SnowflakeID
};

export class SnowflakeID
{
	protected uuid: string = v4();

	public get UUID(): string
	{
		return this.uuid;
	}

	public is(other: Snowflake | SnowflakeID): boolean
	{
		if (other instanceof SnowflakeID)
			return other.uuid == this.uuid;
		return other.id.uuid == this.uuid;
	}

	public override(newId: string): void
	{
		this.uuid = newId; 
	}

	public toString(): string
	{
		return this.uuid;
	}
}