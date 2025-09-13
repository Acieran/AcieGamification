import React, {useState} from 'react';
import type {QuestCategory, Stats} from "../../types.tsx";
import {updateUserStats} from "../../api/user_stats.ts";
import {rewardTransform} from "./rewardTransform.tsx";
import {updateUserQuest} from "../../api/user_quests.ts";

type QuestItemProps = {
    id: number;
    category: QuestCategory;
    title: string;
    description: string;
    rewards: Stats;
};

const QuestItem: React.FC<QuestItemProps> = ({id, category, title, description, rewards}) => {
    const rewards_with_type = rewardTransform(rewards);
    const [completedUpdate, setcompletedUpdate] = useState(false);
    const [completedDelete, setcompletedDelete] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const handleComplete = () => {
        sendData()
        setTimeout(() => setIsPulsing(false), 500);

    };

    const sendData = async () => {
        setIsPulsing(true);

        try {
            const response = await updateUserStats("Acieran", rewards, true);
            setcompletedUpdate(response.success);
            const resp2 = await updateUserQuest("Acieran", id, null, true);
            setcompletedDelete(resp2.success)
            // Update state with fetched data
        } catch {
            setcompletedUpdate(false); // Handle errors
        } finally {
            setIsPulsing(false); // Reset loading state
        }
    };

    const categoryStyles = {
        nutrition: {borderColor: 'var(--energy)', categoryText: 'ПИТАНИЕ'},
        movement: {borderColor: 'var(--strength)', categoryText: 'ДВИЖЕНИЕ'},
        sleep: {borderColor: 'var(--focus)', categoryText: 'СОН'},
        water: {borderColor: '#4bcffa', categoryText: 'НАПИТКИ'},
        intellectual: {borderColor: 'blue', categoryText: 'Интеллектуальная'}
    };
    const rewardIcons = {
        xp: {icon: 'fas fa-star', color: 'var(--xp)'},
        gold: {icon: 'fas fa-coins', color: 'var(--gold)'},
        energy: {icon: 'fas fa-bolt', color: 'var(--energy)'},
        strength: {icon: 'fas fa-dumbbell', color: 'var(--strength)'},
        focus: {icon: 'fas fa-brain', color: 'var(--focus)'},
    };

    const defaultRewardIcon = {
        icon: "fas fa-question-circle", // Default icon
        color: "#999999",              // Default color (gray)
    };

    return (
        <div className={`quest-item ${category}`} style={{opacity: completedUpdate ? 0.6 : 1}}>
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
                {rewards_with_type
                    .filter(reward => reward.value != null && reward.value !== "0")
                    .map((reward, index) => (
                        <div
                            key={index}
                            className={`reward ${reward.type}-reward`}
                            style={{color: (rewardIcons[reward.type as keyof typeof rewardIcons] || defaultRewardIcon).color}}
                        >
                            <i className={(rewardIcons[reward.type as keyof typeof rewardIcons] || defaultRewardIcon).icon}></i>
                            {reward.value}
                        </div>
                    ))}
            </div>
            <div className="quest-actions">
                <button
                    className={`btn btn-complete ${isPulsing ? 'pulse' : ''}`}
                    onClick={handleComplete}
                    disabled={completedUpdate || completedDelete}
                    style={completedUpdate ? {backgroundColor: '#2ed573', cursor: 'not-allowed'} : {}}
                >
                    <i className="fas fa-check"></i> {completedUpdate ? 'Выполнено!' : 'Выполнить'}
                </button>
                <button className="btn btn-details">
                    <i className="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        </div>
    );
};
export default QuestItem;