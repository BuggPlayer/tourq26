/** IEEE 802.3 CRC-32 (polynomial 0xEDB88320), reflected input/output. */

function crc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const TABLE = crc32Table();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = TABLE[(crc ^ bytes[i]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** 16-bit Fletcher checksum (modulo 255), sum1/sum2 as used in TCP alt. */
export function fletcher16(bytes: Uint8Array): { sum1: number; sum2: number; combined: number } {
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < bytes.length; i++) {
    sum1 = (sum1 + bytes[i]!) % 255;
    sum2 = (sum2 + sum1) % 255;
  }
  return { sum1, sum2, combined: (sum2 << 8) | sum1 };
}
