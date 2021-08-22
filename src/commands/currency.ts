import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import CurrencyModel from "../database/models/CurrencyModel";
import { CommandInt } from "../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleDaily } from "../modules/commands/subcommands/currency/handleDaily";
import { handleWeekly } from "../modules/commands/subcommands/currency/handleWeekly";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const currency: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Handles Becca's economy system.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("daily")
        .setDescription("Claim your daily currency.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Claim your weekly currency.")
    ),
  run: async (Becca, interaction) => {
    try {
      await interaction.deferReply();

      const userData =
        (await CurrencyModel.findOne({ userId: interaction.user.id })) ||
        (await CurrencyModel.create({
          userId: interaction.user.id,
          currencyTotal: 0,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
        }));

      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "daily":
          await handleDaily(Becca, interaction, userData);
          break;
        case "weekly":
          await handleWeekly(Becca, interaction, userData);
          break;
        default:
          await interaction.editReply({
            content: Becca.responses.invalid_command,
          });
          break;
      }
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "currency group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "currency group", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "currency group", errorId)],
          })
        );
    }
  },
};
