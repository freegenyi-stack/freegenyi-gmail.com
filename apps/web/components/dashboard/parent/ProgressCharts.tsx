'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProgressData {
    date: string;
    score: number;
}

interface SubjectData {
    subject: string;
    score: number;
    fullMark: number;
}

interface ProgressChartsProps {
    progressOverTime: ProgressData[];
    subjectScores: SubjectData[];
    exerciseCompletion: { month: string; completed: number; total: number }[];
}

export function ProgressCharts({
    progressOverTime,
    subjectScores,
    exerciseCompletion
}: ProgressChartsProps) {
    // Calculate trend
    const latestScore = progressOverTime[progressOverTime.length - 1]?.score || 0;
    const previousScore = progressOverTime[progressOverTime.length - 2]?.score || 0;
    const trend = latestScore - previousScore;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Progress Over Time */}
            <Card className="col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Évolution de la progression</CardTitle>
                            <CardDescription>Scores moyens au fil du temps</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {trend > 0 ? (
                                <>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">
                                        +{trend.toFixed(1)} points
                                    </span>
                                </>
                            ) : trend < 0 ? (
                                <>
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">
                                        {trend.toFixed(1)} points
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm font-medium text-gray-600">
                                    Stable
                                </span>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={progressOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                domain={[0, 20]}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 5 }}
                                activeDot={{ r: 7 }}
                                name="Score moyen"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            {/* Subject Competencies Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Compétences par matière</CardTitle>
                    <CardDescription>Scores par matière</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectScores} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 20]} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="subject" type="category" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar
                                dataKey="score"
                                fill="#8b5cf6"
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            {/* Exercise Completion Rates */}
            <Card>
                <CardHeader>
                    <CardTitle>Taux de complétion</CardTitle>
                    <CardDescription>Exercices terminés par mois</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={exerciseCompletion}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar
                                dataKey="completed"
                                fill="#10b981"
                                name="Terminés"
                                radius={[8, 8, 0, 0]}
                            />
                            <Bar
                                dataKey="total"
                                fill="#e5e7eb"
                                name="Total"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
