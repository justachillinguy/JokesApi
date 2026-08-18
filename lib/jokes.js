'use strict';

// The 25 jokes, kept in one place so the API, the local dev server,
// and any future consumers all read from the same source of truth.
const JOKES = [
  'Mother: Who do you like more, me or your dad? Liam: I like you both. Mother: Okay, if I go to America and your dad goes to Paris, where will you go? Liam: I will go to Paris. Mother: That means you like Dad more. Liam: No, it\'s because I like Paris. Mother: Okay, fine. If I go to Paris and your dad goes to America, where will you go? Liam: I will go to America. Mother: Why? Liam: Because I have already been to Paris.',
  'The Pope and Donald Trump are on stage in front of a huge crowd.',
  'What do you call a bee that lives in America? A USB.',
  'Donald Trump wants to ban the sale of pre-shredded cheese — he wants to make America grate again.',
  'If Hillary Clinton and Donald Trump are in a boat and it capsizes, who survives? America.',
  'Fortnite is like America… at one time it was good and free. Now it\'s neither.',
  'A turtle is crossing the road when he\'s mugged by two snails. When the police show up, they ask him what happened. The shaken turtle replies, \u201CI don\u2019t know. It all happened so fast.\u201D',
  'What\'s the best thing about Switzerland? I don\'t know, but the flag is a big plus.',
  'What do a beach and an American beer have in common? They\'re both close to water!',
  'Why are there no more minerals on the West Coast? Because they Oregon.',
  'What happened to the American who went to the hospital with a broken leg? He went broke.',
  'Which country and jazz instrument does Donald Trump like to play? A Trump-et.',
  'Why did the man get arrested for shooting a sick bald eagle? Because it\'s ill-eagle.',
  'Why are there hardly any knock-knock jokes about America? Because freedom rings!',
  'Why is everybody in Canada a lot cooler than the USA? Because of their winter.',
  'Which part of America has four eyes but still can\'t read? Mississippi.',
  'Why is the cellphone network so good in Wisconsin? Because even the smallest towns there have at least four bars.',
  'What do the Minnesota Vikings and the Memphis Grizzlies have in common? Neither has a title!',
  'What do you call pizza seasoning from Portland? Oregon-o.',
  'What\'s different when you compare the Memphis Grizzlies with a dollar bill? The dollar bill is good for four quarters.',
  'Why did NASA relocate from Houston? Because they heard the Houston Rockets can\'t perform when it counts.',
  'Why can\'t the Minnesota Vikings eat their cereal for breakfast? Because they tend to choke a lot when they come too close to a bowl.',
  'Why did the man from Colorado move to Las Vegas? Because he wanted to take a gamble.',
  'How did the buffalo pass his examinations? He just winged it.',
  'What did the police department name their squad of short policemen? Minneapolis.',
];

/** All jokes as `{ id, joke }` objects. IDs are 1-based and stable. */
function allJokes() {
  return JOKES.map((joke, index) => ({ id: index + 1, joke }));
}

/** Look up a single joke by its 1-based id, or `null` if it doesn't exist. */
function getJoke(id) {
  const index = Number(id) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= JOKES.length) {
    return null;
  }
  return { id: index + 1, joke: JOKES[index] };
}

/** Pick one joke at random. */
function getRandomJoke() {
  const index = Math.floor(Math.random() * JOKES.length);
  return { id: index + 1, joke: JOKES[index] };
}

/** Case-insensitive search across all jokes. */
function searchJokes(term) {
  const needle = term.toLowerCase();
  return allJokes().filter(({ joke }) => joke.toLowerCase().includes(needle));
}

module.exports = { JOKES, allJokes, getJoke, getRandomJoke, searchJokes };
