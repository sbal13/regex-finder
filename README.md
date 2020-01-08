# Notes

## Use

To run the node server, please run

`node app.js`

Sending a `POST` to `/` requires:

Headers:
```
  {
    "Content-Type": "application/json"
  }
```

Body:
```
  {
    "text": "Some text to parse",
    "rule": "2nd through fourth word"
  }
```

## Thought Process

I realize that most of the rules specified by the prompt have much simpler solutions in isolation of each other. However I wanted to push this both achieve better scability and challenge my knowledge of regex syntax.

In making this application, the my primary concern was scalability. The rules and queries presented in the prompt represented only a small subset of possiblities for rules, and it would be impossible to account for all possible things that people would want to find (e.g. emails, dates, names, strings, words) and all possible ways to find them (e.g. through, preceding, following) in the first run. The idea was to make this application scalable in the sense that rules and queries should be able to be easily added as time goes on.

The idea was to categorize the words of the rules into three groups:

1. Numbers - words specifying either number of things (e.g. 3 words) or location (e.g. 3rd word)
2. Nouns - things people are looking for (e.g. emails, dates, words)
3. Rules - ways of looking through the text (e.g. through, preceding, following)

## How it works 

The rule is ingested and converted word by word into a series of objects representing the word and what to do with it. The objects contain both the type of word it is (i.e. number, noun, rule) as well as functions for processing that type of thing. For nouns (and numbers), these are functions that return template regular expressions. For rules, these are functions that specify how to look through the text.

Numbers are used in a variety of ways but the assumption is that they always apply to a noun, so numbers eventually boil down to nouns. For instance, "3 words" would specify that you are looking for three distinct words in a row, and just "third" would imply that you are looking for the third word.

Eventually, additional rules, nouns, and numbers could be added to their respective lists so long as they follow a specified structure.


## What works and what doesn't

Given some text, all the rules specified in the prompt should work. A few assumptions were made:

1. `"string preceding 'phone'"` 
I interpreted "string" as meaning "the rest of the sentence", in this case the part of a sentence preceding the word phone.

2. `preceding` and `following` were interpreted as "immediately preceding" and "immediately following". This means that if the rule is `"email following 3 words"`, it will look for an email immediately following the first three words. Another interpretation could have been "first email following the first three words", but this can be adjusted for if need be.

### Working numbers

As of now, the only English words that can be translated into numbers are the strings "one" through "ten" and "first" through "tenth". More can easily be added and will probably be generated programatically rather than manually.

### Working nouns

- "email" - produces a regex that will find strings in the format of an email  (e.g. name@email.com)
- "date" - produces a regex that will find strings in the format of a date (e.g. 10/24/2019)
- "word" - produces a regex that matches a full word
- "words" - produces a regex that a specified number of full words in a row. The regex produced depends on whether one is looking backwards or forwards from a target and is controlled by the `negative` paramater
- "string" - produces a regex that captures the rest of a sentence. Like "words", this produces a different regex if `negative` parameter is true.

### Working rules

- "through" - The "through" rule only works with the noun "word" before and after the word "through", so only rules of the structure "1st word through 6th word" work. If the first instance of "word" is ommitted, it is assumed, so "1st through 6th word" will work.
- "following" - Works with all nouns/numbered nouns as either the antecdent of the rule, but currently only numbered nouns work as the subsequent. So "email following 3 words" works, but so too does "2nd word following 3 words", and "date following 5th word". "Three words after email" will not currently work.
- "preceding" - Similar to following, but looking earlier in the text for a match


## Things to fix, optimize, and add

There are some bugs to fix. 

- Primarily, the "string" noun fails to capture the rest of the sentence if a period, exclamation point, or question mark are in the middle of the sentence, which I discovered when it failed to capture a sentence with an email in it.
- I would like to improve some of the rules so that additional query combinations can be made (e.g. "three words after email")
- Duplicate words can cause problems in unexpected ways for "following" and "preceding". This has to do with how I split the string once the target is found.

The code definitely repeats itself at times, and abstractions could be made for those places. The "through" rule, for example, uses the same code to locate the target word for both the antecedent and the subsequent.

There is definitely room for throwing informative errors when rules and queries fail.

The overall code structure code be improved. This iteration is my first attempt and while I tried to account for scability for the easy addition of rules and nouns, there are definitely easier ways to execute some of these queries. For instance, finding the first or second half of a sentence is easy to script, but difficult to find for a regex. 

I was also trying to code such that rules that couldeventually capture number-specific nouns like "third email following 'partners'" and multiple nouns "three dates preceding tenth word"  would work. This is why all nouns take a number as a parameter.

I realized while writing this that number words always boil down to a noun (e.g. "third" in "third through tenth word" implies "third word") and that the reverse is true - looking for an "email" is the same as looking for "one email" or "first email". What this means is that the "number" and "noun" type could eventually be reduced down to a single type.
