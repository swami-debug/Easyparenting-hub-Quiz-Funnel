const quizData = {
    sectionOrder: ['section0', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7', 'section8'],

    sections: {
        section0: {
            title: 'About You',
            subtitle: 'This will help me understand you better and personalise your results.',
            icon: '👤',
            scored: false,
            maxScore: 0,
            questions: [
                {
                    id: 's0q1',
                    text: 'What should I call you?',
                    type: 'text',
                    placeholder: 'Enter your name...'
                },
                {
                    id: 's0q2',
                    text: 'What is the age of your eldest child?',
                    type: 'single',
                    options: [
                        { label: 'A', text: '0–2 years', value: 'A' },
                        { label: 'B', text: '3–5 years', value: 'B' },
                        { label: 'C', text: '6–9 years', value: 'C' },
                        { label: 'D', text: '10–13 years', value: 'D' },
                        { label: 'E', text: '14+ years', value: 'E' }
                    ]
                },
                {
                    id: 's0q3',
                    text: 'Your age group is…',
                    type: 'single',
                    options: [
                        { label: 'A', text: '25–34 years', value: 'A' },
                        { label: 'B', text: '35–44 years', value: 'B' },
                        { label: 'C', text: '45–54 years', value: 'C' },
                        { label: 'D', text: '55 or above', value: 'D' }
                    ]
                },
                {
                    id: 's0q4',
                    text: 'Right now, you are…',
                    type: 'single',
                    options: [
                        { label: 'A', text: 'Homemaker', value: 'A' },
                        { label: 'B', text: 'Salaried Professional', value: 'B' },
                        { label: 'C', text: 'Business Owner', value: 'C' },
                        { label: 'D', text: 'Other', value: 'D', hasTextInput: true }
                    ]
                }
            ]
        },

        section1: {
            title: 'Connection & Bond with Your Child',
            subtitle: "Let's begin with your connection with your child… Choose what feels closest to your reality.",
            icon: '💛',
            scored: true,
            maxScore: 15,
            meaning: 'Emotional connection gap',
            questions: [
                {
                    id: 's1q1',
                    text: 'When it comes to spending one-on-one time with my child, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Rarely available', value: 'A', score: 1 },
                        { label: 'B', text: 'Often distracted', value: 'B', score: 2 },
                        { label: 'C', text: 'Inconsistent', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly present', value: 'D', score: 4 },
                        { label: 'E', text: 'Deeply connected', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's1q2',
                    text: 'When my child is feeling something big, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Not the first person they come to', value: 'A', score: 1 },
                        { label: 'B', text: 'Someone they hesitate to open up to', value: 'B', score: 2 },
                        { label: 'C', text: 'Someone they share a little with', value: 'C', score: 3 },
                        { label: 'D', text: 'Someone they feel comfortable with', value: 'D', score: 4 },
                        { label: 'E', text: 'Their safest space', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's1q4',
                    text: 'After a difficult moment or conflict with my child, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Someone who moves on without repairing', value: 'A', score: 1 },
                        { label: 'B', text: 'Someone who feels unsure how to reconnect', value: 'B', score: 2 },
                        { label: 'C', text: 'Someone who tries sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Someone who usually repairs and reconnects', value: 'D', score: 4 },
                        { label: 'E', text: 'Someone who always restores safety and connection', value: 'E', score: 5 }
                    ]
                }
            ]
        },

        section2: {
            title: 'Discipline, Boundaries & Reactions',
            subtitle: "Now let's gently look at how you respond in everyday moments… Choose what feels closest to your reality.",
            icon: '🛡️',
            scored: true,
            maxScore: 15,
            meaning: 'Discipline & reaction gap',
            questions: [
                {
                    id: 's2q1',
                    text: 'When it comes to setting rules and boundaries for my child, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Unclear or inconsistent', value: 'A', score: 1 },
                        { label: 'B', text: 'Trying but not steady', value: 'B', score: 2 },
                        { label: 'C', text: 'Sometimes clear', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly consistent', value: 'D', score: 4 },
                        { label: 'E', text: 'Clear and grounded', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's2q2',
                    text: "When I say 'no' to my child, I am…",
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Easily overwhelmed', value: 'A', score: 1 },
                        { label: 'B', text: 'Often reactive', value: 'B', score: 2 },
                        { label: 'C', text: 'Sometimes calm', value: 'C', score: 3 },
                        { label: 'D', text: 'Usually calm and firm', value: 'D', score: 4 },
                        { label: 'E', text: 'Calm, firm and respectful', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's2q3',
                    text: 'In difficult or stressful moments with my child, I am…',
                    type: 'single',
                    reverse: true,
                    options: [
                        { label: 'A', text: 'Often saying or doing things I regret', value: 'A', score: 5 },
                        { label: 'B', text: 'Losing my calm quickly', value: 'B', score: 4 },
                        { label: 'C', text: 'Reacting sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly mindful', value: 'D', score: 2 },
                        { label: 'E', text: 'Thoughtful and composed', value: 'E', score: 1 }
                    ]
                }
            ]
        },

        section3: {
            title: 'Your Emotional Space & Self-Care',
            subtitle: "Now let's pause and look at you… not just your child. Choose what feels closest to your reality.",
            icon: '🧘',
            scored: true,
            maxScore: 15,
            meaning: 'Emotional burnout / self gap',
            questions: [
                {
                    id: 's3q1',
                    text: 'When it comes to taking care of myself, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Always putting myself last', value: 'A', score: 1 },
                        { label: 'B', text: 'Wanting to, but not finding time', value: 'B', score: 2 },
                        { label: 'C', text: 'Taking care sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Making space for myself', value: 'D', score: 4 },
                        { label: 'E', text: 'Honouring myself consistently', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's3q2',
                    text: 'When it comes to handling my emotions, I am…',
                    type: 'single',
                    reverse: true,
                    options: [
                        { label: 'A', text: 'Bottling everything inside', value: 'A', score: 5 },
                        { label: 'B', text: 'Feeling overwhelmed often', value: 'B', score: 4 },
                        { label: 'C', text: 'Releasing sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Expressing in healthy ways', value: 'D', score: 2 },
                        { label: 'E', text: 'Feeling supported and emotionally held', value: 'E', score: 1 }
                    ]
                },
                {
                    id: 's3q4',
                    text: 'By the end of most days, I am…',
                    type: 'single',
                    reverse: true,
                    options: [
                        { label: 'A', text: 'Completely drained', value: 'A', score: 5 },
                        { label: 'B', text: 'Emotionally exhausted', value: 'B', score: 4 },
                        { label: 'C', text: 'Tired but managing', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly balanced', value: 'D', score: 2 },
                        { label: 'E', text: 'Energised and fulfilled', value: 'E', score: 1 }
                    ]
                }
            ]
        },

        section4: {
            title: 'Communication & Listening',
            subtitle: "Now let's look at how you and your child communicate with each other… Choose what feels closest to your reality.",
            icon: '💬',
            scored: true,
            maxScore: 10,
            meaning: 'Communication gap',
            questions: [
                {
                    id: 's4q1',
                    text: 'When my child is sharing something with me, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Listening partially', value: 'A', score: 1 },
                        { label: 'B', text: 'Getting distracted or interrupting', value: 'B', score: 2 },
                        { label: 'C', text: 'Listening, but also correcting quickly', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly listening fully', value: 'D', score: 4 },
                        { label: 'E', text: 'Fully present and deeply listening', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's4q2',
                    text: 'When my child expresses difficult emotions, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Dismissing or shutting it down', value: 'A', score: 1 },
                        { label: 'B', text: 'Feeling uncomfortable', value: 'B', score: 2 },
                        { label: 'C', text: 'Allowing sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly accepting', value: 'D', score: 4 },
                        { label: 'E', text: 'Holding space with calm and understanding', value: 'E', score: 5 }
                    ]
                }
            ]
        },

        section5: {
            title: 'Home Environment, Routines & Screens',
            subtitle: "Now let's look at the environment your child is growing up in… Choose what feels closest to your reality.",
            icon: '🏠',
            scored: true,
            maxScore: 10,
            meaning: 'Environment / structure gap',
            questions: [
                {
                    id: 's5q1',
                    text: 'On most days, the atmosphere in my home feels…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Chaotic and overwhelming', value: 'A', score: 1 },
                        { label: 'B', text: 'Rushed and noisy', value: 'B', score: 2 },
                        { label: 'C', text: 'A mix of calm and stress', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly calm', value: 'D', score: 4 },
                        { label: 'E', text: 'Peaceful and nurturing', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's5q3',
                    text: "When it comes to my child's screen time, I am…",
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Struggling to manage it', value: 'A', score: 1 },
                        { label: 'B', text: "Allowing more than I'd like", value: 'B', score: 2 },
                        { label: 'C', text: 'Moderately managing it', value: 'C', score: 3 },
                        { label: 'D', text: 'Mindful about limits', value: 'D', score: 4 },
                        { label: 'E', text: 'Clear and intentional with screen habits', value: 'E', score: 5 }
                    ]
                }
            ]
        },

        section6: {
            title: 'Faith, Values & Conscious Parenting',
            subtitle: "Now let's look at the values and deeper foundations you are building for your child… Choose what feels closest to your reality.",
            icon: '🌿',
            scored: true,
            maxScore: 10,
            meaning: 'Values / depth gap',
            questions: [
                {
                    id: 's6q1',
                    text: 'When it comes to introducing my child to values or spiritual practices, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Not doing it currently', value: 'A', score: 1 },
                        { label: 'B', text: 'Wanting to, but unsure how', value: 'B', score: 2 },
                        { label: 'C', text: 'Doing it occasionally', value: 'C', score: 3 },
                        { label: 'D', text: 'Including it regularly', value: 'D', score: 4 },
                        { label: 'E', text: 'Creating meaningful, consistent practices', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's6q2',
                    text: 'When it comes to teaching values like kindness, honesty and patience, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Not focusing on it consciously', value: 'A', score: 1 },
                        { label: 'B', text: 'Hoping my child learns on their own', value: 'B', score: 2 },
                        { label: 'C', text: 'Guiding sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Teaching through daily moments', value: 'D', score: 4 },
                        { label: 'E', text: 'Living and reinforcing these values consistently', value: 'E', score: 5 }
                    ]
                }
            ]
        },

        section7: {
            title: 'Support System & Co-Parenting',
            subtitle: "Now let's look at the support you have around you… Choose what feels closest to your reality.",
            icon: '🤝',
            scored: true,
            maxScore: 10,
            meaning: 'Support system gap',
            questions: [
                {
                    id: 's7q1',
                    text: 'When it comes to my partner / co-parent and me, we are…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Not aligned at all', value: 'A', score: 1 },
                        { label: 'B', text: 'Often disagreeing', value: 'B', score: 2 },
                        { label: 'C', text: 'Sometimes aligned', value: 'C', score: 3 },
                        { label: 'D', text: 'Mostly on the same page', value: 'D', score: 4 },
                        { label: 'E', text: 'Deeply aligned and supportive', value: 'E', score: 5 }
                    ]
                },
                {
                    id: 's7q2',
                    text: 'When I feel overwhelmed as a mother, I am…',
                    type: 'single',
                    reverse: false,
                    options: [
                        { label: 'A', text: 'Keeping it all inside', value: 'A', score: 1 },
                        { label: 'B', text: 'Hesitant to ask for help', value: 'B', score: 2 },
                        { label: 'C', text: 'Reaching out sometimes', value: 'C', score: 3 },
                        { label: 'D', text: 'Asking for support when needed', value: 'D', score: 4 },
                        { label: 'E', text: 'Openly supported and held', value: 'E', score: 5 }
                    ]
                }
            ]
        },

        section8: {
            title: 'Your Current Challenges & Goals',
            subtitle: 'This helps us understand where you are right now and how we can support you best.',
            icon: '🎯',
            scored: false,
            maxScore: 0,
            questions: [
                {
                    id: 's8q1',
                    text: 'Right now, the areas where I feel most challenged as a mother are…',
                    type: 'multi',
                    note: 'Choose all that apply',
                    options: [
                        { label: 'A', text: "My child doesn't listen or cooperate", value: 'A' },
                        { label: 'B', text: 'I lose my calm and feel guilty later', value: 'B' },
                        { label: 'C', text: 'Sibling conflicts or jealousy', value: 'C' },
                        { label: 'D', text: 'Screen time feels hard to manage', value: 'D' },
                        { label: 'E', text: 'Lack of routines and consistency', value: 'E' },
                        { label: 'F', text: 'My child feels sensitive, anxious or fearful', value: 'F' },
                        { label: 'G', text: "I don't feel supported enough", value: 'G' },
                        { label: 'H', text: 'I sometimes feel I am not enough as a mother', value: 'H' }
                    ]
                },
                {
                    id: 's8q2',
                    text: 'If I could gently change one thing in my parenting in the next 30 days, I would want to…',
                    type: 'multi',
                    note: 'Choose all that apply',
                    options: [
                        { label: 'A', text: 'Stay calm instead of reacting', value: 'A' },
                        { label: 'B', text: 'Build a deeper connection with my child', value: 'B' },
                        { label: 'C', text: 'Help my child listen and cooperate better', value: 'C' },
                        { label: 'D', text: 'Create more structure and routine at home', value: 'D' },
                        { label: 'E', text: 'Reduce screen time and be more intentional', value: 'E' },
                        { label: 'F', text: 'Feel more confident and less guilty as a mother', value: 'F' },
                        { label: 'G', text: "Handle my child's emotions with more patience", value: 'G' },
                        { label: 'H', text: "Feel more supported and not do this alone", value: 'H' },
                        { label: 'I', text: "Something else", value: 'I', hasTextInput: true }
                    ]
                },
                {
                    id: 's8q3',
                    text: 'When it comes to following a structured parenting plan, I am…',
                    type: 'single',
                    options: [
                        { label: 'A', text: 'Not ready right now', value: 'A' },
                        { label: 'B', text: 'Thinking about it for later', value: 'B' },
                        { label: 'C', text: 'Ready, but I need support', value: 'C' },
                        { label: 'D', text: 'Fully ready to begin now', value: 'D' }
                    ]
                }
            ]
        }
    },

    categories: [
        { id: 'survival', name: 'Survival Mode Mother', range: [0, 35], description: "Right now, you are in a phase where you are doing your best… but it often feels overwhelming, exhausting, and emotionally heavy. There is so much love in you… but very little support and space to hold everything you are carrying." },
        { id: 'aware', name: 'Aware but Struggling Mother', range: [36, 57], description: "You already understand so much about what your child needs. But somewhere between daily life, responsibilities, and emotional overwhelm… it becomes hard to stay consistent. You try, you reflect… and sometimes you feel guilty." },
        { id: 'conscious', name: 'Conscious Growing Mother', range: [58, 74], description: "You are already a conscious and aware mother. You pause, reflect, and genuinely want to grow. You are not stuck — you are evolving. And with the right guidance, you can create deep transformation." },
        { id: 'aligned', name: 'Aligned & Evolving Mother', range: [75, 85], description: "You have built a strong foundation of awareness and connection. You are already parenting with intention. Now, your journey is about deepening, refining, and expanding that awareness." }
    ],

    sectionLabels: {
        section1: 'Connection & Bond',
        section2: 'Discipline & Boundaries',
        section3: 'Emotional Space & Self-Care',
        section4: 'Communication & Listening',
        section5: 'Home Environment & Routines',
        section6: 'Faith, Values & Conscious Parenting',
        section7: 'Support System & Co-Parenting'
    },

    intelligentTags: {
        section1: 'Connection Gap',
        section2: 'Reactive Discipline Pattern',
        section3: 'Emotionally Drained Mother',
        section4: 'Communication Gap',
        section5: 'Environment / Structure Gap',
        section6: 'Values / Depth Gap',
        section7: 'Lack of Support System'
    }
};
