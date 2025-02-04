import { currencies } from "@prisma/client";
import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

/**
 * Handles the logic for the currency commands.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t The i18n translation function.
 * @param {currencies} data The user's currency record from the database.
 */
export type CurrencyHandler = (
  Becca: BeccaLyria,
  interaction: ChatInputCommandInteraction,
  t: TFunction,
  data: currencies
) => Promise<void>;
