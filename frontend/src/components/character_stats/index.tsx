import {useState} from 'react';
import Data_display from '../../components/data_display';
import CharacterStatsView from './character_stats_view';
import type {BaseUser, GetUserStatsResponse, Stats, UserStats} from '../../types';
import {transformUserStatsToCharacterData} from "./transformUserStatsToCharacterData";
import {createUserWithStats} from "../../api/user_stats.ts";

// Keep this utility function
function getRandomTwoDecimalPlaces(): number {
    return Math.round(Math.random() * 100) / 100;
}

const CharacterStats = () => {
    const [characterData, setCharacterData] = useState<unknown | null>(null);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle user creation when needed
    const handleUserCreation = async () => {
        setIsLoadingCreate(true);
        try {
            const stats: Stats = {
                energy: getRandomTwoDecimalPlaces(),
                strength: getRandomTwoDecimalPlaces(),
                agility: getRandomTwoDecimalPlaces(),
                intelligence: getRandomTwoDecimalPlaces(),
                focus: getRandomTwoDecimalPlaces(),
                xp: 0,
                level: 0,
                health: getRandomTwoDecimalPlaces() * 100,
                resource: getRandomTwoDecimalPlaces() * 100,
                gold: 0
            };

            const user: BaseUser = {
                username: "Acieran",
            }

            const user_stats: UserStats = {
                ...user,
                ...stats
            };

            const response = await createUserWithStats("Acieran", stats);

            if (response.success) {
                setCharacterData(transformUserStatsToCharacterData(user_stats));
            } else {
                setError(response.message || "Failed to create character");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoadingCreate(false);
        }
    };

    return (
        <Data_display<GetUserStatsResponse>
            endpoint='/'  // Make sure this is your actual endpoint
            queryKey='user-stats'
            render={(data) => {
                // If we have data, transform and render it
                if (data && !isLoadingCreate) {
                    if (data.success) {
                        return (
                            <CharacterStatsView
                                data={transformUserStatsToCharacterData(data.data)}
                            />
                        );
                    }
                }
                if (isLoadingCreate || characterData) {
                    return <div>Loading character data...</div>;
                }

                // If we have an error, show it
                if (error) {
                    return (
                        <div>
                            <p>Error: {error}</p>
                            <button onClick={handleUserCreation}>Retry</button>
                        </div>
                    );
                }

                // If no data exists, initiate creation
                return (
                    <div>
                        <p>No character found</p>
                        <button onClick={handleUserCreation}>
                            Create New Character
                        </button>
                    </div>
                );
            }}
        />
    );
};

export default CharacterStats;