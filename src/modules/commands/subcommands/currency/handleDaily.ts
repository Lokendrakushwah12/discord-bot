import { MessageEmbed } from "discord.js";
import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../../utils/parseSeconds";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleDaily: CurrencyHandler = async (
  Becca,
  interaction,
  data
) => {
  try {
    const now = Date.now();
    const canClaim = now - 86400000 > data.dailyClaimed;

    if (!canClaim) {
      const cooldown = data.dailyClaimed - now + 86400000;
      await interaction.editReply({
        content: `You have already claimed your daily!\nCome back in: ${parseSeconds(
          Math.ceil(cooldown / 1000)
        )}`,
      });
      return;
    }

    const earnedCurrency = Math.round(Math.random() * 10);

    data.currencyTotal += earnedCurrency;
    data.dailyClaimed = now;
    await data.save();

    const embed = new MessageEmbed();
    embed.setTitle("Daily Reward!");
    embed.setDescription(
      `You've earned ${earnedCurrency} BeccaCoin! You now have ${data.currencyTotal} BeccaCoin.`
    );
    embed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "daily command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "daily", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "daily", errorId)],
        })
      );
  }
};
