// Best regards Thomas Roten
// Taken from https://github.com/tsroten/zhon/ with a little modification

//: Character code ranges for pertinent CJK ideograph Unicode blocks.
const characters = [
  "\u3007",  // Ideographic number zero, see issue //17
  "\u4E00-\u9FFF",  // CJK Unified Ideographs
  "\u3400-\u4DBF",  // CJK Unified Ideographs Extension A
  "\uF900-\uFAFF",  // CJK Compatibility Ideographs

  // max_unicode > 0xFFFF:
  "\U00020000-\U0002A6DF",  // CJK Unified Ideographs Extension B
  "\U0002A700-\U0002B73F",  // CJK Unified Ideographs Extension C
  "\U0002B740-\U0002B81F",  // CJK Unified Ideographs Extension D
  "\U0002F800-\U0002FA1F",  // CJK Compatibility Ideographs Supplement
].join("")

//: Character code ranges for the Kangxi radicals and CJK Radicals Supplement.
const radicals = ["\u2F00-\u2FD5", "\u2E80-\u2EF3"].join("")

//: A string containing Chinese punctuation marks (non-stops).
const non_stops = [
// Fullwidth ASCII variants
  "\uFF02\uFF03\uFF04\uFF05\uFF06\uFF07\uFF08\uFF09\uFF0A\uFF0B\uFF0C\uFF0D",
  "\uFF0F\uFF1A\uFF1B\uFF1C\uFF1D\uFF1E\uFF20\uFF3B\uFF3C\uFF3D\uFF3E\uFF3F",
  "\uFF40\uFF5B\uFF5C\uFF5D\uFF5E\uFF5F\uFF60",
// Halfwidth CJK punctuation
  "\uFF62\uFF63\uFF64",
// CJK symbols and punctuation
  "\u3000\u3001\u3003",
// CJK angle and corner brackets
  "\u3008\u3009\u300A\u300B\u300C\u300D\u300E\u300F\u3010\u3011",
// CJK brackets and symbols/punctuation
  "\u3014\u3015\u3016\u3017\u3018\u3019\u301A\u301B\u301C\u301D\u301E\u301F",
// Other CJK symbols
  "\u3030",
// Special CJK indicators
  "\u303E\u303F",
// Dashes
  "\u2013\u2014",
// Quotation marks and apostrophe
  "\u2018\u2019\u201B\u201C\u201D\u201E\u201F",
// General punctuation
  "\u2026\u2027",
// Overscores and underscores
  "\uFE4F",
// Small form variants
  "\uFE51\uFE54",
// Latin punctuation
  "\u00B7",
].join("")

//: A string of Chinese stops.
const stops = [
  "\uFF0E",  // Fullwidth full stop
  "\uFF01",  // Fullwidth exclamation mark
  "\uFF1F",  // Fullwidth question mark
  "\uFF61",  // Halfwidth ideographic full stop
  "\u3002",  // Ideographic full stop
].join("")

//: A string containing all Chinese punctuation.
const punctuation = non_stops + stops

// A sentence end is defined by a stop followed by zero or more
// container-closing marks (e.g. quotation or brackets).

// The original put `non_stops` within the sentence,
// this customized version will break on non_stops punctuaion
const english_symbol = `-!$%^&*()_+|~=\`{}\\[\\]:";'<>?,.\\/`
const sentence_end = `[${english_symbol}${non_stops}${stops}][」﹂”』’》）］｝〕〗〙〛〉】]*`

// A regular expression pattern for a Chinese sentence. A sentence is defined
// as a series of characters and non-stop punctuation marks followed by a stop
// and zero or more container-closing punctuation marks (e.g. apostrophe or
// brackets).
const sent = `[${characters}${radicals}]*${sentence_end}`

// (?<=target), split at target but include the target to the previous match

export const reAnyStrEndsWithChinesePunctuation =
    new RegExp(`(?<=${sentence_end})`, "g")
