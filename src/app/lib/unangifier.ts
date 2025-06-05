export function unangify(input: string): string {
  if (typeof input !== 'string' || input.trim() === '') {
    return '';
  }

  const regex = /[^aiueo]*[aiueo]+(?:[^aiueo]*$|[^aiueo](?=[^aiueo]))?/gi;
  let initialSplits = input.toLowerCase().match(regex);
  if (!initialSplits || initialSplits.length === 0) {
    return input;
  }


  if (initialSplits.length === 1) {
    const onlyChunk = initialSplits[0];
    const foundVowels = onlyChunk.match(/[aiueo]/gi) ?? [];
    if (foundVowels.length > 1) {

      let lastVowelIndex = -1;
      for (let i = 0; i < onlyChunk.length; i++) {
        if (/[aiueo]/i.test(onlyChunk[i])) {
          lastVowelIndex = i;
        }
      }

      if (lastVowelIndex > 0) {
        const firstPart = onlyChunk.slice(0, lastVowelIndex);
        const secondPart = onlyChunk.slice(lastVowelIndex);
        initialSplits = [firstPart, secondPart];
      }

    }
  }

  const splits = [...initialSplits];

  const originalLast = initialSplits[initialSplits.length - 1];
  const lastVowelArr = originalLast.match(/[aiueo]/gi) ?? [];
  const lastVowel = lastVowelArr.join('');

  const popped = splits.pop()!;
  splits.unshift(popped);
  const processedSyl = [...splits];

  const firstSylOriginal = splits[0];
  const firstSylProcessed = firstSylOriginal.replace(/[aiueo]/gi, 'a');

  let prefix = 'u';
  if (/^[aiueo]/i.test(firstSylOriginal) && initialSplits.length > 1) {

    const preceding = initialSplits[initialSplits.length - 2];
    const vowArr = preceding.match(/[aiueo]/gi);
    if (vowArr && vowArr.length > 0) {
      const lastOfPrec = vowArr[vowArr.length - 1].toLowerCase();
      if (lastOfPrec === 'i' || lastOfPrec === 'e') {
        prefix = 'uy';
      } else if (lastOfPrec === 'u' || lastOfPrec === 'o') {
        prefix = 'uw';
      }
    }
  }
  processedSyl[0] = prefix + firstSylProcessed;

  const idxLast = processedSyl.length - 1;
  processedSyl[idxLast] = processedSyl[idxLast] + 'n' + lastVowel + 'ng';

  const joined = processedSyl.join('');
  const final = joined.replace(/(.)\1+/g, '$1');

  return final;
}

export function gMode(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(/[aiueo]/gi, (v) => v + 'g' + v);
}
