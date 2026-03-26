import { describe, expect, it } from "vitest";
import { intToIpv4, parseCidr } from "./cidr";

describe("parseCidr", () => {
  it("computes /24 for 192.168.1.10/24", () => {
    const r = parseCidr("192.168.1.10/24");
    expect(r.networkAddress).toBe("192.168.1.0");
    expect(r.broadcastAddress).toBe("192.168.1.255");
    expect(r.subnetMask).toBe("255.255.255.0");
    expect(r.firstHost).toBe("192.168.1.1");
    expect(r.lastHost).toBe("192.168.1.254");
    expect(r.usableHosts).toBe(254);
  });

  it("handles /32 host route", () => {
    const r = parseCidr("10.0.0.1/32");
    expect(r.networkAddress).toBe("10.0.0.1");
    expect(r.firstHost).toBe("10.0.0.1");
    expect(r.usableHosts).toBe(1);
  });
});

describe("intToIpv4", () => {
  it("formats loopback", () => {
    expect(intToIpv4(0x7f000001)).toBe("127.0.0.1");
  });
});
