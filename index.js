const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://mango-glacier-02caee610.4.azurestaticapps.net',  // Allow frontend's domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static('public'));

const puzzles = [
  {
    id: 1,
    type: 'riddle',
    question: 'I am not alive, but I grow. I do not have lungs, but I need air. What am I?',
    answer: 'Fire',
    hint: 'Think about something that can get larger but isn’t living.'
  },
  {
    id: 2,
    type: 'logic',
    question: 'You have two ropes. Each rope burns in 60 minutes, but at an uneven rate. How can you measure exactly 45 minutes?',
    answer: 'Light one rope at both ends and the other at one end. When the first rope is finished, 30 minutes have passed. Now light the second rope at the other end.',
    hint: 'Use the uneven burning to your advantage.'
  },
  {
    id: 3,
    type: 'math',
    question: 'A plane crashes on the border of the U.S. and Canada. Where do they bury the survivors?',
    answer: 'Nowhere, they are survivors.',
    hint: 'It’s a trick question.'
  },
  {
    id: 4,
    type: 'word',
    question: 'What has keys but can’t open locks?',
    answer: 'A piano',
    hint: 'It’s a musical instrument.'
  },
  {
    id: 5,
    type: 'riddle',
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'Footsteps',
    hint: 'Think about movement.'
  },
  {
    id: 6,
    type: 'logic',
    question: 'A man pushes his car to a hotel and shouts, “I’m bankrupt!” Why?',
    answer: 'He’s playing Monopoly.',
    hint: 'It’s a reference to a popular board game.'
  },
  {
    id: 7,
    type: 'math',
    question: 'A bat and a ball cost $1.10 together. The bat costs $1 more than the ball. How much does the ball cost?',
    answer: '$0.05',
    hint: 'It’s a common cognitive bias to think the ball costs $0.10.'
  },
  {
    id: 8,
    type: 'riddle',
    question: 'What can travel around the world while staying in the corner?',
    answer: 'A stamp',
    hint: 'It’s something you put on letters.'
  },
  {
    id: 9,
    type: 'logic',
    question: 'You have a 3-gallon jug and a 5-gallon jug. How do you measure exactly 4 gallons?',
    answer: 'Fill the 5-gallon jug, then pour it into the 3-gallon jug. You will be left with 2 gallons in the 5-gallon jug. Empty the 3-gallon jug and pour the remaining 2 gallons into it. Then fill the 5-gallon jug again and pour it into the 3-gallon jug until it is full. Now you have exactly 4 gallons in the 5-gallon jug.',
    hint: 'It’s a classic water jug problem.'
  },
];

let userProgress = {};

app.get('/api/next-puzzle/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userProgress[userId]) {
    userProgress[userId] = { currentPuzzle: 0 };
  }

  const currentPuzzleIndex = userProgress[userId].currentPuzzle;
  if (currentPuzzleIndex < puzzles.length) {
    userProgress[userId].currentPuzzle += 1;
    res.json({ puzzle: puzzles[currentPuzzleIndex] });
  } else {
    res.json({ message: 'Congratulations! You completed all puzzles!' });
  }
});

app.post('/api/submit-answer', express.json(), (req, res) => {
  const { userId, puzzleId, answer } = req.body;
  const puzzle = puzzles.find(p => p.id === puzzleId);

  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle not found' });
  }

  if (puzzle.answer.toLowerCase() === answer.toLowerCase()) {
    res.json({ correct: true });
  } else {
    res.json({ correct: false, correctAnswer: puzzle.answer });
  }
});

app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
