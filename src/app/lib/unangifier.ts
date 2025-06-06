export function unangify(input: string): string {
  if (typeof input !== 'string' || input.trim() === '') {
    return '';
  }

  // ─── 0) SPLIT OFF any trailing punctuation (non‐letters) ───
  //    e.g. "tidur."  → core = "tidur",   punct = "."
  //         "dia!?"   → core = "dia",     punct = "!?"
  //         "makan"   → core = "makan",   punct = ""
  const m = input.match(/^(.+?)([^A-Za-z]*)$/);
  // ‣ If it matches, m[1] is “everything up to the first trailing non-letter,”
  //   and m[2] is the trailing punctuation (could be "", or ".", "?!", etc.).
  // ‣ If it does not match for whatever reason, we’ll just treat the entire input as “core.”
  const core = m ? m[1] : input;
  const punct = m ? m[2] : '';

  // ─── 1) Use regex to get vowel‐centric chunks from the core:
  // "dunia" → ["du","nia"], "dia" → ["dia"], "makan" → ["ma","kan"], etc.
  const regex = /[^aiueo]*[aiueo]+(?:[^aiueo]*$|[^aiueo](?=[^aiueo]))?/gi;
  let initialSplits: string[] = core.toLowerCase().match(regex) || [];
  if (initialSplits.length === 0) {
    // If nothing matched (e.g. core = "123"), just return core + punctuation
    return core + punct;
  }

  // ─── 2) Ensure ANY chunk with ≥2 vowels is split at its last vowel.
  // For example:
  //   "dia"  → ["di","a"]
  //   "dua"  → ["du","a"]
  //   "doa"  → ["do","a"]
  //   "nia"  → ["ni","a"]   (so "dunia" ultimately → ["du","ni","a"])
  const expanded: string[] = [];
  for (const chunk of initialSplits) {
    // Find all vowel positions in this chunk:
    const vowelIndices = chunk
      .split('')
      .map((c, i) => (/[aiueo]/i.test(c) ? i : -1))
      .filter((idx) => idx >= 0);

    if (vowelIndices.length > 1) {
      // Split at the last vowel index:
      const lastVIdx = vowelIndices[vowelIndices.length - 1];
      if (lastVIdx > 0) {
        const firstPart = chunk.slice(0, lastVIdx);
        const secondPart = chunk.slice(lastVIdx);
        expanded.push(firstPart, secondPart);
        continue;
      }
    }
    // Otherwise leave it as‐is
    expanded.push(chunk);
  }
  initialSplits = expanded;
  // Now, for example:
  //   "dunia" → ["du","ni","a"]
  //   "dia"   → ["di","a"]
  //   "dua"   → ["du","a"]
  //   "makan" → ["ma","kan"]

  // ─── 3) Grab the last vowel of the *original* last chunk (for the "n…ng" suffix)
  const origLastChunk = initialSplits[initialSplits.length - 1];
  const lastVowelArr = origLastChunk.match(/[aiueo]/gi) || [];
  const lastVowel = lastVowelArr[lastVowelArr.length - 1] || '';

  // ─── 4) ROTATE: pop the last chunk and unshift it to front
  const splits = [...initialSplits];
  const popped = splits.pop()!; // originally at index initialSplits.length - 1
  splits.unshift(popped);

  // Build a modifiable array “processedSyl”:
  const processedSyl = [...splits];

  // ─── 5) FIRST‐SYLLABLE transformation:
  //    (a) Replace all vowels in that chunk with "a"
  const firstSylOriginal = splits[0];
  const firstSylProcessed = firstSylOriginal.replace(/[aiueo]/gi, 'a');

  //    (b) Determine prefix = "u" / "uy" / "uw"
  let prefix = 'u';
  // If the rotated‐to‐front chunk starts with a vowel, look at the original preceding chunk.
  if (/^[aiueo]/i.test(firstSylOriginal) && initialSplits.length > 1) {
    const preceding = initialSplits[initialSplits.length - 2];
    const vowelsInPrev = preceding.match(/[aiueo]/gi) || [];
    const lastOfPrev = vowelsInPrev[vowelsInPrev.length - 1]?.toLowerCase() || '';

    if (lastOfPrev === 'i' || lastOfPrev === 'e') {
      prefix = 'uy';
    } else if (lastOfPrev === 'u' || lastOfPrev === 'o') {
      prefix = 'uw';
    }
  }
  processedSyl[0] = prefix + firstSylProcessed;

  // ─── 6) LAST‐SYLLABLE transformation: append “n + lastVowel + ng”
  const lastIndex = processedSyl.length - 1;
  processedSyl[lastIndex] = processedSyl[lastIndex] + 'n' + lastVowel + 'ng';

  // ─── 7) Collapse any repeated letters (/(.)\1+/ → “$1”)
  const joined = processedSyl.join('');
  const finalCore = joined.replace(/(.)\1+/g, '$1');

  // ─── 8) RE‐ATTACH any trailing punctuation that we stripped in Step 0
  return finalCore + punct;
}

export function gMode(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(/[aiueo]/gi, (v) => v + 'g' + v);
}
