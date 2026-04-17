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

        const answer = this.answers[step.id];
        let hasAnswer = false;
        if (step.qType === 'text') hasAnswer = answer && answer.trim().length > 0;
        else if (step.qType === 'multi') hasAnswer = Array.isArray(answer) && answer.length > 0;
        else hasAnswer = !!answer;

        // Hide Next for single-select (auto-advances on click)
        if (step.qType === 'single') {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = '';
            btnNext.disabled = !hasAnswer;
            const isLast = this.currentStepIndex === this.allSteps.length - 1;
            btnNext.innerHTML = isLast ? 'See My Results &#10148;' : 'Next &#8594;';
        }

        // Center nav when only one button is visible
        const nav = document.querySelector('.quiz-nav');
        const backVisible = btnBack.style.display !== 'none';
        const nextVisible = btnNext.style.display !== 'none';
        nav.style.justifyContent = (backVisible && nextVisible) ? 'space-between' : 'center';
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
            this.showContactCapture();
        }
    },

    nextQuestion() {
        if (this._contactMode) {
            this.showResults();
            return;
        }
        this.nextStep();
    },

    prevQuestion() {
        if (this._contactMode) {
            this._contactMode = false;
            this.direction = 'left';
            this.renderStep();
            return;
        }
        if (this.currentStepIndex > 0) {
            this.direction = 'left';
            this.currentStepIndex--;
            this.renderStep();
        }
    },

    showContactCapture() {
        const container = document.getElementById('quiz-content');
        const btnNext = document.getElementById('btnNext');
        const btnBack = document.getElementById('btnBack');

        btnBack.style.display = '';
        btnNext.style.display = '';
        btnNext.innerHTML = 'See My Results &#10148;';
        btnNext.disabled = true;
        document.querySelector('.quiz-nav').style.justifyContent = 'space-between';

        // Update progress to 100%
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('progressCount').textContent = '100% Complete';
        document.getElementById('progressSection').textContent = 'Almost There!';

        const anim = 'slide-in-right';
        const emailVal = this.answers._email || '';
        const phoneVal = this.answers._phone || '';

        container.innerHTML = `
            <div class="question-card ${anim}" id="questionCard">
                <div class="contact-capture-header">
                    <span class="contact-icon">&#127881;</span>
                    <h2 class="question-text">Your report is ready!</h2>
                    <p class="contact-subtitle">Enter your details below to unlock your personalised parenting report.</p>
                </div>
                <div class="input-group" style="margin-bottom: 1rem;">
                    <label class="input-label">Email Address <span class="required">*</span></label>
                    <input type="email" class="text-input" id="contactEmail"
                        placeholder="your@email.com"
                        value="${this.escapeHtml(emailVal)}" autocomplete="email">
                </div>
                <div class="input-group">
                    <label class="input-label">Phone Number <span class="optional-label">(optional)</span></label>
                    <input type="tel" class="text-input" id="contactPhone"
                        placeholder="+91 98765 43210"
                        value="${this.escapeHtml(phoneVal)}" autocomplete="tel">
                </div>
                <p class="contact-privacy">&#128274; Your information is 100% private and will never be shared.</p>
            </div>`;

        this.currentScreen = 'contact';

        const emailInput = document.getElementById('contactEmail');
        const phoneInput = document.getElementById('contactPhone');

        const validateEmail = () => {
            const email = emailInput.value.trim();
            this.answers._email = email;
            this.answers._phone = phoneInput.value.trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            btnNext.disabled = !isValid;
        };

        emailInput.addEventListener('input', validateEmail);
        phoneInput.addEventListener('input', validateEmail);
        emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !btnNext.disabled) this.showResults();
        });
        phoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !btnNext.disabled) this.showResults();
        });

        // Store original nextQuestion handler and override
        this._contactMode = true;

        setTimeout(() => emailInput.focus(), 300);
        validateEmail();
    },

    showResults() {
        this._contactMode = false;
        // Save final contact values
        const emailInput = document.getElementById('contactEmail');
        const phoneInput = document.getElementById('contactPhone');
        if (emailInput) this.answers._email = emailInput.value.trim();
        if (phoneInput) this.answers._phone = phoneInput.value.trim();

        this.results = ScoringEngine.calculateResults(this.answers);
        this.sendToGHL();
        this.renderResults();
        this.showScreen('results');
    },

    getOptionText(questionId, value) {
        for (const sectionKey of quizData.sectionOrder) {
            const section = quizData.sections[sectionKey];
            const question = section.questions.find(q => q.id === questionId);
            if (question && question.options) {
                const opt = question.options.find(o => o.value === value);
                if (opt) return opt.text;
            }
        }
        return value;
    },

    sendToGHL() {
        const r = this.results;
        const payload = {
            name: r.userName,
            email: this.answers._email || '',
            phone: this.answers._phone || '',
            childAge: this.getOptionText('s0q2', this.answers['s0q2'] || ''),
            parentStatus: this.getOptionText('s0q3', this.answers['s0q3'] || ''),
            totalScore: r.totalScore,
            maxScore: r.maxScore,
            scorePercentage: r.percentage,
            category: r.category.name,
            strongestArea: r.strongest.title,
            strongestPercentage: r.strongest.percentage,
            weakestArea: r.weakest.title,
            weakestPercentage: r.weakest.percentage,
            readiness: r.readiness,
            challenges: r.challenges.join(', '),
            desires: r.desires.join(', '),
            tags: r.tags.join(', '),
            sectionScores: Object.entries(r.sectionScores).map(([key, s]) =>
                `${s.title}: ${s.percentage}% (${s.status})`
            ).join(' | ') + '\n\n--- QUIZ ANSWERS ---\n' + this._formatAllAnswers()
        };

        fetch('https://services.leadconnectorhq.com/hooks/ajGJHXmpR6eGMS0oB59e/webhook-trigger/e30eb87b-512a-40b4-baed-0177d535f071', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {
            // Silently fail — don't block the user from seeing results
        });
    },

    _formatAllAnswers() {
        const lines = [];
        quizData.sectionOrder.forEach(sectionKey => {
            const section = quizData.sections[sectionKey];
            lines.push(`--- ${section.title} ---`);
            section.questions.forEach(q => {
                const answer = this.answers[q.id];
                if (!answer) return;
                let answerText = '';
                if (q.type === 'text') {
                    answerText = answer;
                } else if (q.type === 'multi' && Array.isArray(answer)) {
                    answerText = answer.map(v => {
                        const opt = q.options.find(o => o.value === v);
                        return opt ? opt.text : v;
                    }).join(', ');
                    if (this.answers[q.id + '_other']) {
                        answerText += ` (Other: ${this.answers[q.id + '_other']})`;
                    }
                } else {
                    const opt = q.options ? q.options.find(o => o.value === answer) : null;
                    answerText = opt ? opt.text : answer;
                }
                lines.push(`Q: ${q.text}`);
                lines.push(`A: ${answerText}`);
                lines.push('');
            });
        });
        return lines.join('\n');
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
                    <button class="btn btn-cta" onclick="window.open('https://riddhideorah.in/thank-you-webinar-g/', '_blank')">Join the Live Masterclass</button>
                </div>
            </div>

            <div class="report-section report-retake fade-in" style="animation-delay:0.8s">
                <button class="btn btn-secondary" onclick="app.restart()">&#8634; Retake Quiz</button>
            </div>
        `;
    },

    openMasterclassModal() {
        const name = this.results ? this.results.userName : '';
        const modal = document.createElement('div');
        modal.className = 'mc-modal-overlay';
        modal.id = 'masterclassModal';
        modal.innerHTML = `
            <div class="mc-modal">
                <button class="mc-modal-close" onclick="app.closeMasterclassModal()">&times;</button>
                <div id="mcModalContent">
                    ${this._renderSignupState(name)}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) app.closeMasterclassModal();
        });
    },

    _renderSignupState(name) {
        return `
            <div class="mc-signup-state">
                <div class="mc-icon">&#127891;</div>
                <h2>Sign Me Up for the Live Masterclass</h2>
                <div class="mc-details">
                    <div class="mc-detail-row">
                        <span class="mc-detail-icon">&#128197;</span>
                        <div>
                            <strong>Date:</strong> Every Saturday
                        </div>
                    </div>
                    <div class="mc-detail-row">
                        <span class="mc-detail-icon">&#128336;</span>
                        <div>
                            <strong>Time:</strong> 11:00 AM IST
                        </div>
                    </div>
                    <div class="mc-detail-row">
                        <span class="mc-detail-icon">&#128178;</span>
                        <div>
                            <strong>Fee:</strong> Completely FREE
                        </div>
                    </div>
                </div>
                <p class="mc-note">You're signing up as <strong>${name}</strong>. No need to fill any forms again!</p>
                <button class="btn btn-cta mc-signup-btn" onclick="app.signUpForMasterclass()">Sign Me Up</button>
                <button class="btn btn-link mc-details-link" onclick="app.showMasterclassDetails()">See More Details</button>
            </div>
        `;
    },

    _renderSuccessState(name) {
        return `
            <div class="mc-success-state">
                <div class="mc-success-icon">&#9989;</div>
                <h2>You're Successfully Signed Up!</h2>
                <p>Congratulations, <strong>${name}</strong>! You've taken a beautiful step for yourself and your child.</p>
                <div class="mc-whatsapp-box">
                    <div class="mc-whatsapp-icon">&#128172;</div>
                    <h3>Join Our WhatsApp Community</h3>
                    <p>Connect with other mothers who are on the same journey. Share, learn, and grow together.</p>
                    <a href="https://chat.whatsapp.com/YOUR_GROUP_LINK" target="_blank" class="btn mc-whatsapp-btn">
                        Join the Community
                    </a>
                </div>
                <button class="btn btn-link mc-details-link" onclick="app.showMasterclassDetails()">See More Details About the Masterclass</button>
                <button class="btn btn-link mc-close-link" onclick="app.closeMasterclassModal()">Close</button>
            </div>
        `;
    },

    _renderDetailsState() {
        return `
            <div class="mc-details-state">
                <button class="mc-back-link" onclick="app.goBackInModal()">&#8592; Back</button>
                <div class="mc-icon">&#127891;</div>
                <h2>What You'll Learn in the Live Masterclass</h2>
                <div class="mc-learn-list">
                    <div class="mc-learn-item">
                        <span class="mc-learn-icon">&#128155;</span>
                        <div>
                            <strong>Stay Calm Instead of Reacting</strong>
                            <p>Learn practical techniques to manage your triggers and respond with patience — even on hard days.</p>
                        </div>
                    </div>
                    <div class="mc-learn-item">
                        <span class="mc-learn-icon">&#129309;</span>
                        <div>
                            <strong>Build a Deeper Connection with Your Child</strong>
                            <p>Discover how to truly understand what your child needs and create a bond built on trust and love.</p>
                        </div>
                    </div>
                    <div class="mc-learn-item">
                        <span class="mc-learn-icon">&#127968;</span>
                        <div>
                            <strong>Create a Peaceful, Structured Home</strong>
                            <p>Simple routines and strategies that bring calm and cooperation into your daily life.</p>
                        </div>
                    </div>
                    <div class="mc-learn-item">
                        <span class="mc-learn-icon">&#127775;</span>
                        <div>
                            <strong>Become the Confident Mother You Want to Be</strong>
                            <p>Release guilt and step into your parenting with clarity, strength, and joy.</p>
                        </div>
                    </div>
                </div>
                <div class="mc-host-box">
                    <h3>Hosted by Riddhi Deorah</h3>
                    <p>Parenting coach and founder of EasyParenting Hub, helping thousands of mothers transform their parenting journey.</p>
                </div>
            </div>
        `;
    },

    signUpForMasterclass() {
        const btn = document.querySelector('.mc-signup-btn');
        btn.disabled = true;
        btn.textContent = 'Signing you up...';

        const r = this.results;
        const payload = {
            name: r.userName,
            email: this.answers._email || '',
            phone: this.answers._phone || '',
            source: 'quiz_masterclass_signup',
            category: r.category.name,
            totalScore: r.totalScore,
            readiness: r.readiness
        };

        fetch('https://services.leadconnectorhq.com/hooks/ajGJHXmpR6eGMS0oB59e/webhook-trigger/e30eb87b-512a-40b4-baed-0177d535f071', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => {
            this._showModalSuccess();
        }).catch(() => {
            // Still show success — don't block the user
            this._showModalSuccess();
        });
    },

    _showModalSuccess() {
        const name = this.results ? this.results.userName : '';
        const content = document.getElementById('mcModalContent');
        content.innerHTML = this._renderSuccessState(name);
        this._modalPreviousState = 'success';
    },

    _modalPreviousState: 'signup',

    showMasterclassDetails() {
        const content = document.getElementById('mcModalContent');
        this._modalPreviousState = content.querySelector('.mc-success-state') ? 'success' : 'signup';
        content.innerHTML = this._renderDetailsState();
    },

    goBackInModal() {
        const content = document.getElementById('mcModalContent');
        const name = this.results ? this.results.userName : '';
        if (this._modalPreviousState === 'success') {
            content.innerHTML = this._renderSuccessState(name);
        } else {
            content.innerHTML = this._renderSignupState(name);
        }
    },

    closeMasterclassModal() {
        const modal = document.getElementById('masterclassModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
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
