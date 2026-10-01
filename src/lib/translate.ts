"use client";

import type { Language } from "@/lib/region";

/**
 * Yoruba, Igbo and Hausa are provided by Google's website translator, driven by our own language
 * picker (its default widget is hidden). It translates the whole site, but it is machine
 * translation: the popup says so, and English is always one tap away. Professional translations
 * would replace this per page, at which point only `TranslationLoader` needs to go.
 *
 * The translator reads its instruction from a `googtrans` cookie of the form `/en/yo`.
 */
const COOKIE = "googtrans";

/** The language the translator is currently set to, or `"en"` when it isn't translating. */
function currentTarget(): Language {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=/en/([a-z]{2})`));
  const target = match?.[1];
  return target === "yo" || target === "ig" || target === "ha" ? target : "en";
}

function clearCookie() {
  const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${COOKIE}=; ${past}; path=/`;
  // The translator may also have written a domain-scoped copy, which a path-only delete won't remove.
  const host = window.location.hostname;
  document.cookie = `${COOKIE}=; ${past}; path=/; domain=${host}`;
  document.cookie = `${COOKIE}=; ${past}; path=/; domain=.${host}`;
}

/** Points the translator at `language` (English switches it off). Returns whether that changed anything. */
export function setTranslationTarget(language: Language): boolean {
  const before = currentTarget();
  if (language === "en") clearCookie();
  else document.cookie = `${COOKIE}=/en/${language}; path=/`;
  return before !== language;
}

/**
 * The translator rewrites text nodes behind React's back, and React then throws when it tries to
 * remove or move a node that has been replaced. These two guards are the widely used workaround: a
 * node that's no longer where React expects it is skipped instead of throwing.
 */
export function protectReactFromTranslator() {
  const flag = "__lcTranslatorGuard";
  const target = Node.prototype as unknown as Record<string, unknown>;
  if (target[flag]) return;
  target[flag] = true;

  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };

  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, reference: Node | null): T {
    if (reference && reference.parentNode !== this) return node;
    return insertBefore.call(this, node, reference) as T;
  };
}
