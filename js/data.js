/* All story content lives here. Numbers count up on screen; strings are shown as-is.
   Real stats come from the Instagram export (counts and dates only). */
window.DATA = {
  years: "2025—2026",
  title: "Our Wrapped",
  tagline: "Two seasons. One story.",

  // Screen 2: her first message and his reply (Feb 28, 2025)
  firstMessage: {
    date: "Feb 28, 2025",
    headline: "It started with a question.",
    big: "مين؟",
    reply: "مدري",
    caption: "Her first message ever — \"who?\" — and my least helpful reply: \"idk.\"",
  },

  // Screen 3: the busiest day ever, March 2, 2025
  firstConversation: { number: 1099, label: "messages in one day. We just kept going.", date: "Mar 2, 2025" },

  season1: { label: "SEASON 1", title: "Who is this?" },

  totalMessages: { number: 1970, label: "messages in total", sub: "13 days of talking" },

  whoTexted: {
    a: { name: "Nouf", value: 1053 },
    b: { name: "Abdulaziz", value: 917 },
    headline: "Who texted more?",
    note: "Nouf, by 136 messages.",
  },

  // They never called. 164 voice notes though.
  call: { number: 0, unit: "minutes", label: "Longest call", sub: "We never called. Not once. Just 164 voice notes instead." },

  silence: { number: 551, label: "days of silence" },
  silenceLooksLike: { headline: "What 551 looks like", a: { number: 78, label: "weeks" }, b: { number: 13224, label: "hours" } },

  // Early Sep 2026: she messaged on Snapchat asking who he was.
  season2: { label: "SEASON 2", title: "Who are you?", date: "Sep 2026", sub: "She really didn't remember me." },

  plotTwists: {
    headline: "Plot twists",
    items: ["Her surname is my dad's grandma's family.", "We both have Kuwaiti family."],
  },

  insideJokes: {
    headline: "Top inside jokes",
    items: ["Her friend's Mercedes (I hate it)", "Finesse", "\"Who are you?\" — twice", "The Kuwaiti cousins", "🌍 on my Snapchat"],
  },

  favoriteMemory: {
    headline: "My favorite thing",
    photo: null, // set to e.g. "img/memory.jpg" to show a photo instead of the globe
    title: "She's my world.",
    quote: "On my Snapchat she's saved as a globe. Because she is.",
  },

  summary: {
    headline: "Our story in numbers",
    left: [["Messages", "1,970"], ["Days of silence", "551"], ["Calls", "0"]],
    right: [["From Nouf", "1,053"], ["Voice notes", "164"], ["Our song", "Finesse"]],
  },

  // Music per screen (1-15). start = seconds into the song. Every screen has its own
  // song + start time and crossfades in. Optional vol (0-1) sets that screen's volume (default 0.85);
  // src: null = silence.
  showMuteButton: true, // speaker button, bottom-left. Tapping it mutes the music; a "Music off" label shows.
  music: {
    1:  { src: "audio/s1.mp3", start: 20 },              // intro
    2:  { src: "audio/s2.mp3", start: 40 },              // first message
    3:  { src: "audio/s3.mp3", start: 80 },              // 1,099 messages in a day
    4:  { src: "audio/s4.mp3", start: 10 },              // Season 1 title
    5:  { src: "audio/s5.mp3", start: 60 },              // 1,970 messages
    6:  { src: "audio/s2.mp3", start: 105 },             // who texted more
    7:  { src: "audio/s5.mp3", start: 155 },             // the call
    8:  { src: "audio/s7.mp3", start: 30,  vol: 0.3 },   // 551 days of silence (soft)
    9:  { src: "audio/s1.mp3", start: 100, vol: 0.3 },   // what 551 looks like (soft)
    10: { src: "audio/s6.mp3", start: 150 },             // Season 2 hits
    11: { src: "audio/s3.mp3", start: 120 },             // plot twists
    12: { src: "audio/s1.mp3", start: 60 },              // inside jokes
    13: { src: "audio/s7.mp3", start: 60 },              // favorite thing
    14: { src: "audio/s4.mp3", start: 90 },              // summary
    15: { src: "audio/s7.mp3", start: 240 },             // to be continued
  },

  ending: {
    headline: "To be<br>continued.",
    chip: "Season 3?",
    line: "In my eyes, she's the most beautiful girl.",
    replay: "Replay our story",
  },
};
