function through(string, antecdent, target){
  let antWord;
  let targetWord;

  if(antecdent.type === "number"){
    const antReg = antecdent.nounType(antecdent.data)
    const matches = string.match(new RegExp(antReg.regex, "g")).filter(word => word)
    antWord = matches[antReg.offset].trim()
  }  

  if(target.type === "number"){
    const targetReg = target.nounType(target.data)
    const matches = string.match(new RegExp(targetReg.regex, "g")).filter(word => word)
    targetWord = matches[targetReg.offset].trim()
  }

  const fullReg = new RegExp(`${antWord}(.*)${targetWord}`)
  return string.match(fullReg) ? string.match(fullReg)[0] : null
}

function following(string, antecdent, target){
  let antWord;
  let targetWord;
  let antReg;
  let targetReg

  if (antecdent.type === "number"){
    antReg = antecdent.nounType(antecdent.data)
  } else if(antecdent.type === "noun"){
    antReg = antecdent.data()
  } 

  if(target.type === "number"){
    targetReg = target.nounType(target.data)
    const matches = string.match(new RegExp(targetReg.regex, "g")).filter(word => word)
    targetWord = matches[targetReg.offset].trim()
  } else if (target.type === "string"){
    targetWord = target.data
  }

  // TODO: find better way to split ("random" has "and" in it)
  const latterHalf = string.split(targetWord)[1].trim()
  const final = latterHalf.match(new RegExp(antReg.regex, "g")).filter(word=> word)[antReg.offset]

  return final
}

function preceding(string, antecdent, target){
  let targetWord;
  let antReg;
  let targetReg

  if (antecdent.type === "number"){
    antReg = antecdent.nounType(antecdent.data, true)
  } else if(antecdent.type === "noun"){
    antReg = antecdent.data(null, true)
  }

  if(target.type === "number"){
    targetReg = target.nounType(target.data)
    const matches = string.match(new RegExp(targetReg.regex, "g")).filter(word => word)
    targetWord = matches[targetReg.offset].trim()
  } if (target.type === "string"){
    targetWord = target.data
  }

  const firstHalf = string.split(targetWord)[0].trim()
  const matches = []

  firstHalf.match(new RegExp(antReg.regex, "g")).forEach(word => {
    if(word){
      matches.push(word.trim())
    }
  })

  const final = matches[matches.length - antReg.offset - 1]


  return final
}

const RULES = {
  through,
  following,
  preceding
}

module.exports = RULES;
