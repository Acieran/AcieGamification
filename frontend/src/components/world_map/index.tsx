import React from 'react';
import Location from './location';

const WorldMap: React.FC = () => {
    const locations = [
        {
            icon: '🏰',
            title: 'Королевство Доставки',
            description: 'Боссы: Пицца-Дракон, Ролл-Голем',
            borderColor: '#ff6347'
        },
        {icon: '🌿', title: 'Болото Сидячести', description: 'Снижает вашу силу', borderColor: '#20b2aa'},
        {icon: '⛰️', title: 'Пещеры Ночных Смен', description: 'Опасное место с дебаффами', borderColor: '#6a5acd'},
        {icon: '🏠', title: 'Святилище Домашнего Очага', description: 'Ваше место силы', borderColor: '#ffd700'},
    ];
    return (
        <div className="world-map">
            {locations.map((loc, index) => (
                <Location
                    key={index}
                    icon={loc.icon}
                    title={loc.title}
                    description={loc.description}
                    borderColor={loc.borderColor}
                />
            ))}
        </div>
    );
};
export default WorldMap;