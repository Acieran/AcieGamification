import React, {useEffect, useState} from 'react';
import QuestTabs from './quest_tabs';
import QuestItem from './quest_item';
import AddQuest from './add_quest.tsx'
import type {QuestCategory} from "../../types.tsx";
import {getUserQuests} from "../../api/user_quests.ts";
import type {QuestClass} from "../../api/models.ts";
import type {AxiosError} from "axios";


const QuestPanel: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<'daily' | 'weekly' | 'joint'>('daily');
    const [data, setData] = useState<QuestClass[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);

    // This will be called whenever the tab changes
    const handleTabChange = (tab: 'daily' | 'weekly' | 'joint') => {
        setCurrentTab(tab);
        console.log('Current tab:', tab);
        // You can add any additional logic here
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset previous errors

        try {
            const response = await getUserQuests();
            setData(response); // Update state with fetched data
        } catch (err) {
            setError(err as AxiosError); // Handle errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="panel">
            <h2 className="panel-title"><i className="fas fa-tasks"></i> Квесты</h2>
            <QuestTabs
                activeTab={currentTab}
                onTabChange={handleTabChange}
            />
            <div className="quest-list">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && data.map((quest, index) => (
                    <QuestItem
                        key={index}
                        id={quest.id}
                        category={quest.type as QuestCategory}
                        title={quest.title}
                        description={quest.description}
                        rewards={quest.reward}
                    />
                ))}
            </div>

            <AddQuest
                onQuestAdded={fetchData}
            />
        </div>
    );
};
export default QuestPanel;