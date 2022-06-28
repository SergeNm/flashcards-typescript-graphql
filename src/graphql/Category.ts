import { objectType, extendType, nonNull, intArg, stringArg } from "nexus";
import { User } from "@prisma/client";

export const Category = objectType({
    name: "Category",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.list.field("flashCards", { type: "FlashCard" });
    },
});

export const CategoryQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("categories", {
            type: "Category",
            resolve(parent, args, context) {
                return context.prisma.category.findMany(); // 1
            },
        });
    },
});

export const CategoryMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createCategory", {
            type: "Category",
            args: {
                name: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                return context.prisma.category.create({
                    data: {
                        name: args.name,
                    },
                });
            },
        });
    },
});
