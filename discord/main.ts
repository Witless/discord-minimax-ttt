import {Game} from "../src/game"
import getChoice from "../src/minimax"
import {Board} from "../src/board";
import Discord from "discord.js"

export default function init():void {

    const client = new Discord.Client({restRequestTimeout: 40000})

    const emojisSelect: string[] = ["1⃣", "2⃣", "3⃣"];


    client.on("ready", () => {


        client.on("message", async (message) => {

            /**
             * Ignore sent messages in DM / Groups and bots
             */
            if (message.channel.type !== "text" || message.author.bot)
                return;

            /**
             * Array to save the selection of the player
             */
            let selectionCollector: number[] = [];

            /**
             * Filter to apply to the collector each time event "collect" happens
             * @param reaction
             * @param user
             */
            function filter(reaction: Discord.MessageReaction, user: Discord.GuildMember): boolean {
                return (reaction.emoji.name === "1⃣" || reaction.emoji.name === "2⃣" || reaction.emoji.name === "3⃣") && user.id === message.author.id;
            }

            /**
             * Defining what command will invoke the bot and create a new match, which is "!new"
             */
            if (message.content === "!new") {
                /**
                 * Initializing a new game, this one will be used only on Discord side
                 */
                const newGame: Game = new Game("Initial", Board.playerB)
                /**
                 * Send the initial board (rendered on discord based on emojis) and store the sent message
                 */
                const gameMessage: Discord.Message = await fillAndSend(message, newGame, false);
                /**
                 * Displays the possibilities for the player to select on their turn (based on message reaction emojis)
                 */
                await emojisSelect.forEach((emoji) => {
                    gameMessage.react(emoji);
                })
                /**
                 * Initialization of the reactionCollector (@discord.js structure)
                 */
                const collector = gameMessage.createReactionCollector(filter);
                const firstIndicationMessage = await message.channel.send("Selecciona Fila");
                collector.on('collect', async (reaction, user) => {
                    /**
                     * The above event is emitted whenever a reaction is added, but we will only get the ones that verify
                     * the filter
                     * Once the player has reacted, we will store it and remove it making it easier to select the next
                     * position
                     */
                    await reaction.users.remove(user.id);
                    selectionCollector.push(emojiResolver(reaction))
                    if (selectionCollector.length === 1) {
                        await firstIndicationMessage.edit("Selecciona Columna")
                    } else if (selectionCollector.length === 2) {
                        /**
                         * Checks if the player can place their token in the wanted position
                         * If they can't they are told so and have to indicate a new position
                         */
                        if (!newGame.get(selectionCollector[0] - 1, selectionCollector[1] - 1)) {
                            newGame.set(selectionCollector[0] - 1, selectionCollector[1] - 1, Board.playerB);

                            /**
                             * Sends the current board state to Discord, with the player's move
                             */
                            await fillAndSend(gameMessage, newGame, true);

                            /**
                             * This is the Game we will provide to our MiniMax function ( an aux Game copied from
                             * the original)
                             */
                            const auxGame: Game = new Game("auxiliarMiniMax", Board.playerA);

                            await firstIndicationMessage.edit("<a:cargando:709357739935006742> Preparando cómo ganarte")

                            let array: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

                            for (let i: number = 0; i < 3; i++) {
                                for (let j: number = 0; j < 3; j++) {
                                    array[i][j] = newGame.get(i, j);
                                }
                            }

                            auxGame.setArray(array);

                            /**
                             * Call to MiniMax through getChoice
                             *  getchoice
                             *  |- minimax
                             */
                            const machineChoice = getChoice(auxGame);

                            /**
                             * When Choice is undefined it means the Game after the last player move was a clear draw
                             * The player is informed through a message on Discord and the collector is destroyed
                             */
                            if (machineChoice === undefined) {

                                await firstIndicationMessage.edit("Enhorabuena, es un empate, nos veremos pronto...");
                                collector.stop()
                                return;

                            }
                            /**
                             * If the above condition isn't satisfied, we'll update our board here and at Discord
                             */
                            newGame.set(machineChoice.x, machineChoice.y, Board.playerA);
                            await fillAndSend(gameMessage, newGame, true);
                            /**
                             * These two conditional statements below will check if the Games has come to an end, if so,
                             * the player will be informed and the collector destroyed
                             */
                            if (newGame.isOver() && newGame.win() === Board.playerA) {

                                await firstIndicationMessage.edit("Lo siento, es hora de que asumas la derrota...");
                                collector.stop()
                                return;

                            } else if (newGame.isOver() && !newGame.win()) {

                                await firstIndicationMessage.edit("Enhorabuena, es un empate, nos veremos pronto...");
                                collector.stop()
                                return;

                            }
                        } else {
                            message.channel.send(`<@${message.member}> Movimiento no permitido`).then((msg) => {
                                msg.delete({timeout: 2000});
                            })
                        }
                        selectionCollector.length = 0;
                        await firstIndicationMessage.edit("Selecciona Fila");
                    }
                })
            }
        })
    })


    function emojiResolver(reaction: Discord.MessageReaction): number {
        switch (reaction.emoji.name) {
            case "1⃣":
                return 1;
            case "2⃣":
                return 2;
            case "3⃣":
                return 3;
        }
        return 0;
    }


    async function fillAndSend(message: Discord.Message, game: Game, flag: boolean): Promise<Discord.Message> {
        let messageToAdd: string = "";
        if (!flag) {
            for (let i: number = 0; i < 3; i++) {
                messageToAdd += "\n";
                for (let j: number = 0; j < 3; j++) {
                    messageToAdd += ":white_large_square:"
                }
            }
            return await message.channel.send(messageToAdd).then((messageSent) => {
                return messageSent;
            })
        } else {
            for (let i: number = 0; i < 3; i++) {
                messageToAdd += "\n";
                for (let j: number = 0; j < 3; j++) {
                    if (game.get(i, j) === 1) {
                        messageToAdd += ":regional_indicator_x:"
                    } else if (game.get(i, j) === 2) {
                        messageToAdd += ":o2:"
                    } else {
                        messageToAdd += ":white_large_square:"
                    }
                }
            }
            return await message.edit(messageToAdd).then((messageSent) => {
                return messageSent;
            })
        }
    }

// Add your Discord Bot Token here
    client.login("").then(() => console.log("Logged"));
}