'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentAvatarProps {
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    badges: string[];
    avatarUrl?: string;
}

const levelColors = {
    1: 'from-gray-400 to-gray-600',
    2: 'from-green-400 to-green-600',
    3: 'from-blue-400 to-blue-600',
    4: 'from-purple-400 to-purple-600',
    5: 'from-orange-400 to-orange-600',
    6: 'from-red-400 to-red-600',
    7: 'from-pink-400 to-pink-600',
    8: 'from-yellow-400 to-yellow-600',
    9: 'from-indigo-400 to-indigo-600',
    10: 'from-cyan-400 to-cyan-600'
} as const;

export function StudentAvatar({
    name,
    level,
    xp,
    xpToNextLevel,
    badges,
    avatarUrl
}: StudentAvatarProps) {
    const progress = (xp / xpToNextLevel) * 100;
    const levelColor = levelColors[Math.min(level, 10) as keyof typeof levelColors] || levelColors[1];

    return (
        <Card className="overflow-hidden">
            <CardHeader className={cn(
                "bg-gradient-to-br text-white",
                levelColor
            )}>
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-gray-600">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-current">
                            <span className="text-lg font-bold bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                {level}
                            </span>
                        </div>
                    </div>

                    {/* Name & Title */}
                    <div className="flex-1">
                        <CardTitle className="text-2xl mb-1">{name}</CardTitle>
                        <CardDescription className="text-white/90 flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            Niveau {level} • {xp} XP
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {/* XP Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progression vers niveau {level + 1}</span>
                        <span className="text-muted-foreground">{xp} / {xpToNextLevel} XP</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>

                {/* Badges */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Badges débloqués ({badges.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {badges.slice(0, 6).map((badge, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-lg px-3 py-1"
                            >
                                {badge}
                            </Badge>
                        ))}
                        {badges.length > 6 && (
                            <Badge variant="outline" className="px-3 py-1">
                                +{badges.length - 6} autres
                            </Badge>
                        )}
                        {badges.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Aucun badge débloqué pour le moment
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.floor(xp / 100)}</div>
                        <div className="text-xs text-muted-foreground">Exercices</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{badges.length}</div>
                        <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{level}</div>
                        <div className="text-xs text-muted-foreground">Niveau</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
