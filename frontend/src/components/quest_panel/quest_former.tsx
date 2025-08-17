import type {GetUserQuestsResponse} from "../../types.tsx";
import QuestItem from "./quest_item.tsx";

export const quest_former = (data: GetUserQuestsResponse)=> {

    return (
        <div className="character-quest_card">
            {data.map((quest_data, index) => (
                <QuestItem
                    key={index}
                    category={quest_data.type}
                    title={quest_data.title}
                    description={quest_data.description}
                    rewards={[
                        {type:'health',     value: quest_data.health.toString()},
                        {type:'focus',      value: quest_data.focus.toString()},
                        {type:'strength',   value: quest_data.strength.toString()},
                        {type:'energy',     value: quest_data.energy.toString()},
                        {type:'agility',    value: quest_data.agility.toString()},
                        {type:'gold',       value: quest_data.gold.toString()},
                        {type:'intelligence',value: quest_data.intelligence.toString()},
                        {type:'resource',   value: quest_data.resource.toString()},
                        {type:'xp',         value: quest_data.xp.toString()}
                    ]}
                />
            ))}
        </div>
    )


}