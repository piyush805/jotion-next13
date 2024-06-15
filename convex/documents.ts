import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getSideBar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex(
        "by_user_parent",
        (q) =>
          q
            .eq("userId", userId) // only logged in user's document
            .eq("parentDocument", args.parentDocument) // if nested documents as well, else undefined if not passed
      )
      .filter((q) => q.eq(q.field("isArchived"), false)) // un-deleted
      .order("desc")
      .collect();

    return documents;
  },
});

/**
 * Create new note API endpoint
 */
export const create = mutation({
  args: {
    title: v.string(), // title of the document to be created
    parentDocument: v.optional(v.id("documents")),
  },
  // Document create function
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // unauth user trying to create a document
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument, // undefined works because this is optional
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});
