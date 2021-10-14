import { Listener } from '@sapphire/framework';
import type { Role } from 'discord.js';
import Configuration from '@/models/configuration';
import ReactionRole from '@/models/reactionRole';
import type { GuildTextBasedChannel } from '@/types';

export default class RoleDeleteListener extends Listener {
  public async run(role: Role): Promise<void> {
    const affectedReactionRoleConditions = await ReactionRole.updateMany(
      { roleCondition: role.id },
      { roleCondition: null },
    );
    if (affectedReactionRoleConditions.modifiedCount > 0)
      this.container.logger.debug(`[ReactionRoles] Removed condition of role ${role.id} for reaction-roles because the role (@${role.name}) was deleted.`);

    const affectedReactionRoles = await ReactionRole.find({ 'reactionRolePairs.role': role.id });
    await ReactionRole.updateMany(
      { 'reactionRolePairs.role': role.id },
      { $pull: { reactionRolePairs: { role: role.id } } },
    );
    if (affectedReactionRoles.length > 0) {
      for (const reactionRole of affectedReactionRoles) {
        const pair = reactionRole.reactionRolePairs.find(rrp => rrp.role === role.id);
        const reaction = (await (this.container.client
          .guilds.cache.get(reactionRole.guildId)
          .channels.cache.get(reactionRole.channelId) as GuildTextBasedChannel)
          ?.messages.fetch(reactionRole.messageId))
          ?.reactions.cache.get(pair.reaction);
        await reaction?.remove();
      }
      this.container.logger.debug(`[ReactionRoles] Removed pairs with role ${role.id} for reaction-roles because the role (@${role.name}) was deleted. Affected reaction-roles: ${affectedReactionRoles.map(rr => rr.getMessageUrl()).join(', ')}`);
    }

    const affectedConfigurations = await Configuration.find({ value: role.id });
    if (affectedConfigurations.length > 0) {
      const names = affectedConfigurations.map(conf => conf.name);
      for (const entry of names)
        await this.container.client.configManager.remove(entry, role.guild);
      this.container.logger.debug(`[Configuration] Removed configuration entries ${names.join(', ')} because the role ${role.id} (@${role.name}) was deleted.`);
    }
  }
}