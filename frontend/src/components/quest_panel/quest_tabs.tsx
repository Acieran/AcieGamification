import React from 'react';

interface QuestTabsProps {
    activeTab: 'daily' | 'weekly' | 'joint';
    onTabChange: (tab: 'daily' | 'weekly' | 'joint') => void;
}

const QuestTabs: React.FC<QuestTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="quest-tabs">
            <button
                className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => onTabChange('daily')}
            >
                Ежедневные
            </button>
            <button
                className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
                onClick={() => onTabChange('weekly')}
            >
                Еженедельные
            </button>
            <button
                className={`tab-btn ${activeTab === 'joint' ? 'active' : ''}`}
                onClick={() => onTabChange('joint')}
            >
                Совместные
            </button>
        </div>
    );
};

export default QuestTabs;