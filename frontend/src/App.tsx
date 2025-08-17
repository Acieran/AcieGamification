// App.tsx
import Header from './components/header';
import CharacterStats from './components/character_stats';
import QuestPanel from './components/quest_panel';

const App = () => {
    return (
        <div className="container">
            <Header />
            <div className="game-grid">
                <CharacterStats />
                <QuestPanel />
            </div>
        </div>
    );
};

export default App;