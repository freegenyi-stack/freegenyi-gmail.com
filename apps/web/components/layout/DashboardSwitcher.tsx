'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const roleConfig = {
    PARENT: {
        label: 'dashboard.roles.parent',
        icon: '👨‍👩‍👧‍👦',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
    },
    TEACHER: {
        label: 'dashboard.roles.teacher',
        icon: '👨‍🏫',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
    },
    NGO: {
        label: 'dashboard.roles.ngo',
        icon: '🤝',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
    },
    ORGANIZATION: {
        label: 'dashboard.roles.admin',
        icon: '🏛️',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
    }
};

export function DashboardSwitcher() {
    const t = useTranslations();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const { user, activeRole, setActiveRole } = useAuthStore();
    const { setActiveRole: setSidebarRole } = useSidebarStore();

    if (!user || !activeRole) return null;

    const availableRoles = user.roles || [];
    const currentConfig = roleConfig[activeRole];

    const handleRoleChange = (role: UserRole) => {
        setActiveRole(role);
        setSidebarRole(role);
        setOpen(false);

        // Navigate to the dashboard for the new role
        const locale = window.location.pathname.split('/')[1] || 'fr';
        if (role === 'TEACHER') {
            router.push(`/${locale}/ecole/dashboard`);
        } else if (role === 'PARENT') {
            router.push(`/${locale}/parent`);
        } else if (role === 'NGO') {
            router.push(`/${locale}/ngo`);
        } else if (role === 'ORGANIZATION') {
            router.push(`/${locale}/organization`);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[240px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{currentConfig.icon}</span>
                        <span className="font-medium">{t(currentConfig.label)}</span>
                    </div>
                    <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0">
                <Command>
                    <CommandEmpty>{t('dashboard.noRoleFound')}</CommandEmpty>
                    <CommandGroup>
                        {availableRoles.map((role) => {
                            const config = roleConfig[role];
                            return (
                                <CommandItem
                                    key={role}
                                    value={role}
                                    onSelect={() => handleRoleChange(role)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xl">{config.icon}</span>
                                        <span>{t(config.label)}</span>
                                    </div>
                                    <Check
                                        className={cn(
                                            'ms-auto h-4 w-4',
                                            activeRole === role ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
