import type { Collection } from 'discord.js';
import type ConfigurationManager from '@/structures/ConfigurationManager';
import type FlaggedMessage from '@/structures/FlaggedMessage';
import type TaskStore from '@/structures/tasks/TaskStore';
import type { DiscordLogType, LogStatuses, ReminderDocument } from '@/types/database';

declare module '@sapphire/framework' {
  interface StoreRegistryEntries {
    tasks: TaskStore;
  }

  interface SapphireClient {
    configManager: ConfigurationManager;
    remainingCompilerApiCredits: number;
    reactionRolesIds: Set<string>;
    eclassRolesIds: Set<string>;
    waitingFlaggedMessages: FlaggedMessage[];
    roleIntersections: Set<string>;
    reminders: Set<ReminderDocument>;
    logStatuses: Collection<string, Collection<DiscordLogType, LogStatuses>>;

    loadReactionRoles(): Promise<void>;
    loadEclassRoles(): Promise<void>;
    loadReminders(): Promise<void>;
    checkValidity(): void;
    syncLogStatuses(): Promise<void>;
  }
}
