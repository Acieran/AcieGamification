import React, {useState} from 'react';

type RewardItemProps = {
    icon: string;
    title: string;
    description: string;
    cost: number;
};
const RewardItem: React.FC<RewardItemProps> = ({icon, title, description, cost}) => {
    const [purchased, setPurchased] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const handleBuy = () => {
        setPurchased(true);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 100);
    };
    return (
        <div className="reward-item" style={{
            borderColor: purchased ? '#2ed573' : 'var(--gold)',
            boxShadow: purchased ? '0 0 15px rgba(46, 213, 115, 0.5)' : 'none'
        }}>
            <div className="reward-icon">{icon}</div>
            <div className="reward-title">{title}</div>
            <div className="reward-description">{description}</div>
            <div className="reward-cost">
                <i className="fas fa-coins"></i> {cost}
            </div>
            <button
                className={`btn btn-buy ${isPulsing ? 'pulse' : ''}`}
                onClick={handleBuy}
                disabled={purchased}
                style={purchased ? {backgroundColor: '#2ed573', cursor: 'not-allowed'} : {}}
            >
                <i className="fas fa-shopping-cart"></i> {purchased ? 'Куплено!' : 'Купить'}
            </button>
        </div>
    );
};
export default RewardItem;