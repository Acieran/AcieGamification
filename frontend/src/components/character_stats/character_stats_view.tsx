// src/components/CharacterStats/CharacterStatsView.tsx
import React from 'react';
import StatCard from './stat_card';
import Resources from './resources';
// import WorldMap from '../world_map';
import {transformUserStatsToCharacterData} from "./transformUserStatsToCharacterData.tsx";

// Тип для преобразованных данных
type CharacterData = ReturnType<typeof transformUserStatsToCharacterData>;

interface CharacterStatsViewProps {
    data: CharacterData;
}

const CharacterStatsView: React.FC<CharacterStatsViewProps> = (data) => {
    // Если данные отсутствуют (но это не должно случиться, так как мы обработали выше)
    if (!data) return null;

    console.log('CharacterStatsView data:', data);
    console.log('data.stats:', data.data.stats);

    return (
        <div className="panel">
            <h2 className="panel-title">
                <i className="fas fa-user"></i> Ваш Персонаж
            </h2>

            <div className="character-stats">
                {data.data.stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        type={stat.type}
                        name={stat.name}
                        icon={stat.icon}
                        value={stat.value}
                        progress={stat.progress}
                        additionalInfo={stat.additionalInfo}
                    />
                ))}
            </div>

            <Resources resources={data.data.resources}/>

            <h2 className="panel-title" style={{marginTop: '30px'}}>
                <i className="fas fa-map"></i> Игровой Мир
            </h2>

            {/*<WorldMap locations={data.locations} />*/}
        </div>
    );
};

export default CharacterStatsView;