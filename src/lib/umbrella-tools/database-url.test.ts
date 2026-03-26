import { describe, expect, it } from "vitest";
import { parseDatabaseUrl } from "./database-url";

describe("parseDatabaseUrl", () => {
  it("parses postgres URL", () => {
    const p = parseDatabaseUrl("postgresql://user:secret@db.example.com:5432/myapp?sslmode=require");
    expect(p.scheme).toBe("postgresql");
    expect(p.host).toBe("db.example.com");
    expect(p.port).toBe("5432");
    expect(p.username).toBe("user");
    expect(p.password).toBe("secret");
    expect(p.database).toBe("myapp");
    expect(p.searchParams.sslmode).toBe("require");
  });

  it("parses redis without path db", () => {
    const p = parseDatabaseUrl("redis://:pass@127.0.0.1:6379/0");
    expect(p.scheme).toBe("redis");
    expect(p.password).toBe("pass");
    expect(p.database).toBe("0");
  });
});
