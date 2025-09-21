// App.tsx
import Header from './components/header';
import CharacterStats from './components/character_stats';
import QuestPanel from './components/quest_panel';
import {useState} from "react";
import type {Page} from "./types.tsx";
import Calendar from "./pages/calendar.tsx";

const App = () => {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    const dashboard = () => {
        return (
            <div className="game-grid">
                <CharacterStats />
                <QuestPanel />
            </div>
        );
    }

    // Render the appropriate component based on current page
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return dashboard()
            case 'calendar':
                return <Calendar/>;
            default:
                return dashboard()
        }
    };

    return (
        <div className="container">
            <Header
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            {renderPage()}
        </div>
    );
};

export default App;
