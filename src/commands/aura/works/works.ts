export interface Work {
    name: string;
    description: string;
    auraPoints: number;
    coolLevel: number;
    auraPointsToJoin: number;
}

export const works: ReadonlyArray<Work> = [{
    name: 'Janitor',
    description: 'Clean up the mess in the server fr fr 🧹',
    auraPoints: 50,
    coolLevel: 1,
    auraPointsToJoin: 0
} as const, {
    name: 'Discord Mod',
    description: 'Keep the vibes bussin no cap 🛡️',
    auraPoints: 100,
    coolLevel: 2,
    auraPointsToJoin: 500
} as const, {
    name: 'Meme Lord',
    description: 'Share the most fire memes ong 🔥',
    auraPoints: 200,
    coolLevel: 3,
    auraPointsToJoin: 1000
} as const, {
    name: 'Hype Beast',
    description: 'Keep the chat lit with that drip sheeeesh 💧',
    auraPoints: 300,
    coolLevel: 4,
    auraPointsToJoin: 2000
} as const, {
    name: 'Vibe Master',
    description: 'Pass them immaculate vibes bestie fr fr 💅',
    auraPoints: 500,
    coolLevel: 5,
    auraPointsToJoin: 3000
} as const, {
    name: 'Rizz Master',
    description: 'Teaching the art of smooth talk no cap 🎭',
    auraPoints: 600,
    coolLevel: 6,
    auraPointsToJoin: 4000
} as const, {
    name: 'Slay Queen',
    description: 'Periodt bestie you ate that up and left no crumbs 👑',
    auraPoints: 700,
    coolLevel: 7,
    auraPointsToJoin: 5000
}, {
    name: 'Tea Spiller',
    description: 'Dropping that hot gossip fr fr ☕',
    auraPoints: 800,
    coolLevel: 8,
    auraPointsToJoin: 6000
} as const, {
    name: 'Main Character',
    description: 'Living your best life while everyone watches bestie 💫',
    auraPoints: 900,
    coolLevel: 9,
    auraPointsToJoin: 7000
} as const, {
    name: 'Trend Setter',
    description: 'Starting them viral moments no cap 🌟',
    auraPoints: 1000,
    coolLevel: 10,
    auraPointsToJoin: 8000
} as const, {
    name: 'Clout Chaser',
    description: 'Securing that social media bag fr fr 📱',
    auraPoints: 1200,
    coolLevel: 11,
    auraPointsToJoin: 10000
} as const, {
    name: 'Ratio King',
    description: 'Destroying ops with them perfect ratios ong 📊',
    auraPoints: 1400,
    coolLevel: 12,
    auraPointsToJoin: 12000
} as const, {
    name: 'Cap Detector',
    description: 'Calling out fake news faster than light fr 🧢',
    auraPoints: 1600,
    coolLevel: 13,
    auraPointsToJoin: 14000
} as const, {
    name: 'Drip Lord',
    description: 'Stunting on them haters with that fresh fit 👔',
    auraPoints: 1800,
    coolLevel: 14,
    auraPointsToJoin: 16000
} as const, {
    name: 'Bussin Chef',
    description: 'Cooking up them viral recipes fr fr 👨‍🍳',
    auraPoints: 2000,
    coolLevel: 15,
    auraPointsToJoin: 18000
} as const, {
    name: 'Certified Baddie',
    description: 'The moment you walk in, everyone knows you valid af 💅',
    auraPoints: 2500,
    coolLevel: 16,
    auraPointsToJoin: 20000
} as const, {
    name: 'Gigachad',
    description: 'Built different fr no cap on god 💪',
    auraPoints: 3000,
    coolLevel: 17,
    auraPointsToJoin: 25000
} as const, {
    name: 'Goat',
    description: 'Straight bussin fr fr, no miss ever 🐐',
    auraPoints: 4000,
    coolLevel: 18,
    auraPointsToJoin: 30000
} as const, {
    name: 'Based God',
    description: 'Spitting straight facts 24/7 no cap fr fr 👑',
    auraPoints: 5000,
    coolLevel: 19,
    auraPointsToJoin: 40000
} as const, {
    name: 'CEO of Based Department',
    description: 'The most valid person alive ong fr fr no cap bussin respectfully 💯',
    auraPoints: 10000,
    coolLevel: 20,
    auraPointsToJoin: 50000
} as const] as const;