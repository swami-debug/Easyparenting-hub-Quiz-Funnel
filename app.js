const app = {
    currentScreen: 'welcome',
    currentStepIndex: 0,
    allSteps: [],
    answers: {},
    results: null,
    direction: 'right',

    init() {
        this.allSteps = this.buildSteps();
    },

    shuffleArray(arr) {
        const shuffled = arr.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    buildSteps() {
        const steps = [];
        const totalQuestions = quizData.sectionOrder.reduce((sum, key) => sum + quizData.sections[key].questions.length, 0);
        let overallQuestionNumber = 0;
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

        quizData.sectionOrder.forEach(sectionKey => {
            const section = quizData.sections[sectionKey];
            const sectionTotalQuestions = section.questions.length;
            let sectionQuestionNumber = 0;

            // Section intro step
            steps.push({
                stepType: 'intro',
                sectionKey,
                sectionTitle: section.title,
                sectionSubtitle: section.subtitle,
                sectionIcon: section.icon
            });

            // Question steps
            section.questions.forEach(q => {
                overallQuestionNumber++;
                sectionQuestionNumber++;

                // Shuffle options for scored single-select questions
                let options = q.options ? q.options.slice() : null;
                if (options && section.scored && q.type === 'single') {
                    options = this.shuffleArray(options);
                    // Reassign labels based on new order
                    options = options.map((opt, idx) => ({
                        ...opt,
                        label: labels[idx]
                    }));
                }

                steps.push({
                    stepType: 'question',
                    qType: q.type,
                    id: q.id,
                    text: q.text,
                    options: options,
                    placeholder: q.placeholder || null,
                    note: q.note || null,
                    sectionKey,
                    sectionTitle: section.title,
                    sectionIcon: section.icon,
                    overallQuestionNumber,
                    totalQuestions,
                    sectionQuestionNumber,
                    sectionTotalQuestions
                });
            });
        });
        return steps;
    },

    start() {
        this.showScreen('quiz');
        this.renderStep();
    },

    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-' + name).classList.add('active');
        this.currentScreen = name;
        window.scrollTo(0, 0);
    },

    updateProgress(step) {
        if (step.stepType === 'question') {
            const pct = Math.round((step.overallQuestionNumber / step.totalQuestions) * 100);
            document.getElementById('progressFill').style.width = pct + '%';
            document.getElementById('progressCount').textContent = pct + '% Complete';
        }
        document.getElementById('progressSection').textContent = step.sectionIcon + ' ' + step.sectionTitle;
    },

    renderStep() {
        const step = this.allSteps[this.currentStepIndex];
        const container = document.getElementById('quiz-content');
        const anim = this.direction === 'right' ? 'slide-in-right' : 'slide-in-left';
        const btnNext = document.getElementById('btnNext');
        const btnBack = document.getElementById('btnBack');

        btnBack.style.display = this.currentStepIndex === 0 ? 'none' : '';
        this.updateProgress(step);

        // ── SECTION INTRO ──
        if (step.stepType === 'intro') {
            container.innerHTML = `
                <div class="section-intro ${anim}">
                    <span class="section-icon">${step.sectionIcon}</span>
                    <span class="section-tag">${step.sectionKey === 'section0' ? 'Section 0' : step.sectionKey.replace('section', 'Section ')}</span>
                    <h2>${step.sectionTitle}</h2>
                    <p>${step.sectionSubtitle}</p>
                </div>`;
            btnNext.disabled = false;
            btnNext.innerHTML = "Let's Begin &#8594;";
            return;
        }

        // ── QUESTION ──
        let html = `<div class="question-card ${anim}" id="questionCard">`;
        html += `<div class="question-number">Question ${step.sectionQuestionNumber} of ${step.sectionTotalQuestions}</div>`;
        html += `<h2 class="question-text">${step.text}</h2>`;

        if (step.note) {
            html += `<p class="question-note">${step.note}</p>`;
        }

        if (step.qType === 'text') {
            const val = this.answers[step.id] || '';
            html += `<div class="input-group">
                <input type="text" class="text-input" id="textInput"
                    placeholder="${step.placeholder || 'Type your answer...'}"
                    value="${this.escapeHtml(val)}" autocomplete="off" maxlength="50">
            </div>`;

        } else if (step.qType === 'multi') {
            html += '<div class="options-list">';
            const selected = this.answers[step.id] || [];
            step.options.forEach(opt => {
                const isSel = selected.includes(opt.value);
                html += `<div class="option-card multi ${isSel ? 'selected' : ''}"
                    onclick="app.toggleMultiOption('${step.id}', '${opt.value}', this, ${!!opt.hasTextInput})">
                    <span class="option-checkbox">${isSel ? '&#10003;' : ''}</span>
                    <span class="option-text">${opt.text}</span>
                </div>`;
                if (opt.hasTextInput) {
                    const tv = this.answers[step.id + '_other'] || '';
                    html += `<div class="other-input-wrapper ${isSel ? 'show' : ''}" id="otherInput_${step.id}">
                        <input type="text" class="text-input other-text-input"
                            placeholder="Please share in your own words..."
                            value="${this.escapeHtml(tv)}"
                            oninput="app.answers['${step.id}_other'] = this.value.trim()"
                            maxlength="200">
                    </div>`;
                }
            });
            html += '</div>';

        } else {
            // single select
            html += '<div class="options-list">';
            step.options.forEach(opt => {
                const isSel = this.answers[step.id] === opt.value;
                html += `<div class="option-card ${isSel ? 'selected' : ''}"
                    onclick="app.selectOption('${step.id}', '${opt.value}', this)">
                    <span class="option-letter">${opt.label}</span>
                    <span class="option-text">${opt.text}</span>
                    <span class="option-check">&#10003;</span>
                </div>`;
            });
            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // Text input listener
        if (step.qType === 'text') {
            const input = document.getElementById('textInput');
            input.addEventListener('input', () => {
                this.answers[step.id] = input.value.trim();
                this.updateNavButtons();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.value.trim()) this.nextStep();
            });
            setTimeout(() => input.focus(), 300);
        }

        this.updateNavButtons();
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    selectOption(qId, value, el) {
        this.answers[qId] = value;
        el.closest('.options-list').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        this.updateNavButtons();
        setTimeout(() => this.nextStep(), 500);
    },

    toggleMultiOption(qId, value, el, hasTextInput) {
        if (!this.answers[qId]) this.answers[qId] = [];
        const arr = this.answers[qId];
        const idx = arr.indexOf(value);
        if (idx > -1) {
            arr.splice(idx, 1);
            el.classList.remove('selected');
            el.querySelector('.option-checkbox').innerHTML = '';
        } else {
            arr.push(value);
            el.classList.add('selected');
            el.querySelector('.option-checkbox').innerHTML = '&#10003;';
        }
        if (hasTextInput) {
            const w = document.getElementById('otherInput_' + qId);
            if (w) {
                w.classList.toggle('show', arr.includes(value));
                if (arr.includes(value)) w.querySelector('input').focus();
            }
        }
        this.updateNavButtons();
    },

    updateNavButtons() {
        const step = this.allSteps[this.currentStepIndex];
        const btnNext = document.getElementById('btnNext');
        const btnBack = document.getElementById('btnBack');

        btnBack.style.display = this.currentStepIndex === 0 ? 'none' : '';

        if (step.stepType === 'intro') {
            btnNext.disabled = false;
            btnNext.innerHTML = "Let's Begin &#8594;";
            return;
        }

        const answer = this.answers[step.id];
        let hasAnswer = false;
        if (step.qType === 'text') hasAnswer = answer && answer.trim().length > 0;
        else if (step.qType === 'multi') hasAnswer = Array.isArray(answer) && answer.length > 0;
        else hasAnswer = !!answer;

        btnNext.disabled = !hasAnswer;
        const isLast = this.currentStepIndex === this.allSteps.length - 1;
        btnNext.innerHTML = isLast ? 'See My Results &#10148;' : 'Next &#8594;';
    },

    nextStep() {
        const step = this.allSteps[this.currentStepIndex];

        if (step.stepType === 'question') {
            const answer = this.answers[step.id];
            let hasAnswer = false;
            if (step.qType === 'text') hasAnswer = answer && answer.trim().length > 0;
            else if (step.qType === 'multi') hasAnswer = Array.isArray(answer) && answer.length > 0;
            else hasAnswer = !!answer;

            if (!hasAnswer) {
                const card = document.getElementById('questionCard');
                if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }
                return;
            }
        }

        if (this.currentStepIndex < this.allSteps.length - 1) {
            this.direction = 'right';
            this.currentStepIndex++;
            this.renderStep();
        } else {
            this.showResults();
        }
    },

    nextQuestion() { this.nextStep(); },

    prevQuestion() {
        if (this.currentStepIndex > 0) {
            this.direction = 'left';
            this.currentStepIndex--;
            this.renderStep();
        }
    },

    showResults() {
        this.results = ScoringEngine.calculateResults(this.answers);
        this.renderResults();
        this.showScreen('results');
    },

    renderResults() {
        const r = this.results;
        const container = document.getElementById('resultsContainer');
        const name = r.userName;

        const scoredSections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'];
        const sectionColors = ['#e8a87c', '#d4a853', '#4db89a', '#41b3a3', '#c38d9e', '#e27d60', '#85cdca'];

        const sectionBarsHTML = scoredSections.map((key, i) => {
            const s = r.sectionScores[key];
            return `<div class="result-bar-item">
                <div class="bar-label">${quizData.sections[key].icon}</div>
                <div class="bar-track">
                    <div class="bar-fill ${s.status}" style="width: ${s.percentage}%; background: ${sectionColors[i]};">${s.percentage}%</div>
                </div>
                <div class="bar-title">${s.title}</div>
                <div class="bar-status status-${s.status}">${s.status === 'strength' ? 'Strength' : s.status === 'growth' ? 'Growth Area' : 'Priority Gap'}</div>
            </div>`;
        }).join('');

        const tagsHTML = r.tags.length > 0
            ? r.tags.map(t => `<span class="result-tag">${t}</span>`).join('')
            : '';

        const challengesHTML = r.challenges.map(c => `<li>${c}</li>`).join('');
        const desiresHTML = r.desires.map(d => `<li>${d}</li>`).join('');

        // Readiness-based CTA
        let ctaHTML = '';
        if (r.readiness === 'high') {
            ctaHTML = `
                <h2>Your Next Step</h2>
                <p>You shared that you are <strong>fully ready to begin</strong> — and I believe you, ${name}.</p>
                <p>This is your moment. You don't have to carry this alone anymore.</p>
                <p>I want to personally invite you to a <strong>live masterclass</strong> where I will guide you step-by-step through:</p>
                <ul><li>How to stay calm instead of reacting</li><li>How to build a deeper connection with your child</li><li>How to create a peaceful, structured home</li></ul>
                <p><strong>You are ready for this. This is where everything begins to shift.</strong></p>`;
        } else if (r.readiness === 'medium') {
            ctaHTML = `
                <h2>Your Next Step</h2>
                <p>You don't have to figure this out alone, ${name}.</p>
                <p>I want to warmly invite you to a <strong>live masterclass</strong> where I will guide you through:</p>
                <ul><li>How to stay calm instead of reacting</li><li>How to build a deeper connection with your child</li><li>How to create a peaceful, structured home</li></ul>
                <p>This is not just another session. <strong>This is where real change begins.</strong></p>`;
        } else {
            ctaHTML = `
                <h2>A Gentle Invitation</h2>
                <p>Wherever you are right now is okay, ${name}. There is no pressure.</p>
                <p>But if something inside you is whispering, <em>"I want things to feel lighter…"</em> — I want you to know that support is available.</p>
                <p>I have a <strong>live masterclass</strong> where I gently walk you through:</p>
                <ul><li>How to stay calm instead of reacting</li><li>How to build a deeper connection with your child</li><li>How to bring more peace and structure into your home</li></ul>
                <p>No pressure. Just possibility. <strong>You deserve to feel supported.</strong></p>`;
        }

        container.innerHTML = `
            <div class="report-section report-header fade-in">
                <div class="report-icon-large">&#10024;</div>
                <h1>Your Personalised Parenting Report</h1>
                <p class="report-greeting">Dear <strong>${name}</strong>,</p>
                <p>Before you read this… just take a breath.</p>
                <p>The fact that you paused to do this today says everything about the kind of mother you already are. It means — you care. It means — you are trying. And it means — you are ready for something to change.</p>
            </div>

            <div class="report-section report-score fade-in" style="animation-delay:0.1s">
                <h2>Your Current Phase</h2>
                <div class="score-circle-wrapper">
                    <div class="score-circle">
                        <svg viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#e8e4de" stroke-width="8"/>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradient)" stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="${(r.percentage / 100) * 339.3} 339.3" transform="rotate(-90 60 60)" class="score-ring"/>
                            <defs><linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#4db89a"/><stop offset="100%" stop-color="#d4a853"/>
                            </linearGradient></defs>
                        </svg>
                        <div class="score-value">
                            <span class="score-num">${r.totalScore}</span>
                            <span class="score-max">/ ${r.maxScore}</span>
                        </div>
                    </div>
                </div>
                <div class="category-badge">${r.category.name}</div>
                <p class="category-desc">${r.category.description}</p>
            </div>

            <div class="report-section report-breakdown fade-in" style="animation-delay:0.2s">
                <h2>Your Section-wise Breakdown</h2>
                <div class="section-bars">${sectionBarsHTML}</div>
                <div class="legend">
                    <span class="legend-item"><span class="legend-dot strength"></span> Strength (80–100%)</span>
                    <span class="legend-item"><span class="legend-dot growth"></span> Growth Area (50–79%)</span>
                    <span class="legend-item"><span class="legend-dot priority"></span> Priority Gap (&lt;50%)</span>
                </div>
            </div>

            <div class="report-section fade-in" style="animation-delay:0.3s">
                <div class="insight-card insight-positive">
                    <div class="insight-icon">&#127775;</div>
                    <h3>Your Beautiful Strength</h3>
                    <p>One of your most powerful qualities is your <strong>${r.strongest.title}</strong> (${r.strongest.percentage}%).</p>
                    <p>This tells me something important — you are already showing up with love and intention in this area. Your child may not say it… but they are already feeling this from you.</p>
                </div>
            </div>

            <div class="report-section fade-in" style="animation-delay:0.4s">
                <div class="insight-card insight-gap">
                    <div class="insight-icon">&#128161;</div>
                    <h3>Your Silent Gap</h3>
                    <p>One area that may be quietly draining you is your <strong>${r.weakest.title}</strong> (${r.weakest.percentage}%).</p>
                    <p>This is not a flaw, ${name}. This is simply exhaustion from carrying too much alone — without enough support or clarity.</p>
                </div>
            </div>

            ${tagsHTML ? `
            <div class="report-section report-tags fade-in" style="animation-delay:0.45s">
                <h2>Your Profile Insights</h2>
                <div class="tags-wrapper">${tagsHTML}</div>
            </div>` : ''}

            ${(r.desires.length > 0 || r.challenges.length > 0) ? `
            <div class="report-section report-mirror fade-in" style="animation-delay:0.5s">
                <h2>What Your Heart Is Really Asking For</h2>
                ${r.desires.length > 0 ? `<p>From your answers, I can clearly see that right now, you deeply want to:</p><ul class="mirror-list desires">${desiresHTML}</ul>` : ''}
                ${r.challenges.length > 0 ? `<p>And at the same time, you are currently navigating:</p><ul class="mirror-list challenges">${challengesHTML}</ul>` : ''}
                <p class="mirror-truth">This tells me something important, ${name}. You are not lacking love. You are not lacking intention. You are simply missing the right support and system.</p>
            </div>` : ''}

            <div class="report-section fade-in" style="animation-delay:0.6s">
                <div class="truth-card">
                    <h3>The Truth Most Mothers Don't Realise</h3>
                    <p>This is not a parenting problem.</p>
                    <p>This is a <strong>support and guidance gap</strong>.</p>
                    <p>And the moment you get the right support… things don't just change for your child — they become lighter for <em>you</em>.</p>
                </div>
            </div>

            <div class="report-section report-need fade-in" style="animation-delay:0.65s">
                <h2>What You Need Now</h2>
                <p>Right now, what will truly help you is not more information. You need:</p>
                <div class="needs-grid">
                    <div class="need-item"><span>&#128218;</span> Step-by-step guidance</div>
                    <div class="need-item"><span>&#128155;</span> Emotional support</div>
                    <div class="need-item"><span>&#128295;</span> Practical daily tools</div>
                    <div class="need-item"><span>&#129309;</span> A space where you don't feel alone</div>
                </div>
            </div>

            <div class="report-section report-cta fade-in" style="animation-delay:0.7s">
                <div class="cta-card">
                    ${ctaHTML}
                    <div class="cta-heart">
                        <p><em>A Small Request From My Heart</em></p>
                        <p>When you come… come with openness. And please stay till the end. Because what I will share towards the end… can truly help you give your child what they deserve — and help you become the calm, confident mother you already want to be.</p>
                    </div>
                    <button class="btn btn-cta" onclick="window.open('https://www.riddhideorah.in/webinar-n', '_blank')">Join the Live Masterclass</button>
                </div>
            </div>

            <div class="report-section report-retake fade-in" style="animation-delay:0.8s">
                <button class="btn btn-secondary" onclick="app.restart()">&#8634; Retake Quiz</button>
            </div>
        `;
    },

    restart() {
        this.answers = {};
        this.currentStepIndex = 0;
        this.results = null;
        this.direction = 'right';
        this.allSteps = this.buildSteps(); // Re-shuffle options on retake
        this.showScreen('welcome');
    }
};

app.init();
