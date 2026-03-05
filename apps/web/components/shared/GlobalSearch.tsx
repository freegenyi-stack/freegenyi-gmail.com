'use client';

import { useState, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    type: 'exercise' | 'student' | 'class' | 'message' | 'resource';
    title: string;
    description?: string;
    url: string;
}

export function GlobalSearch() {
    const t = useTranslations('search');
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);

        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const typeIcons = {
        exercise: '📝',
        student: '👤',
        class: '🎓',
        message: '💬',
        resource: '📚'
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 w-full group overflow-hidden"
            >
                <Search className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="truncate flex-1 text-left font-medium">{t('placeholder')}</span>
                <kbd className="hidden lg:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded-lg border bg-white px-1.5 font-mono text-[9px] font-bold text-slate-400 opacity-80 shadow-sm">
                    <span className="text-[10px]">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 max-w-2xl">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <div className="flex items-center border-b px-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t('placeholder')}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                        />
                    </div>

                    <ScrollArea className="max-h-[400px]">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                {t('searching')}...
                            </div>
                        ) : results.length === 0 && query.length >= 2 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                {t('noResults')}
                            </div>
                        ) : (
                            <div className="p-2">
                                {results.map((result) => (
                                    <a
                                        key={result.id}
                                        href={result.url}
                                        onClick={() => setOpen(false)}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="text-2xl">{typeIcons[result.type]}</span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">
                                                {result.title}
                                            </h4>
                                            {result.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {result.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {t(`type.${result.type}`)}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
