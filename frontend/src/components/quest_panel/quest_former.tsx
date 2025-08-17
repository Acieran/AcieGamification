import type {GetUserQuestsResponse} from "../../types.tsx";
import QuestItem from "./quest_item.tsx";

export const quest_former = (data: GetUserQuestsResponse)=> {

    return {
        <div className="character-quest_card">
            {data.map((quest_data, index) => (
                <QuestItem

                />
            ))}
        </div>
        category: 'sleep',
        title: 'Восстановление HP',
        description: 'После ночной смены выполнить ТОЛЬКО действия "красного" дня (сон, вода, легкая растяжка/дыхание)',
        rewards: [
            {type: 'xp', value: '+30 XP'},
            {type: 'focus', value: '+20 к Фокусу'},
        ]
    }


}