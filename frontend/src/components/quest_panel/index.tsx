import React from 'react';
import QuestTabs from './quest_tabs';
import QuestItem from './quest_item';
import type {QuestCategory} from "../../types.tsx";

const QuestPanel: React.FC = () => {
    const quests = [
        {
            category: 'nutrition',
            title: 'Меньшее Зло',
            description: 'Выбрать более здоровую опцию в доставке (тонкое тесто, больше овощей, соус отдельно)',
            rewards: [
                {type: 'xp', value: '+10 XP'},
                {type: 'energy', value: '+5 к Энергии'},
            ]
        },
        {
            category: 'nutrition',
            title: 'Сборка Артефакта',
            description: 'Приготовить/собрать ОДНО простое блюдо (яйца+овощи, салат из готовой грудки, творог+ягоды)',
            rewards: [
                {type: 'xp', value: '+25 XP'},
                {type: 'energy', value: '+15 к Энергии'},
                {type: 'gold', value: '+50 Золота'},
            ]
        },
        {
            category: 'water',
            title: 'Сахарный Детокс',
            description: 'Заказать кофе/бабл ти с 70% → 50% → 30% сахара. Или выпить 1 стакан воды перед ним.',
            rewards: [
                {type: 'xp', value: '+15 XP'},
                {type: 'energy', value: '+10 к Энергии'},
                {type: 'focus', value: '+5 к Фокусу'},
            ]
        },
        {
            category: 'movement',
            title: 'Утренний Ритуал',
            description: 'Выполнить 5-минутную разминку',
            rewards: [
                {type: 'xp', value: '+20 XP'},
                {type: 'strength', value: '+10 к Силе'},
            ]
        },
        {
            category: 'sleep',
            title: 'Восстановление HP',
            description: 'После ночной смены выполнить ТОЛЬКО действия "красного" дня (сон, вода, легкая растяжка/дыхание)',
            rewards: [
                {type: 'xp', value: '+30 XP'},
                {type: 'focus', value: '+20 к Фокусу'},
            ]
        }
    ];
    return (
        <div className="panel">
            <h2 className="panel-title"><i className="fas fa-tasks"></i> Квесты</h2>
            <QuestTabs/>
            <div className="quest-list">
                {quests.map((quest, index) => (
                    <QuestItem
                        key={index}
                        category={quest.category as QuestCategory}
                        title={quest.title}
                        description={quest.description}
                        rewards={quest.rewards}
                    />
                ))}
            </div>
        </div>
    );
};
export default QuestPanel;