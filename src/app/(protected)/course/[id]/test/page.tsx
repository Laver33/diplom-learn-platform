'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

const CourseTestPage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const [test, setTest] = useState<any>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTest();
    }, [courseId]);

    const loadTest = async () => {
        try {
            const testRef = doc(db, 'courses', courseId, 'tests', 'main');
            const testSnap = await getDoc(testRef);
            
            if (testSnap.exists()) {
                const testData = testSnap.data();
                setTest(testData);
                setAnswers(new Array(testData.questions.length).fill(-1));
            } else {
                toast.error('Тесты не найдены для этого курса');
                router.push(`/course/${courseId}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            toast.error('Ошибка загрузки теста');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitTest = async () => {
        // Проверка что все вопросы отвечены
        if (answers.some(a => a === -1)) {
            toast.error('Ответьте на все вопросы');
            return;
        }

        setSubmitting(true);
        
        // Подсчет баллов
        let correct = 0;
        test.questions.forEach((q: any, idx: number) => {
            if (answers[idx] === q.correctAnswer) {
                correct++;
            }
        });
        
        const finalScore = (correct / test.questions.length) * 100;
        setScore(finalScore);
        const passed = finalScore >= test.passingScore;

        // Сохранение результата в Firestore
        try {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRef = doc(db, 'users', userId);
                
                // Сохраняем результат теста
                await updateDoc(userRef, {
                    [`completedTests.${courseId}`]: {
                        score: finalScore,
                        passed: passed,
                        completedAt: new Date().toISOString(),
                        answers: answers
                    }
                });

                // Обновляем прогресс курса
                await updateDoc(userRef, {
                    [`courseProgress.${courseId}`]: {
                        testCompleted: true,
                        testScore: finalScore,
                        testPassed: passed,
                        completedAt: new Date().toISOString()
                    }
                });

                toast.success(passed ? 'Поздравляем! Вы прошли тест!' : 'К сожалению, вы не прошли тест');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            toast.error('Ошибка сохранения результата');
        }

        setShowResults(true);
        setSubmitting(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Загрузка теста...</div>;
    }

    if (showResults) {
        const passed = score >= test.passingScore;
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6 text-center">
                        {passed ? (
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        )}
                        
                        <h2 className="text-2xl font-bold mb-4">
                            {passed ? 'Тест пройден!' : 'Тест не пройден'}
                        </h2>
                        
                        <p className="text-lg mb-2">
                            Ваш результат: {Math.round(score)}%
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Проходной балл: {test.passingScore}%
                        </p>
                        
                        {passed ? (
                            <div className="space-y-4">
                                <p className="text-green-600">
                                    🎉 Поздравляем! Вы успешно завершили курс!
                                </p>
                                <Button onClick={() => router.push(`/course/${courseId}`)}>
                                    Вернуться к курсу
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-red-600">
                                    К сожалению, вы не набрали достаточно баллов.
                                </p>
                                <Button onClick={() => {
                                    setShowResults(false);
                                    setCurrentQuestion(0);
                                    setAnswers(new Array(test.questions.length).fill(-1));
                                }}>
                                    Попробовать снова
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQ = test.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / test.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Вопрос {currentQuestion + 1} из {test.questions.length}</span>
                    <span>Прогресс: {Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-6">
                        {currentQ.text}
                    </h3>

                    <RadioGroup
                        value={answers[currentQuestion]?.toString()}
                        onValueChange={(val) => handleAnswer(parseInt(val))}
                        className="space-y-3"
                    >
                        {currentQ.options.map((option: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value={idx.toString()} id={`q${currentQuestion}-opt${idx}`} />
                                <Label htmlFor={`q${currentQuestion}-opt${idx}`} className="flex-1 cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
                <Button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                >
                    ← Назад
                </Button>
                
                {currentQuestion === test.questions.length - 1 ? (
                    <Button
                        onClick={submitTest}
                        disabled={answers[currentQuestion] === -1 || submitting}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {submitting ? 'Проверка...' : 'Завершить тест ✓'}
                    </Button>
                ) : (
                    <Button
                        onClick={nextQuestion}
                        disabled={answers[currentQuestion] === -1}
                    >
                        Далее →
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CourseTestPage;