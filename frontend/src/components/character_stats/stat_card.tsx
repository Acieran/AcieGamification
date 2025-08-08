import React, {useEffect, useRef, useState} from 'react';
import type {StatType} from "../../types.tsx";

export type StatCardProps = {
    type: StatType;
    name: string;
    icon: string;
    value: string | number;
    progress: number;
    additionalInfo?: string;
    onValueChange?: (newValue: string) => void; // Add callback for value changes
};

const StatCard: React.FC<StatCardProps> = (props) => {
    // Defensive checks
    if (!props) {
        console.error('StatCard received undefined props — returning null to avoid crash');
        return null;
    }
    console.log('StatCard props:', props);

    const {type, name, icon, value, progress, additionalInfo, onValueChange} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync internal state with prop changes
    useEffect(() => {
        setEditValue(value.toString());
    }, [value]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (editValue.trim() !== value.toString() && onValueChange) {
            onValueChange(editValue.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur();
        } else if (e.key === 'Escape') {
            setEditValue(value.toString());
            setIsEditing(false);
        }
    };

    const getProgressBarColor = () => {
        switch (type) {
            case 'energy':
                return 'var(--energy)';
            case 'strength':
                return 'var(--strength)';
            case 'focus':
                return 'var(--focus)';
            case 'level':
                return 'var(--gold)';
            default:
                return 'var(--primary)';
        }
    };

    return (
        <div className={`stat-card ${type}`}>
            <div className="stat-header">
                <div className="stat-name">{name}</div>
                <div className="stat-icon">{icon}</div>
            </div>

            <div className="stat-value-container">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="stat-value-editing"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '2px 0',
                            boxSizing: 'border-box'
                        }}
                    />
                ) : (
                    <div
                        className="stat-value"
                        onClick={() => onValueChange && setIsEditing(true)}
                        style={{cursor: onValueChange ? 'pointer' : 'default'}}
                    >
                        {value}
                    </div>
                )}
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: getProgressBarColor()
                    }}
                />
            </div>

            {additionalInfo && (
                <div className="additional-info">
                    {additionalInfo}
                </div>
            )}
        </div>
    );
};

export default StatCard;