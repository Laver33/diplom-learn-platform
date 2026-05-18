'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

interface AddTestsProps {
    courseId: string;
    onSave: (tests: { questions: Question[], passingScore: number }) => void;
}

export const AddTests = ({ courseId, onSave }: AddTestsProps) => {
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    const [passingScore, setPassingScore] = useState(70);
    const [isOpen, setIsOpen] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, {
            id: questions.length + 1,
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        }]);
    };

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: number, field: string, value: any) => {
        setQuestions(questions.map(q => 
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const updateOption = (questionId: number, optionIndex: number, value: string) => {
        setQuestions(questions.map(q => 
            q.id === questionId ? {
                ...q,
                options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            } : q
        ));
    };

    const handleSave = () => {
        onSave({ questions, passingScore });
        setIsOpen(false);
    };

    return (
        <div className="mt-8">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="w-full"
            >
                {isOpen ? 'Закрыть тесты' : '➕ Добавить тесты для курса'}
            </Button>

            {isOpen && (
                <div className="mt-4 p-6 border rounded-xl bg-gray-50">
                    <div className="mb-6">
                        <Label>Проходной балл (%)</Label>
                        <Input
                            type="number"
                            value={passingScore}
                            onChange={(e) => setPassingScore(Number(e.target.value))}
                            className="mt-2 w-32"
                            min={0}
                            max={100}
                        />
                    </div>

                    {questions.map((question, idx) => (
                        <Card key={question.id} className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold">Вопрос {idx + 1}</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuestion(question.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <Label>Текст вопроса</Label>
                                    <Input
                                        value={question.text}
                                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                        placeholder="Введите вопрос..."
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <Label>Варианты ответов</Label>
                                    {question.options.map((option, optIdx) => (
                                        <div key={optIdx} className="flex items-center gap-2 mt-2">
                                            <input
                                                type="radio"
                                                name={`correct-${question.id}`}
                                                checked={question.correctAnswer === optIdx}
                                                onChange={() => updateQuestion(question.id, 'correctAnswer', optIdx)}
                                                className="w-4 h-4"
                                            />
                                            <Input
                                                value={option}
                                                onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                                                placeholder={`Вариант ${optIdx + 1}`}
                                                className="flex-1"
                                            />
                                        </div>
                                    ))}
                                    <p className="text-xs text-gray-500 mt-2">Выберите правильный ответ (радиокнопка)</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex gap-4 mt-4">
                        <Button onClick={addQuestion} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить вопрос
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить тесты
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};