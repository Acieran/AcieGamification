import Data_display from '../../components/data_display';
import CharacterStatsView from './character_stats_view';
import type {GetUserStatsResponse} from '../../types';
import {transformUserStatsToCharacterData} from "./transformUserStatsToCharacterData.tsx";

const CharacterStats = () => {
    return (
        <Data_display<GetUserStatsResponse>
            endpoint='/'
            queryKey=''
            render={(data) => {
                console.log('CharacterStats data:', data);

                const characterData = transformUserStatsToCharacterData(data);
                return <CharacterStatsView data={characterData}/>;
            }}
        />
    );
};

export default CharacterStats;