import { UserProfile, UserProfileClass } from "xplat-lib";
import connectDB from "./connect-db";
import { stringToObjectId } from "./util";
import { CARD_PROGRESS } from "xplat-lib/models/UserProfile";
import { after } from "node:test";

interface UserProfileFilter {
  page?: number;
  limit?: number;
  userID?: string;
}

export async function getUserProfile(filter: UserProfileFilter = {}) {
  try {
    await connectDB();

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    let userProfile = await UserProfile.findOne({ userID: filter?.userID })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!userProfile) {
      userProfile = await UserProfile.create({ userID: filter?.userID });
    }

    return {
      userProfile,
      page,
      limit
    };
  } catch (error) {
    return { error };
  }
}

export async function updateCardProgress(
  userID: string,
  { cards }: { cards?: Map<string, CARD_PROGRESS> }
) {
  try {
    await connectDB();
    const parsedId = stringToObjectId(userID);

    if (!parsedId) {
      return { error: "User ID not found" };
    }

    let userProfile = await UserProfile.findOne<UserProfileClass>({
      userID: userID
    })
      .lean()
      .exec();

    if (!userProfile) {
      return { error: "Profile not found" };
    }

    for (let key of Object.keys(cards)) {
      userProfile.cardProgress[key] = cards[key];
    }

    const newProfile = await UserProfile.updateOne(
      { userID: userID },
      { cardProgress: userProfile.cardProgress },
      {
        returnDocument: "after"
      }
    );

    if (newProfile) {
      return {
        userProfile: true
      };
    } else {
      return { error: "User Profile not found" };
    }
  } catch (error) {
    return { error };
  }
}
