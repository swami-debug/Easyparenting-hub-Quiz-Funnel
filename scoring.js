const ScoringEngine = {
    calculateResults(answers) {
        const sectionScores = {};
        const scoredSections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'];
        let totalScore = 0;

        // Calculate score for each scored section
        scoredSections.forEach(sectionKey => {
            const section = quizData.sections[sectionKey];
            let sectionScore = 0;

            section.questions.forEach(q => {
                const answer = answers[q.id];
                if (answer) {
                    const selectedOption = q.options.find(o => o.value === answer);
                    if (selectedOption) {
                        sectionScore += selectedOption.score;
                    }
                }
            });

            const percentage = Math.round((sectionScore / section.maxScore) * 100);
            sectionScores[sectionKey] = {
                score: sectionScore,
                maxScore: section.maxScore,
                percentage,
                status: percentage >= 80 ? 'strength' : percentage >= 50 ? 'growth' : 'priority',
                title: quizData.sectionLabels[sectionKey],
                meaning: section.meaning
            };
            totalScore += sectionScore;
        });

        // Determine category
        const category = quizData.categories.find(c => totalScore >= c.range[0] && totalScore <= c.range[1])
            || quizData.categories[0];

        // Find strongest and weakest sections
        const sortedSections = Object.entries(sectionScores).sort((a, b) => a[1].percentage - b[1].percentage);
        const weakest = sortedSections[0];
        const secondWeakest = sortedSections[1];
        const strongest = sortedSections[sortedSections.length - 1];

        // Intelligent tags
        const tags = [];
        sortedSections.forEach(([key, data]) => {
            if (data.status === 'priority') {
                tags.push(quizData.intelligentTags[key]);
            }
        });

        // Readiness scoring from Section 8
        const s8q3 = answers['s8q3'] || '';
        const s8q4 = answers['s8q4'] || '';
        let readiness = 'low';
        if ((s8q3 === 'C' || s8q3 === 'D') && (s8q4 === 'C' || s8q4 === 'D')) {
            readiness = 'high';
        } else if (s8q3 === 'C' || s8q3 === 'D' || s8q4 === 'C' || s8q4 === 'D') {
            readiness = 'medium';
        }

        // Section 8 challenges and desires
        const challenges = [];
        const desires = [];
        const s8q1 = answers['s8q1'] || [];
        const s8q2 = answers['s8q2'] || [];

        if (Array.isArray(s8q1)) {
            const s8q1Options = quizData.sections.section8.questions[0].options;
            s8q1.forEach(v => {
                const opt = s8q1Options.find(o => o.value === v);
                if (opt) challenges.push(opt.text);
            });
        }
        if (Array.isArray(s8q2)) {
            const s8q2Options = quizData.sections.section8.questions[1].options;
            s8q2.forEach(v => {
                const opt = s8q2Options.find(o => o.value === v);
                if (opt) desires.push(opt.text);
            });
        }

        return {
            totalScore,
            maxScore: 120,
            percentage: Math.round((totalScore / 120) * 100),
            category,
            sectionScores,
            strongest: { key: strongest[0], ...strongest[1] },
            weakest: { key: weakest[0], ...weakest[1] },
            secondWeakest: { key: secondWeakest[0], ...secondWeakest[1] },
            tags,
            readiness,
            challenges: challenges.slice(0, 2),
            desires: desires.slice(0, 2),
            userName: answers['s0q1'] || 'Friend'
        };
    }
};
