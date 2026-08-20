/* ---------- 1. Rotating right-triangle angle diagram ---------- */
function initAngleDiagram(){
  const svg = document.getElementById('angleSvg');
  if(!svg) return;

  const opp = document.getElementById('sideOpp');
  const adj = document.getElementById('sideAdj');
  const hyp = document.getElementById('sideHyp');
  const arc = document.getElementById('angleArc');
  const pointC = document.getElementById('pointC');
  const readout = document.getElementById('angleReadout');
  const sinOut = document.getElementById('sinVal');
  const cosOut = document.getElementById('cosVal');
  const tanOut = document.getElementById('tanVal');

  const cx = 40, cy = 220; // vertex A (angle theta) fixed at bottom-left
  const R = 170; // hypotenuse length (fixed), C moves along the arc

  let theta = 40; // degrees

  function render(){
    const rad = theta * Math.PI/180;
    const Cx = cx + R*Math.cos(rad);
    const Cy = cy - R*Math.sin(rad);
    const Bx = Cx, By = cy; // right angle at B (foot of perpendicular)

    // hypotenuse A->C, opposite C->B (vertical), adjacent A->B (horizontal)
    hyp.setAttribute('x1', cx); hyp.setAttribute('y1', cy);
    hyp.setAttribute('x2', Cx); hyp.setAttribute('y2', Cy);

    adj.setAttribute('x1', cx); adj.setAttribute('y1', cy);
    adj.setAttribute('x2', Bx); adj.setAttribute('y2', By);

    opp.setAttribute('x1', Bx); opp.setAttribute('y1', By);
    opp.setAttribute('x2', Cx); opp.setAttribute('y2', Cy);

    pointC.setAttribute('cx', Cx); pointC.setAttribute('cy', Cy);

    // small arc at vertex A showing theta
    const arcR = 30;
    const startX = cx + arcR, startY = cy;
    const endX = cx + arcR*Math.cos(rad), endY = cy - arcR*Math.sin(rad);
    const largeArc = theta > 180 ? 1 : 0;
    arc.setAttribute('d', `M ${startX} ${startY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${endX} ${endY}`);

    const s = Math.sin(rad), c = Math.cos(rad), t = Math.tan(rad);
    readout.querySelector('strong').textContent = theta + '°';
    sinOut.textContent = s.toFixed(3);
    cosOut.textContent = c.toFixed(3);
    tanOut.textContent = t.toFixed(3);
  }

  document.getElementById('angleUp').addEventListener('click', ()=>{
    theta = Math.min(80, theta+5); render();
  });
  document.getElementById('angleDown').addEventListener('click', ()=>{
    theta = Math.max(10, theta-5); render();
  });

  render();
}

/* ---------- 2. Quiz: MCQ + True/False + Short answer, auto-scored ---------- */
function initQuiz(){
  const form = document.getElementById('quizForm');
  if(!form) return;

  const answerKey = {
    q1: 'b',                 // MCQ
    q2: 'true',               // True/False
    q3: '0.6'                 // Short answer (sin = opp/hyp = 3/5)
  };

  form.addEventListener('submit', function(e){
    e.preventDefault();
    let score = 0;
    const total = Object.keys(answerKey).length;

    // Q1 MCQ
    const q1 = form.querySelector('input[name="q1"]:checked');
    const q1Labels = form.querySelectorAll('[data-q="q1"] .opt-label');
    q1Labels.forEach(l=>l.classList.remove('correct','incorrect'));
    if(q1){
      const chosen = q1.closest('.opt-label');
      if(q1.value === answerKey.q1){ score++; chosen.classList.add('correct'); }
      else { chosen.classList.add('incorrect'); }
    }

    // Q2 True/False
    const q2 = form.querySelector('input[name="q2"]:checked');
    const q2Labels = form.querySelectorAll('[data-q="q2"] .opt-label');
    q2Labels.forEach(l=>l.classList.remove('correct','incorrect'));
    if(q2){
      const chosen = q2.closest('.opt-label');
      if(q2.value === answerKey.q2){ score++; chosen.classList.add('correct'); }
      else { chosen.classList.add('incorrect'); }
    }

    // Q3 Short answer (numeric, tolerant of small formatting differences)
    const q3input = form.querySelector('input[name="q3"]');
    const given = (q3input.value || '').trim().replace(/^0\./,'.').replace(/^\./,'0.');
    const target = parseFloat(answerKey.q3);
    const givenNum = parseFloat(q3input.value);
    q3input.classList.remove('correct','incorrect');
    if(!isNaN(givenNum) && Math.abs(givenNum - target) < 0.02){
      score++; q3input.classList.add('correct');
    } else {
      q3input.classList.add('incorrect');
    }

    const result = document.getElementById('quizResult');
    result.classList.remove('pass','fail');
    result.classList.add('show', score === total ? 'pass' : 'fail');
    result.textContent = `Score: ${score} / ${total} — ` +
      (score === total ? 'Excellent! All correct.' : 'Review the highlighted answers and try again.');
  });

  form.addEventListener('reset', ()=>{
    const result = document.getElementById('quizResult');
    result.classList.remove('show','pass','fail');
    form.querySelectorAll('.correct,.incorrect').forEach(el=>el.classList.remove('correct','incorrect'));
  });
}

document.addEventListener('DOMContentLoaded', function(){
  initAngleDiagram();
  initQuiz();
});
