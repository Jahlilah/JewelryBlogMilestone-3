// Self-invoking function to ensure code does not pollute global scope
(function () {
  const form = document.getElementById('quizForm');
  const resultsBox = document.getElementById('results');
  const overallEl = document.getElementById('overall');
  const totalScoreEl = document.getElementById('totalScore');
  const breakdown = document.getElementById('breakdown');
  const resetBtn = document.getElementById('resetBtn');
  
 // Answer key with points for each question
  const key = {
    q1: { type: 'text', answer: 'gold', points: 10 },
    q2: { type: 'single', answer: 'b', points: 10 },
    q3: { type: 'single', answer: 'b', points: 10 },
    q4: { type: 'single', answer: 'b', points: 10 },
    q5: { type: 'multi', answers: ['a', 'b', 'd'], points: 20 }
  };

  function normalizeText(s) {
    return (s || '').trim().toLowerCase();
  }
// Main grading function
  function grade() {
    let total = 0;
    const perQuestion = [];

    const q1Val = normalizeText(document.getElementById('q1').value);
    const q1Correct = q1Val === key.q1.answer;
    if (q1Correct) total += key.q1.points;
    perQuestion.push({
      num: 1,
      correct: q1Correct,
      earned: q1Correct ? key.q1.points : 0,
      correctAnswer: 'gold'
    });

    ['q2', 'q3', 'q4'].forEach((qName, idx) => {
      const checked = form.querySelector(`input[name="${qName}"]:checked`);
      const val = checked ? checked.value : null;
      const right = val === key[qName].answer;
      if (right) total += key[qName].points;
      perQuestion.push({
        num: idx + 2,
        correct: right,
        earned: right ? key[qName].points : 0,
        correctAnswer: key[qName].answer
      });
    });

    const selected = Array.from(form.querySelectorAll('input[name="q5"]:checked')).map(i => i.value);
    const correctSet = new Set(key.q5.answers);
    const selectedSet = new Set(selected);

  
    let multiRight = selected.length === correctSet.size &&
                     key.q5.answers.every(x => selectedSet.has(x));
    if (multiRight) total += key.q5.points;

    perQuestion.push({
      num: 5,
      correct: multiRight,
      earned: multiRight ? key.q5.points : 0,
      correctAnswer: 'a, b, d'
    });

    return { total, perQuestion };
  }

  function showFeedback(graded) {
    const { total, perQuestion } = graded;

    
    const f1 = document.getElementById('f1');
    f1.textContent = perQuestion[0].correct
      ? 'Correct: “gold”.'
      : 'Incorrect. Correct answer: “gold”.';
    f1.className = 'feedback ' + (perQuestion[0].correct ? 'correct' : 'incorrect');

    const f2 = document.getElementById('f2');
    f2.textContent = perQuestion[1].correct
      ? 'Correct.'
      : 'Incorrect. Correct option: b';
    f2.className = 'feedback ' + (perQuestion[1].correct ? 'correct' : 'incorrect');

    const f3 = document.getElementById('f3');
    f3.textContent = perQuestion[2].correct
      ? 'Correct.'
      : 'Incorrect. Correct option: b';
    f3.className = 'feedback ' + (perQuestion[2].correct ? 'correct' : 'incorrect');

    const f4 = document.getElementById('f4');
    f4.textContent = perQuestion[3].correct
      ? 'Correct.'
      : 'Incorrect. Correct option: b';
    f4.className = 'feedback ' + (perQuestion[3].correct ? 'correct' : 'incorrect');

    const f5 = document.getElementById('f5');
    f5.textContent = perQuestion[4].correct
      ? 'Correct.'
      : 'Incorrect. Correct options: a, b, d';
    f5.className = 'feedback ' + (perQuestion[4].correct ? 'correct' : 'incorrect');

    totalScoreEl.textContent = String(total);
    const passed = total >= 42; 
    overallEl.innerHTML = passed
      ? `<span class="pass">Pass — great job!</span>`
      : `<span class="fail">Not yet — review and try again.</span>`;


    breakdown.innerHTML = '';
    perQuestion.forEach(q => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>Q${q.num}:</strong> ${q.correct ? 'Correct' : 'Incorrect'} — +${q.earned} pts. ` +
                     `${q.correct ? '' : `<em>Answer: ${q.correctAnswer}</em>`}`;
      li.className = q.correct ? 'correct' : 'incorrect';
      breakdown.appendChild(li);
    });

    resultsBox.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const q1 = document.getElementById('q1');
    const q2 = form.querySelector('input[name="q2"]:checked');
    const q3 = form.querySelector('input[name="q3"]:checked');
    const q4 = form.querySelector('input[name="q4"]:checked');

    if (!q1.value.trim() || !q2 || !q3 || !q4) {
      alert('Please answer all required questions before submitting.');
      return;
    }

    const graded = grade();
    showFeedback(graded);
   
    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  resetBtn.addEventListener('click', () => {
    resultsBox.hidden = true;
    overallEl.textContent = '';
    totalScoreEl.textContent = '0';
    breakdown.innerHTML = '';

    ['f1','f2','f3','f4','f5'].forEach(id => {
      const el = document.getElementById(id);
      el.textContent = '';
      el.className = 'feedback';
    });
  });
})();
