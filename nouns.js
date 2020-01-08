function email (number){ 
  return {
    regex: "([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)",
    offset: 0
  }
}

function date (number){ 
  return {
    regex: "([0-9]+\\/[0-9]+\\/[0-9]+)",
    offset: 0
  }
}

function word (number){ 
  return {
    regex: ".*?(?=\\s|$)", 
    offset: number - 1
  }
}

function words (number, negative = false){
  if (negative){
    return {
      regex: `\\S+(?:\\s+\\S+){0,${number-1}}$`,
      offset: 0
    }
  }

  const template = []
  for (let i = 0; i < number; i++){
    template.push("(.*?)")
  }
  const final = template.join("\\s") + "?(?=\\s|$)"

  return {
    regex: final, 
    offset: 0
  }
}

function string(number, negative = false){
  if (negative){
    return {
      regex: "(?<=([.!?]\\s)|^)([^.!?]*)$",
      offset: 0
    }  
  } else {
    return {
      regex: "\\S(.*?)([.!?]|$)",
      offset: 0
    }
  }
}

const NOUNS = {
  email,
  date,
  word,
  words,
  string
}

module.exports = NOUNS
