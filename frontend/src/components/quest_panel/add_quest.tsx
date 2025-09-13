import React, {useState} from "react";
import type QuestClass from "../../api/models.ts";
import {createUserQuest} from "../../api/user_quests.ts";

interface AddQuestProps {
    onQuestAdded: () => void;
}

const AddQuest: React.FC<AddQuestProps> = ({onQuestAdded}) => {
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<Omit<QuestClass, "id" | "username">>({
        completed: false,
        due_date: new Date(),
        title: '',
        description: '',
        type: 'nutrition',
        occurrence_type: 'daily',
        reward: {
            gold: 0,
            xp: 0,
            energy: 0,
            strength: 0,
            agility: 0,
            intelligence: 0,
            level: 0,
            focus: 0,
            health: 0,
            resource: 0
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;

        if (name.startsWith('reward.')) {
            const rewardField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                reward: {
                    ...prev.reward,
                    [rewardField]: Number(value) || 0
                }
            }));
        } else if (name === 'due_date') {
            setFormData(prev => ({
                ...prev,
                [name]: new Date(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await createUserQuest("Acieran", formData);
            setShowForm(false);
            setFormData({
                completed: false,
                due_date: new Date(),
                title: '',
                description: '',
                type: 'nutrition',
                occurrence_type: 'daily',
                reward: {
                    gold: 0,
                    xp: 0,
                    energy: 0,
                    strength: 0,
                    agility: 0,
                    intelligence: 0,
                    level: 0,
                    focus: 0,
                    health: 0,
                    resource: 0
                }
            });
            // Refresh the quest list
            await onQuestAdded();
        } catch (err) {
            console.error('Failed to add quest:', err);
            alert('Failed to add quest. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="quest-add">
            {!showForm ? (
                <button className="add-quest-btn"
                        onClick={() => setShowForm(true)}
                >
                    <i className="fas fa-plus"></i> Добавить квест
                </button>
            ) : (
                <div className="quest-form-container">
                    <h3>Создать новый квест</h3>
                    <form onSubmit={handleSubmit} className="quest-form">
                        <div className="form-group">
                            <label htmlFor="title">Название:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Описание:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="due_date">Дата выполнения:</label>
                            <input
                                type="datetime-local"
                                id="due_date"
                                name="due_date"
                                value={formData.due_date.toISOString().slice(0, 16)}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="occurrence_type">Тип повторения:</label>
                            <select
                                name="occurrence_type"
                                id="occurrence_type"
                                onChange={handleInputChange}
                                value={formData.occurrence_type}
                                required>
                                <option value="daily">Ежедневный</option>
                                <option value="weekly">Еженедельный</option>
                                <option value="one_time">Одноразовый</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Категория:</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="nutrition">Питание</option>
                                <option value="movement">Движение</option>
                                <option value="sleep">Сон</option>
                                <option value="water">Вода</option>
                                <option value="learning">Обучение</option>
                                <option value="meditation">Медитация</option>
                            </select>
                        </div>

                        <div className="reward-fields">
                            <h4>Награды:</h4>
                            <div className="reward-inputs">
                                <div className="form-group">
                                    <label htmlFor="reward.gold">Золото:</label>
                                    <input
                                        type="number"
                                        id="reward.gold"
                                        name="reward.gold"
                                        value={formData.reward.gold}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.xp">Опыт:</label>
                                    <input
                                        type="number"
                                        id="reward.xp"
                                        name="reward.xp"
                                        value={formData.reward.xp}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.energy">Энергия:</label>
                                    <input
                                        type="number"
                                        id="reward.energy"
                                        name="reward.energy"
                                        value={formData.reward.energy}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.strength">Сила:</label>
                                    <input
                                        type="number"
                                        id="reward.strength"
                                        name="reward.strength"
                                        value={formData.reward.strength}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.agility">Ловкость:</label>
                                    <input
                                        type="number"
                                        id="reward.agility"
                                        name="reward.agility"
                                        value={formData.reward.agility}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.intelligence">Интеллект:</label>
                                    <input
                                        type="number"
                                        id="reward.intelligence"
                                        name="reward.intelligence"
                                        value={formData.reward.intelligence}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.level">Уровень:</label>
                                    <input
                                        type="number"
                                        id="reward.level"
                                        name="reward.level"
                                        value={formData.reward.level}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.focus">Фокус:</label>
                                    <input
                                        type="number"
                                        id="reward.focus"
                                        name="reward.focus"
                                        value={formData.reward.focus}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.health">Здоровье:</label>
                                    <input
                                        type="number"
                                        id="reward.health"
                                        name="reward.health"
                                        value={formData.reward.health}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reward.resource">Ресурсы:</label>
                                    <input
                                        type="number"
                                        id="reward.resource"
                                        name="reward.resource"
                                        value={formData.reward.resource}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowForm(false)}
                                disabled={submitting}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Создание...' : 'Создать квест'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddQuest;