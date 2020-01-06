const http = require('http');
const RULES = require('./rules.js')
const NOUNS = require('./nouns.js')
const NUMBERS = require('./numbers.js')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if(req.method === 'POST') {
    collectRequestData(req, reqBody => {
        const { text, rule } = reqBody
        const ruleWords = rule.split(" ")
        const convertedWords = []

        while (ruleWords.length){
          let word = ruleWords.shift()
          
          if (checkNumber(word)){
             const number = ({
              data: checkNumber(word.toLowerCase()), 
              type: "number",
              word: word.toLowerCase() 
            })
            const next = ruleWords[0]

            if (NOUNS[next]){
              number.nounType = NOUNS[next]
              ruleWords.shift()
              number.word += " " + next
            } else {
              number.nounType = NOUNS.word
            }

            convertedWords.push(number)
            continue
          }

          if (checkString(word)){
            convertedWords.push({
              data: checkString(word),
              type: "string",
              word: word
            })
            continue
          }

          if (NOUNS[word.toLowerCase()]){
            convertedWords.push({
              data: NOUNS[word.toLowerCase()],
              type: "noun",
              word: word.toLowerCase()
            })
            continue
          }

          if (RULES[word.toLowerCase()]){
            convertedWords.push({
              data: RULES[word.toLowerCase()],
              type: "rule",
              word: word.toLowerCase()
            })
            continue
          }
        }

        try{

          if (convertedWords.length === 1 && convertedWords[0].type === "number"){
            const reg = convertedWords[0].nounType(convertedWords[0].data)
            const matches = text.match(new RegExp(reg.regex, "g")).filter(word => word)
            const match = matches[reg.offset].trim()

            const respBody = {data: match}
            res.end(JSON.stringify(respBody));
          } else {
            let match;

            convertedWords.forEach((thing,index) => {
              if(thing.type === "rule"){
                const antecedent = convertedWords[index-1]
                const target = convertedWords[index+1]

                match = thing.data(text, antecedent, target)
              }
            })


            const respBody = {data: match}
            res.end(JSON.stringify(respBody));
          }
          
        } catch (error){
          console.log(error)
          const respBody = {error: "Invalid rule or match not found"}
          res.end(JSON.stringify(respBody));
        }
    });
  }  
});


function checkNumber(word){
  if (parseInt(word)){
    return parseInt(word)
  }

  if (NUMBERS[word]){
    return NUMBERS[word]
  }

  return false
}

function checkString(word){
  if (word.match(/("|')(.*?)("|')/)){
    return word.replace(/^("|')|("|')$/g, "")
  }

  return false
}


function collectRequestData(request, callback) {
    const CONTENT_TYPE = 'application/json';
    if(request.headers['content-type'] === CONTENT_TYPE) {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(JSON.parse(body));
        });
    }
    else {
        callback(null);
    }
}



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
