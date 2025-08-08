import React, {useState} from 'react';

type QuestItemProps = {
    category: 'nutrition' | 'movement' | 'sleep' | 'water';
    title: string;
    description: string;
    rewards: Array<{ type: string; value: string }>;
};
const QuestItem: React.FC<QuestItemProps> = ({category, title, description, rewards}) => {
    const [completed, setCompleted] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const handleComplete = () => {
        setCompleted(true);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 500);
    };
    const categoryStyles = {
        nutrition: {borderColor: 'var(--energy)', categoryText: 'ПИТАНИЕ'},
        movement: {borderColor: 'var(--strength)', categoryText: 'ДВИЖЕНИЕ'},
        sleep: {borderColor: 'var(--focus)', categoryText: 'СОН'},
        water: {borderColor: '#4bcffa', categoryText: 'НАПИТКИ'},
    };
    const rewardIcons = {
        xp: {icon: 'fas fa-star', color: 'var(--xp)'},
        gold: {icon: 'fas fa-coins', color: 'var(--gold)'},
        energy: {icon: 'fas fa-bolt', color: 'var(--energy)'},
        strength: {icon: 'fas fa-dumbbell', color: 'var(--strength)'},
        focus: {icon: 'fas fa-brain', color: 'var(--focus)'},
    };
    return (
        <div className={`quest-item ${category}`} style={{opacity: completed ? 0.6 : 1}}>
            <div className="quest-header">
                <div className="quest-title">{title}</div>
                <div className="quest-category" style={{
                    background: `rgba(${category === 'nutrition' ? '255, 215, 0' :
                        category === 'movement' ? '255, 99, 71' :
                            category === 'sleep' ? '32, 178, 170' : '75, 207, 250'}, 0.2)`,
                    color: categoryStyles[category].borderColor
                }}>
                    {categoryStyles[category].categoryText}
                </div>
            </div>
            <div className="quest-description">{description}</div>
            <div className="quest-rewards">
                {rewards.map((reward, index) => (
                    <div key={index} className={`reward ${reward.type}-reward`}
                         style={{color: rewardIcons[reward.type as keyof typeof rewardIcons].color}}>
                        <i className={rewardIcons[reward.type as keyof typeof rewardIcons].icon}></i> {reward.value}
                    </div>
                ))}
            </div>
            <div className="quest-actions">
                <button
                    className={`btn btn-complete ${isPulsing ? 'pulse' : ''}`}
                    onClick={handleComplete}
                    disabled={completed}
                    style={completed ? {backgroundColor: '#2ed573', cursor: 'not-allowed'} : {}}
                >
                    <i className="fas fa-check"></i> {completed ? 'Выполнено!' : 'Выполнить'}
                </button>
                <button className="btn btn-details">
                    <i className="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        </div>
    );
};
export default QuestItem;