const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newBtn = document.getElementById("newBtn");
const copyBtn = document.getElementById("copyBtn");

const QUOTES = [
  { text: "Never regret having a good heart, everything good comes back to you, multiplied."},
  { text: "It will pass, not overnight, not all at once, but it will." },
  { text: "Happiness isn't about having all you want but loving all you have." },
  { text: "They will judge anyway, so do what you want."},
  { text: "You are absolutely capable of creating the life you can't stop thinking about."},
  { text: "A flower dosen't compete with other flowers, it blooms for itself," },
  { text: "Don't ask permission to fly. The wings are yours and the sky belongs to no one."},
  { text: "When I stand before God at the end of my life, I would hope that I would  not have a single bit of talent left and could say,'I used everything you gave me'."},
  { text: "And those who were seen dancing were thought to be insane by those who could not hear the music."},
  { text: "To live is the rarest thing in the world most people exist thats all"},
  { text: "Break the pattern today or the cycle repeats tommorow."},
  { text: "Be yourself; everyone else is already taken."},
  { text: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best."},
  { text: "So many books, so little time." },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe." },
  { text: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind." },
  { text: "You've gotta dance like there's nobody watching,Love like you'll never be hurt,Sing like there's nobody listening,And live like it's heaven on earth." },
  { text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams." },
  { text: "You only live once, but if you do it right, once is enough." },
  { text: "Be the change that you wish to see in the world." },
  { text: "The first step is you have to say that you can." },
  { text: "Once you choose hope, anything’s possible" },
  { text: "One small positive thought can change your whole day." },
  { text: "Mix a little foolishness with your serious plans. It is lovely to be silly at the right moment." },
  { text: "Joy is not in things; it is in us." },
  { text: "There is something out there just for you" },
  { text: "It doesn’t matter how slow you go, as long as you don’t stop." },
  { text: "Give every day the chance to become the most beautiful day of your life." },
  { text: "The best is yet to be" },
  { text: "In three words I can sum up everything I've learned about life: it goes on." },
  { text: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals." },
  { text: "Don’t walk in front of me… I may not follow, Don’t walk behind me… I may not lead, Walk beside me… just be my friend" },
  { text: "If you tell the truth, you don't have to remember anything." },
  { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel." },
  { text: "Friendship ... is born at the moment when one man says to another 'What! You too? I thought that no one but myself . . .'" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever." },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment." },
  { text: "Insanity is doing the same thing, over and over again, but expecting different results." },
  { text: "It is better to be hated for what you are than to be loved for what you are not." },
  { text: "I believe that everything happens for a reason. People change so that you can learn to let go, things go wrong so that you appreciate them when they're right, you believe lies so you eventually learn to trust no one but yourself, and sometimes good things fall apart so better things can fall together." },
  { text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover." },
];

let lastIndex = -1;

function getRandomQuote() {
  let index = Math.floor(Math.random() * QUOTES.length); 
  if (index === lastIndex) {
    index = Math.floor(Math.random() * QUOTES.length);
  }
  lastIndex = index;
  return QUOTES[index];
}

function displayQuote() {
  const quote = getRandomQuote();
  quoteText.textContent = quote.text;
}

function copyQuote() {
  const text = `"${quoteText.textContent}"`;
  navigator.clipboard.writeText(text);

  copyBtn.textContent = "Copied!";

  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 2000);
}

newBtn.addEventListener("click", displayQuote);
copyBtn.addEventListener("click", copyQuote);

displayQuote();