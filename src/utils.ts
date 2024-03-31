/**
 * Spell Check
 *
 * This script uses the Yandex Speller API to check the spelling of the given text.
 * @see https://yandex.com/dev/speller/doc/dg/concepts/api-overview-docpage/
 */

import { URL, URLSearchParams } from "url";

export type Check = {
  code: number;
  pos: number;
  row: number;
  col: number;
  len: number;
  word: string;
  s: string[];
};

const OPTS = {
  IGNORE_DIGITS: 2,
  IGNORE_URLS: 4,
  FIND_REPEAT_WORDS: 8,
  IGNORE_CAPITALIZATION: 512,
} as const;

// const ERROR_CODE = {
//   1: "UNKNOWN_WORD",
//   2: "REPEATED_WORD",
//   3: "CAPITALIZATION",
//   4: "TOO_MANY_ERRORS",
// } as const;

export const buildUrl = (text: string) => {
  const url = new URL("https://speller.yandex.net/services/spellservice.json/checkText");
  const searchParams = new URLSearchParams({
    lang: "en",
    format: "plain",
    options: `${OPTS.IGNORE_DIGITS + OPTS.IGNORE_URLS + OPTS.FIND_REPEAT_WORDS + OPTS.IGNORE_CAPITALIZATION}`,
    text,
  });
  url.search = searchParams.toString();

  return url.toString();
};
