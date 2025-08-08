import React from 'react';

type LocationProps = {
    icon: string;
    title: string;
    description: string;
    borderColor: string;
};
const Location: React.FC<LocationProps> = ({icon, title, description, borderColor}) => {
    return (
        <div className="location" style={{borderColor}}>
            <div className="location-icon">{icon}</div>
            <div className="location-title">{title}</div>
            <div className="location-description">{description}</div>
        </div>
    );
};
export default Location;