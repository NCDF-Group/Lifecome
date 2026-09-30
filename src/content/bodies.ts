import { access } from "./bodies/access";
import { care } from "./bodies/care";
import { core } from "./bodies/core";
import { network } from "./bodies/network";
import { records } from "./bodies/records";
import { safetyLegal } from "./bodies/safety-legal";
import { services } from "./bodies/services";
import { support } from "./bodies/support";
import { trust } from "./bodies/trust";
import type { Bodies, PageBody } from "./types";

const bodies: Bodies = { ...core, ...services, ...access, ...care, ...records, ...network, ...trust, ...support, ...safetyLegal };

export function getBody(path: string): PageBody | undefined {
  return (bodies as Record<string, PageBody | undefined>)[path];
}

export function bodyPaths(): string[] {
  return Object.keys(bodies);
}
