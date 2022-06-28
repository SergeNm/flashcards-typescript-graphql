import { Hardness, Prisma, User } from "@prisma/client";
import {
    objectType,
    extendType,
    nonNull,
    intArg,
    stringArg,
    enumType,
    inputObjectType,
    arg,
    list,
    booleanArg,
} from "nexus";
import { Sort } from "./Link";

export const FlashCard = objectType({
    name: "FlashCard",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.nonNull.string("question");
        t.nonNull.string("answer");
        t.nonNull.string("hardness")
        t.nonNull.dateTime("createdAt");
        t.nonNull.int("categoryId")
        t.field("createdBy", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.flashCard
                    .findUnique({ where: { id: parent.id } })
                    .createdBy();
            },
        });
        t.field("category", {
            type: "Category",
            resolve(parent, args, context) {
                return context.prisma.flashCard
                    .findUnique({ where: { id: parent.id } })
                    .category();
            },
        });
        t.nonNull.list.nonNull.field("readers", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.flashCard
                    .findUnique({ where: { id: parent.id } })
                    .readers();
            }
        })
    },
});


export const FlashcardOrderByInput = inputObjectType({
    name: "FlashcardOrderByInput",
    definition(t) {
        t.field("title", { type: Sort })
        t.field("hardness", { type: Sort })
        t.field("createdAt", { type: Sort })
    }
})

export const FlashCardQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("flashCards", {
            type: "FlashCard",
            args: {
                orderBy: arg({ type: list(nonNull(FlashcardOrderByInput)) })
            },
            resolve(parent, args, context) {
                return context.prisma.flashCard.findMany({
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined,
                });
            },
        });
    },
});


export const FlashCardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createFlashCard", {
            type: "FlashCard",
            args: {
                title: nonNull(stringArg()),
                question: nonNull(stringArg()),
                answer: nonNull(stringArg()),
                categoryId: nonNull(intArg()),
                hardness: stringArg()
            },
            resolve(parent, args, context) {
                const { userId } = context;
                const { title, question, answer, categoryId, hardness } = args;
                if (!userId) {
                    throw new Error("Cannot post without logging in.");
                }
                return context.prisma.flashCard.create({
                    data: {
                        title,
                        question,
                        answer,
                        hardness: hardness as Hardness,
                        createdBy: { connect: { id: userId } },
                        category: { connect: { id: categoryId } },
                    },
                });
            },
        });
    },
});
