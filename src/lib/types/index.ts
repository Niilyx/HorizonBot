import type {
  GuildMember,
  GuildTextBasedChannel,
  Message,
  Role,
} from 'discord.js';
import type { EclassPlace, SubjectDocument } from '@/types/database';

/* ******************************************* */
/*                    Utils                    */
/* ******************************************* */


export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

/* ******************************************* */
/*  Custom Types used all across the codebase  */
/* ******************************************* */

export interface CommandDescriptionOptions {
  name: string;
  command: string;
  options?: Record<string, string>;
}

export interface ContextMenuCommandDescriptionOptions {
  name: string;
  command?: never;
}

export interface SubcommandDescriptionOptions {
  name: string;
  command: string;
  subcommands?: Record<string, string>;
  options?: Record<string, string>;
}

export interface CommandConfiguration {
  descriptions: CommandDescriptionOptions | ContextMenuCommandDescriptionOptions;
  messages: object;
}

export interface SubcommandConfiguration {
  descriptions: SubcommandDescriptionOptions;
  messages: object;
}

export enum SchoolYear {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
}

export enum TeachingUnit {
  GeneralFormation = 'Formation Générale',
  ComputerScience = 'Informatique',
  Mathematics = 'Mathématiques',
  PhysicsElectronics = 'Physique & Électronique',
}

export interface EclassCreationOptions {
  date: Date;
  subject: SubjectDocument;
  topic: string;
  duration: number;
  professor: GuildMember;
  targetRole: Role | null | undefined;
  place: EclassPlace;
  placeInformation: string | null;
  isRecorded: boolean;
}

export interface EclassEmbedOptions {
  classChannel: GuildTextBasedChannel;
  classId: string;
  date: number;
  end: number;
  isRecorded: boolean;
  professor: GuildMember;
  subject: SubjectDocument;
  place: EclassPlace;
  placeInformation: string | null;
  topic: string;
}

export type GuildMessage = Message<true>;

export interface CodeLanguageResult {
  display: string;
  language: string;
  version: string;
  versionIndex: string;
  slugs: string[];
}
