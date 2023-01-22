import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'bson';
import { FavoriteList } from '@/types/FavoriteList';
import { PushOperator, WithId } from 'mongodb';
import { StatusesNames } from '@/types/Enums';

const addFavorite = async (req: NextApiRequest) => {
  const client = await clientPromise;
  return await client
    .db()
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(req.body.userId) },
      {
        $push: {
          favoriteList: {
            ...req.body.favoriteItem,
          },
        } as PushOperator<Document>,
      }
    );
};

interface Data {
  favoriteList?: FavoriteList.StatusedObject;
  msg?: string;
}

interface UserData {
  _id: string;
  name: string;
  email?: any;
  image: string;
  emailVerified?: any;
  favoriteList: FavoriteList.RootObject[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const client = await clientPromise;
  if (req.method === 'POST') {
    await addFavorite(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.id} was added` });
  }

  const data = (await client
    .db()
    .collection('users')
    .findOne({ _id: new ObjectId(req.query.userId as string) })) as unknown as UserData;

  let favoriteList: FavoriteList.StatusedObject = {
    notViewed: [],
    watchingNow: [],
    viewed: [],
    waitNewPart: [],
    allFavorites: data.favoriteList || [],
  };

  data?.favoriteList?.length > 0 &&
    data.favoriteList.forEach((el) => {
      if (favoriteList[el.trackingData.currentStatus]) {
        favoriteList[el.trackingData.currentStatus].push(el);
      } else {
        favoriteList[StatusesNames.notViewed].push(el);
      }
    });

  res.status(200).json({ favoriteList });
}
