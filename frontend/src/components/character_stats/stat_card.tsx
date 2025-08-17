import React, { useState, useRef, useEffect } from 'react';
import type { StatType } from "../../types.tsx";

export type StatCardProps = {
    type: StatType;
    name: string;
    icon: string;
    value: string | number;
    progress: number;
    additionalInfo?: string;
    onValueChange?: (newValue: string) => void;
};

const StatCard: React.FC<StatCardProps> = (props) => {
    const { type, name, icon, value, progress, additionalInfo, onValueChange } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with parent value when not editing
    useEffect(() => {
        if (!isEditing) {
            setEditValue(value.toString());
        }
        }, [value, isEditing]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const updateValue = (new_value: string) => {
        setEditValue(new_value);
        console.log(new_value);
    }

    const handleBlur = () => {
        setIsEditing(false);
        const newValue = editValue.trim();
        if (newValue !== value.toString() && onValueChange) {
            onValueChange(newValue);
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
            case 'energy': return 'var(--energy)';
            case 'strength': return 'var(--strength)';
            case 'focus': return 'var(--focus)';
            case 'level': return 'var(--gold)';
            default: return 'var(--primary)';
        }
    };

    return (
        <div className={`stat-card ${type}`}>
            <div className="stat-header">
                <div className="stat-name">{name}</div>
                <div className="stat-icon">{icon}</div>
            </div>

            <div className="stat-value-container">
                    <input
                        ref={inputRef}
                        type="text"
                        className="stat-value-editing"
                        value={editValue}
                        onChange={(e) => updateValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            minWidth: '5ch', // Prevents resizing jumps
                            textAlign: 'center',
                            padding: '2px 0',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            background: '#f8f9fa',
                            border: '2px solid #4285f4',
                            borderRadius: '4px',
                            outline: 'none',
                            boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.3)'
                        }}
                    />
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

            <style>{`
                .stat-value:hover {
                    background-color: ${onValueChange ? '#f0f0f0' : 'transparent'};
                }
            `}</style>
        </div>
    );
};

export default StatCard;