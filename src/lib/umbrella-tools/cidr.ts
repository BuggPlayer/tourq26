export type CidrResult = {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
};

function ipv4ToInt(ip: string): number {
  const parts = ip.split(".").map((x) => parseInt(x.trim(), 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    throw new Error("Invalid IPv4 address.");
  }
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

export function intToIpv4(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function maskFromPrefix(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

/** Parse "192.168.1.10/24" style CIDR (IPv4 only). */
export function parseCidr(input: string): CidrResult {
  const trimmed = input.trim();
  const slash = trimmed.indexOf("/");
  if (slash < 0) throw new Error('Use CIDR notation, e.g. 192.168.1.0/24');

  const ipPart = trimmed.slice(0, slash).trim();
  const prefix = parseInt(trimmed.slice(slash + 1).trim(), 10);
  if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error("Prefix must be between 0 and 32.");
  }

  const ip = ipv4ToInt(ipPart);
  const mask = maskFromPrefix(prefix);
  const wildcard = (~mask >>> 0) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  const totalHosts = 2 ** (32 - prefix);
  let usableHosts: number;
  if (prefix === 32) usableHosts = 1;
  else if (prefix === 31) usableHosts = 2;
  else if (prefix === 0) usableHosts = totalHosts - 2;
  else usableHosts = Math.max(0, totalHosts - 2);

  let firstHost = network;
  let lastHost = broadcast;
  if (prefix === 32) {
    firstHost = lastHost = network;
  } else if (prefix === 31) {
    firstHost = network;
    lastHost = broadcast;
  } else if (prefix <= 30) {
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
  }

  return {
    cidr: `${intToIpv4(network)}/${prefix}`,
    networkAddress: intToIpv4(network),
    broadcastAddress: intToIpv4(broadcast),
    subnetMask: intToIpv4(mask),
    wildcardMask: intToIpv4(wildcard),
    firstHost: intToIpv4(firstHost),
    lastHost: intToIpv4(lastHost),
    totalHosts,
    usableHosts,
  };
}
