
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


function unangify(words) {

  const syllableRegex = /[^aiueo]*[aiueo]+(?:[^aiueo]*$|[^aiueo](?=[^aiueo]))?/gi

  const splits = words.toString().match(syllableRegex)
  const lastVowel = splits[splits.length - 1].match(/[aiueo]/gi).join('')
  splits.unshift(splits.pop())

  let processedSyl = [...splits]

  let firstSyl = splits[0].replace(/[aiueo]/gi, 'a')
  processedSyl[0] = 'u' + firstSyl

  processedSyl[processedSyl.length - 1] = processedSyl[processedSyl.length - 1] + 'n' + lastVowel + 'ng'

  return processedSyl
}

function getInput(query) {
  return new Promise(resolve => rl.question(query, ans => {
    resolve(ans)
  }))
}

async function main() {

  while (true) {
    const raw = await getInput('unangify!: ')
    const command = raw.toLowerCase().trim()

    if (command === 'exit' || command === 'quit' || command === '') {
      console.log("Exiting Unangify Text Processor.");
      break;
    }

    const wordSplit = raw.trim().split(/\s+/).filter(word => word.length > 0)

    const sentence = []

    for (const word of wordSplit) {
      const unangified = unangify(word)

      sentence.push(unangified.join(''))
    }

    console.log(sentence.join(' '))
  }


  rl.close()
}

main().catch(err => {
  console.error("An unexpected error occurred:", err);
  rl.close()
});

rl.on('close', () => {
  process.exit(0);
});