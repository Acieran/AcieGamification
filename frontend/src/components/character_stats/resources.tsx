// src/components/CharacterStats/Resources.tsx
import React from 'react';

interface Resource {
    icon: string;
    name: string;
    value: string;
}

interface ResourcesProps {
    resources: Resource[];
}

const Resources: React.FC<ResourcesProps> = ({resources}) => {
    return (
        <div className="resources">
            {resources.map((resource, index) => (
                <div key={index} className="resource">
                    <div className="resource-icon">{resource.icon}</div>
                    <div className="resource-name">{resource.name}</div>
                    <div className="resource-value">{resource.value}</div>
                </div>
            ))}
        </div>
    );
};

export default Resources;