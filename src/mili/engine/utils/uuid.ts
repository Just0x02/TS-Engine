import crypto from 'crypto';
import stringify from './stringify';

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

export function v4(options?: any, buf?: any, offset?: any): string
{
	options = options || {};

	const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  
  
	rnds[6] = rnds[6] & 0x0f | 0x40;
	rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
  
	if (buf) {
	  offset = offset || 0;
  
	  for (let i = 0; i < 16; ++i) {
		buf[offset + i] = rnds[i];
	  }
  
	  return buf;
	}
  
	return (stringify)(rnds);
}