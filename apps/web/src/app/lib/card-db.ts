import { Card } from "xplat-lib";
import connectDB from "./connect-db";
import { stringToObjectId } from "./util";

interface CardFilter {
  page?: number;
  limit?: number;
  userID?: string;
}

export async function getCards(filter: CardFilter = {}) {
  try {
    await connectDB();

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    //const userFilter = filter?.userID ? { userID: filter?.userID } : null;

    const cards = await Card.find({ userID: filter?.userID })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const results = cards.length;

    return {
      cards: cards || [],
      page,
      limit,
      results
    };
  } catch (error) {
    return { error };
  }
}

export async function createCard({
  title,
  sideB,
  userID
}: {
  title: string;
  sideB: string;
  userID: string;
}) {
  try {
    await connectDB();

    const card = await Card.create({ title, sideB, userID });

    return {
      card
    };
  } catch (error) {
    return { error };
  }
}

export async function getCard(id: string) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Card not found" };
    }

    const card = await Card.findById(parsedId).lean().exec();
    if (card) {
      return {
        card
      };
    } else {
      return { error: "Card not found" };
    }
  } catch (error) {
    return { error };
  }
}

export async function updateCard(
  id: string,
  { title, sideB }: { title?: string; sideB: string }
) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Card not found" };
    }

    const card = await Card.findByIdAndUpdate(
      parsedId,
      { title, sideB },
      { new: true }
    )
      .lean()
      .exec();

    if (card) {
      return {
        card
      };
    } else {
      return { error: "Card not found" };
    }
  } catch (error) {
    return { error };
  }
}

export async function deleteCard(id: string) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Card not found" };
    }

    const card = await Card.findByIdAndDelete(parsedId).exec();

    if (card) {
      return {};
    } else {
      return { error: "Card not found" };
    }
  } catch (error) {
    return { error };
  }
}

// Just for debug
export async function deleteAllCards() {
  try {
    await connectDB();

    const card = await Card.deleteMany().exec();

    if (card) {
      return {};
    } else {
      return { error: "Card not found" };
    }
  } catch (error) {
    return { error };
  }
}
