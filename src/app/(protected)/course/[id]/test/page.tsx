'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Star, Shuffle } from "lucide-react";

const POINTS_PER_COURSE = 20;

const CourseTestPage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const [test, setTest] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [levelUp, setLevelUp] = useState(false);
    const [isRandomOrder, setIsRandomOrder] = useState(false);
    const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);

    useEffect(() => {
        loadTest();
    }, [courseId]);

    const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const toggleRandomOrder = () => {
        if (!isRandomOrder) {
            // Включаем рандомный порядок
            const shuffled = shuffleArray(originalQuestions);
            setQuestions(shuffled);
            setIsRandomOrder(true);
            toast.success('Вопросы перемешаны в случайном порядке!');
        } else {
            // Возвращаем исходный порядок
            setQuestions([...originalQuestions]);
            setIsRandomOrder(false);
            toast.success('Вопросы возвращены к исходному порядку');
        }
        // Сбрасываем прогресс
        setAnswers(new Array(questions.length).fill(-1));
        setCurrentQuestion(0);
    };

    const loadTest = async () => {
        try {
            const testRef = doc(db, 'courses', courseId, 'tests', 'main');
            const testSnap = await getDoc(testRef);
            
            if (testSnap.exists()) {
                const testData = testSnap.data();
                setTest(testData);
                setOriginalQuestions(testData.questions);
                setQuestions(testData.questions);
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
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const getLevelByScore = (score: number): number => {
        if (score >= 400) return 4;
        if (score >= 300) return 3;
        if (score >= 200) return 2;
        if (score >= 100) return 1;
        return 0;
    };

    const submitTest = async () => {
        if (answers.some(a => a === -1)) {
            toast.error('Ответьте на все вопросы');
            return;
        }

        setSubmitting(true);
        
        // Подсчет баллов (с учетом оригинального порядка для сохранения)
        let correct = 0;
        questions.forEach((q: any, idx: number) => {
            if (answers[idx] === q.correctAnswer) {
                correct++;
            }
        });
        
        const finalScore = (correct / questions.length) * 100;
        setScore(finalScore);
        const passed = finalScore >= test.passingScore;

        try {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                const currentScore = userSnap.data()?.score || 0;
                let earnedPoints = 0;
                
                const alreadyPassed = userSnap.data()?.courseProgress?.[courseId]?.testPassed;
                
                if (passed && !alreadyPassed) {
                    earnedPoints = POINTS_PER_COURSE;
                    setPointsEarned(earnedPoints);
                    
                    const oldLevel = getLevelByScore(currentScore);
                    const newLevel = getLevelByScore(currentScore + earnedPoints);
                    if (newLevel > oldLevel) {
                        setLevelUp(true);
                        toast.success(`🎉 Поздравляем! Вы повысили уровень!`);
                    }
                }
                
                await updateDoc(userRef, {
                    [`completedTests.${courseId}`]: {
                        score: finalScore,
                        passed: passed,
                        completedAt: new Date().toISOString(),
                        answers: answers,
                        wasRandomOrder: isRandomOrder
                    },
                    [`courseProgress.${courseId}`]: {
                        testCompleted: true,
                        testScore: finalScore,
                        testPassed: passed,
                        completedAt: new Date().toISOString()
                    },
                    ...(passed && !alreadyPassed && { score: increment(POINTS_PER_COURSE) })
                });

                if (passed && !alreadyPassed) {
                    toast.success(`✨ Вы получили ${POINTS_PER_COURSE} XP за прохождение курса!`);
                }
                toast.success(passed ? 'Поздравляем! Вы прошли тест!' : 'К сожалению, вы не прошли тест');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            toast.error('Ошибка сохранения результата');
        }

        setShowResults(true);
        setSubmitting(false);
    };

    const resetTest = () => {
        setShowResults(false);
        setCurrentQuestion(0);
        setAnswers(new Array(questions.length).fill(-1));
        if (isRandomOrder) {
            setQuestions(shuffleArray(originalQuestions));
        }
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
                        
                        {passed && pointsEarned > 0 && (
                            <div className="bg-yellow-50 rounded-lg p-4 mb-4 flex items-center justify-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span className="text-yellow-700 font-medium">
                                    Получено {pointsEarned} XP
                                </span>
                                {levelUp && (
                                    <span className="text-blue-600 font-bold ml-2">
                                        🎉 Повышение уровня!
                                    </span>
                                )}
                            </div>
                        )}
                        
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
                                <Button onClick={resetTest}>
                                    Попробовать снова
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm text-gray-600">
                            Вопрос {currentQuestion + 1} из {questions.length}
                        </span>
                        {isRandomOrder && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Перемешан
                            </span>
                        )}
                    </div>
                    <Button
                        onClick={toggleRandomOrder}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Shuffle className="w-4 h-4" />
                        {isRandomOrder ? 'Исходный порядок' : 'Перемешать вопросы'}
                    </Button>
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
                
                {currentQuestion === questions.length - 1 ? (
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