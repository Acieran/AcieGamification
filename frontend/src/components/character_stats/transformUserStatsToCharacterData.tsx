import type {StatType, UserStats} from "../../types";

function getRandomTwoDecimalPlaces(): number {
    const randomNumber = Math.random(); // Generates a number between 0 (inclusive) and 1 (exclusive)
    const scaledNumber = randomNumber * 100; // Scales to move two decimal places to the left
    const roundedNumber = Math.round(scaledNumber); // Rounds to the nearest whole number
    return roundedNumber / 100; // Scales back to get two decimal places
}

export const transformUserStatsToCharacterData = (data: UserStats | null) => {
    const safeData = data && 'energy' in data ? data : {} as UserStats;
    // Расчет прогресса уровня
    const xpForNextLevel = 1000;

    const energy = safeData.energy ?? getRandomTwoDecimalPlaces();
    const strength = safeData.strength ?? getRandomTwoDecimalPlaces();
    const agility = safeData.agility ?? getRandomTwoDecimalPlaces();
    const intelligence = safeData.intelligence ?? getRandomTwoDecimalPlaces();
    const focus = safeData.focus ?? getRandomTwoDecimalPlaces();
    const xp = safeData.xp ?? 0;
    const level = safeData.level ?? 0;
    const health = safeData.health ?? getRandomTwoDecimalPlaces() * 100;
    const resource = safeData.resource ?? getRandomTwoDecimalPlaces() * 100;
    const gold = safeData.gold ?? 0;

    const currentLevelXp = xp % xpForNextLevel;
    const levelProgress = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);
    const xpToNextLevel = xpForNextLevel - currentLevelXp;

    return {
        stats: [
            {
                type: 'energy' as StatType,
                name: '⚡️ Энергия',
                icon: '⚡️',
                value: `${energy}%`,
                progress: energy
            },
            {
                type: 'strength' as StatType,
                name: '💪 Сила',
                icon: '💪',
                value: `${strength}%`,
                progress: strength
            },
            {
                type: 'agility' as StatType,
                name: '⚡️ Ловкость',
                icon: '⚡️',
                value: `${agility}%`,
                progress: agility
            },
            {
                type: 'intelligence' as StatType,
                name: '🧠 Знания',
                icon: '🧠',
                value: `${intelligence}%`,
                progress: intelligence
            },
            {
                type: 'focus' as StatType,
                name: '🧠 Фокус',
                icon: '🧠',
                value: `${focus}%`,
                progress: focus
            },
            {
                type: 'level' as StatType,
                name: '⭐ Уровень',
                icon: '⭐',
                value: level,
                progress: levelProgress,
                additionalInfo: `До следующего уровня: ${xpToNextLevel} XP`
            }
        ],
        resources: [
            {icon: '❤️', name: 'Здоровье', value: `${health}/100`},
            {icon: '🔋', name: 'Ресурс', value: `${resource}/100`},
            {icon: '💰', name: 'Золото', value: gold.toString()},
            {icon: '✨', name: 'Опыт', value: xp.toString()}
        ],
        locations: [
            {
                icon: '🏰',
                title: 'Королевство Доставки',
                description: 'Боссы: Пицца-Дракон, Ролл-Голем',
                color: '#ff6347'
            },
            {
                icon: '🌿',
                title: 'Болото Сидячести',
                description: 'Снижает вашу силу',
                color: '#20b2aa'
            },
            {
                icon: '⛰️',
                title: 'Пещеры Ночных Смен',
                description: 'Опасное место с дебаффами',
                color: '#6a5acd'
            },
            {
                icon: '🏠',
                title: 'Святилище Домашнего Очага',
                description: 'Ваше место силы',
                color: '#ffd700'
            }
        ]
    };
};