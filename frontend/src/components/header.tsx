import {useEffect, useState} from 'react';

const Header = () => {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const targetDate = new Date(2025, 8, 1); // Сентябрь - 8 (0-based)
        const timeDifference = targetDate.getTime() - Date.now();
        setDaysLeft(Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
    }, []);

    return (
        <header>
            <h1>Жизнь в Режиме Героя: Энергетический Квест</h1>
            <p className="subtitle">До цели осталось: {daysLeft} дней</p>
        </header>
    );
};

export default Header;