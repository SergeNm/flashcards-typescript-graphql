import { FlashCard, User } from "@prisma/client";
import { objectType, extendType ,intArg, nonNull } from "nexus";

export const Read = objectType({
    name: "Read",
    definition(t) {
        t.nonNull.field("flashCard", { type: "FlashCard" });
        t.nonNull.field("user", { type: "User" });
    },
})

export const ReadMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("read", {
            type: "Read",
            args: {
                flashCardId: nonNull(intArg()),
            },
            async resolve(parent, args, context) {
                const { userId } = context;
                const { flashCardId } = args;
                if (!userId) {
                    throw new Error("Cannot read without logging in.");
                }
                const flashCard = await context.prisma.flashCard.findUnique({
                    where: { id: flashCardId },
                });
                const user = await context.prisma.user.findUnique({
                    where: { id: userId },
                });
                const read = await context.prisma.flashCard.update({
                    where: {
                        id: flashCardId,
                    },
                    data: {
                        readers: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                });

                return {
                    flashCard: flashCard as FlashCard,
                    user: user as User,
                };
            }
        });
    }
})
