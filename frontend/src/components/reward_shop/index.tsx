import React from 'react';
import RewardItem from './reward_item';

const RewardsShop: React.FC = () => {
    const rewards = [
        {icon: '🍰', title: 'Вкусный десерт', description: 'Без чувства вины!', cost: 500},
        {icon: '🎬', title: 'Поход в кино', description: 'Или мини-аттракционы', cost: 1000},
        {icon: '💆‍♂️', title: 'Массаж', description: 'Расслабляющая процедура', cost: 2000},
        {icon: '🎮', title: 'Новая игра', description: 'Для двоих', cost: 1500},
    ];
    return (
        <div className="rewards-shop">
            <h2 className="panel-title"><i className="fas fa-gift"></i> Магазин Наград</h2>
            <div className="rewards-grid">
                {rewards.map((reward, index) => (
                    <RewardItem
                        key={index}
                        icon={reward.icon}
                        title={reward.title}
                        description={reward.description}
                        cost={reward.cost}
                    />
                ))}
            </div>
        </div>
    );
};
export default RewardsShop;