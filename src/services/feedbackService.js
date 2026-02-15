// FaithTrack Feedback Service — pace analysis, suggestions, motivational verses

const BIBLE_VERSES = {
    financial: [
        { text: 'Honor the Lord with your wealth, with the firstfruits of all your crops.', ref: 'Proverbs 3:9' },
        { text: 'For where your treasure is, there your heart will be also.', ref: 'Matthew 6:21' },
        { text: 'The plans of the diligent lead surely to abundance.', ref: 'Proverbs 21:5' },
        { text: 'Whoever can be trusted with very little can also be trusted with much.', ref: 'Luke 16:10' },
        { text: 'But remember the Lord your God, for it is he who gives you the ability to produce wealth.', ref: 'Deuteronomy 8:18' },
    ],
    spiritual: [
        { text: 'Your word is a lamp for my feet, a light on my path.', ref: 'Psalm 119:105' },
        { text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.', ref: '2 Timothy 3:16' },
        { text: 'Do not merely listen to the word, and so deceive yourselves. Do what it says.', ref: 'James 1:22' },
        { text: 'How sweet are your words to my taste, sweeter than honey to my mouth!', ref: 'Psalm 119:103' },
        { text: 'Let the message of Christ dwell among you richly.', ref: 'Colossians 3:16' },
    ],
    custom: [
        { text: 'Commit to the Lord whatever you do, and he will establish your plans.', ref: 'Proverbs 16:3' },
        { text: 'I can do all this through him who gives me strength.', ref: 'Philippians 4:13' },
        { text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.', ref: 'Galatians 6:9' },
        { text: 'Whatever you do, work at it with all your heart, as working for the Lord.', ref: 'Colossians 3:23' },
        { text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', ref: 'Joshua 1:9' },
    ],
};

/**
 * Analyze pace: returns { status, message, daysLeft, projectedFinish, requiredPace, currentPace }
 * status: 'ahead' | 'on-track' | 'behind' | 'completed'
 */
export function analyzePace(resolution) {
    const { target, current, deadline, createdAt, entries } = resolution;
    const percent = target > 0 ? (current / target) * 100 : 0;

    if (percent >= 100) {
        return {
            status: 'completed',
            message: '🎉 Congratulations! You\'ve completed this resolution!',
            percent: 100,
        };
    }

    const now = new Date();
    const start = new Date(createdAt);
    const end = new Date(deadline);
    const totalDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.max(1, (now - start) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, (end - now) / (1000 * 60 * 60 * 24));

    const expectedPercent = (daysElapsed / totalDays) * 100;
    const currentPace = current / daysElapsed; // units per day
    const remaining = target - current;
    const requiredPace = daysLeft > 0 ? remaining / daysLeft : remaining;

    // Project when they'll finish at current pace
    const daysToFinish = currentPace > 0 ? remaining / currentPace : Infinity;
    const projectedFinish = new Date(now.getTime() + daysToFinish * 24 * 60 * 60 * 1000);

    let status, message;

    if (percent >= expectedPercent + 5) {
        status = 'ahead';
        message = `🚀 You're ahead of schedule! ${Math.round(percent)}% complete vs ${Math.round(expectedPercent)}% expected.`;
    } else if (percent >= expectedPercent - 5) {
        status = 'on-track';
        message = `✅ You're right on track! ${Math.round(percent)}% complete.`;
    } else {
        status = 'behind';
        message = `⚠️ You're falling behind. ${Math.round(percent)}% complete but ${Math.round(expectedPercent)}% expected by now.`;
    }

    return {
        status,
        message,
        percent: Math.round(percent),
        daysLeft: Math.round(daysLeft),
        projectedFinish: projectedFinish.toLocaleDateString(),
        requiredPace: Math.round(requiredPace * 100) / 100,
        currentPace: Math.round(currentPace * 100) / 100,
        totalDays: Math.round(totalDays),
        daysElapsed: Math.round(daysElapsed),
    };
}

/**
 * Get suggestions based on pace analysis.
 */
export function getSuggestions(resolution) {
    const pace = analyzePace(resolution);
    const suggestions = [];
    const { category, unit, target, current } = resolution;
    const remaining = target - current;

    if (pace.status === 'completed') {
        suggestions.push('Keep setting new goals — growth never stops!');
        suggestions.push('Consider mentoring someone else on their journey.');
        return suggestions;
    }

    if (pace.status === 'behind') {
        if (category === 'financial') {
            suggestions.push(
                `Increase your daily saving to ${pace.requiredPace.toLocaleString()} ${unit} to finish on time.`
            );
            suggestions.push('Look for ways to cut unnecessary expenses this week.');
            suggestions.push('Consider setting up automatic transfers to your savings.');
        } else if (category === 'spiritual') {
            suggestions.push(
                `Try reading ${Math.ceil(pace.requiredPace)} chapters per day to catch up.`
            );
            suggestions.push('Set a specific time each day for reading — mornings work great!');
            suggestions.push('Try an audio Bible during commutes to add extra chapters.');
        } else {
            suggestions.push(
                `You need to complete ${pace.requiredPace.toLocaleString()} ${unit} per day to finish on time.`
            );
            suggestions.push('Break your goal into smaller weekly targets.');
        }
    } else if (pace.status === 'on-track') {
        suggestions.push('Great consistency! Keep up this pace.');
        suggestions.push('Try to push a little harder this week to build a buffer.');
        if (category === 'spiritual') {
            suggestions.push('Consider journaling your reflections on what you read.');
        }
    } else {
        suggestions.push('Amazing progress! You could finish early at this rate.');
        suggestions.push('Consider increasing your target — aim even higher!');
        if (category === 'financial') {
            suggestions.push('Think about investing your surplus to grow your savings.');
        }
    }

    return suggestions;
}

/**
 * Get a motivational Bible verse for the given category.
 */
export function getMotivationalVerse(category) {
    const verses = BIBLE_VERSES[category] || BIBLE_VERSES.custom;
    return verses[Math.floor(Math.random() * verses.length)];
}
