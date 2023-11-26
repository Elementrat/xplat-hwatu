import { Tag } from "xplat-lib";
import connectDB from "./connect-db";
import { stringToObjectId } from "./util";

interface TagFilter {
  page?: number;
  limit?: number;
  userID?: string;
}

export async function getTags(filter: TagFilter = {}) {
  try {
    await connectDB();

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    const tags = await Tag.find({ userID: filter?.userID })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const results = tags.length;

    return {
      tags: tags || [],
      page,
      limit,
      results
    };
  } catch (error) {
    return { error };
  }
}

export async function createTag({
  title,
  cards,
  userID,
  color
}: {
  title: string;
  cards?: Array<string>;
  userID: string;
  color?: string;
}) {
  try {
    await connectDB();

    const tag = await Tag.create({ title, userID, cards, color });

    return {
      tag
    };
  } catch (error) {
    return { error };
  }
}

export async function getTag(id: string) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Tag not found" };
    }

    const tag = await Tag.findById(parsedId).lean().exec();
    if (tag) {
      return {
        tag
      };
    } else {
      return { error: "Tag not found" };
    }
  } catch (error) {
    return { error };
  }
}

export async function updateTag(
  id: string,
  { cards, title }: { cards?: Array<string>; title?: string }
) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Tag not found" };
    }

    const tag = await Tag.findByIdAndUpdate(
      parsedId,
      { cards, title },
      { new: true }
    )
      .lean()
      .exec();

    if (tag) {
      return {
        tag
      };
    } else {
      return { error: "Tag not found" };
    }
  } catch (error) {
    return { error };
  }
}

export async function deleteTag(id: string) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Tag not found" };
    }

    const tag = await Tag.findByIdAndDelete(parsedId).exec();

    if (tag) {
      return {};
    } else {
      return { error: "Tag not found" };
    }
  } catch (error) {
    return { error };
  }
}

// Just for debug
export async function deleteAllTags() {
  try {
    await connectDB();

    const tag = await Tag.deleteMany().exec();

    if (tag) {
      return {};
    } else {
      return { error: "Tag not found" };
    }
  } catch (error) {
    return { error };
  }
}
