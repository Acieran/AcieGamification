import React, {useState} from 'react';

const QuestTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'joint'>('daily');
    return (
        <div className="quest-tabs">
            <button
                className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
            >
                Ежедневные
            </button>
            <button
                className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
                onClick={() => setActiveTab('weekly')}
            >
                Еженедельные
            </button>
            <button
                className={`tab-btn ${activeTab === 'joint' ? 'active' : ''}`}
                onClick={() => setActiveTab('joint')}
            >
                Совместные
            </button>
        </div>
    );
};
export default QuestTabs;