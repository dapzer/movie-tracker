import type { NextApiRequest, NextApiResponse } from 'next';
import { FavoriteList } from '@/types/FavoriteList';
import { StatusesNames } from '@/types/Enums';
import { prisma } from '@/lib/prisma';

const addFavorite = async (req: NextApiRequest) => {
  await prisma.user.update({
    where: {
      id: req.body.userId as string,
    },
    data: {
      favoriteList: {
        push: req.body.favoriteItem,
      },
    },
  });
};


const deleteFavorite = async (req: NextApiRequest) => {
  await prisma.user.update({
    where: {
      id: req.body.userId as string,
    },
    data: {
      favoriteList: {
        deleteMany: {
          where: {
            id: req.body.id,
          },
        },
      },
    },
  });
};



interface Response {
  favoriteList?: FavoriteList.StatusedObject;
  msg?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method === 'POST') {
    await addFavorite(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.favoriteItem.id} was added` });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.query.userId as string,
    },
  });

  let favoriteList: FavoriteList.StatusedObject = {
    notViewed: [],
    watchingNow: [],
    viewed: [],
    waitNewPart: [],
    allFavorites: user?.favoriteList || [],
  };

  favoriteList.allFavorites.forEach((el) => {
    if (favoriteList[el.trackingData.currentStatus]) {
      favoriteList[el.trackingData.currentStatus].push(el);
    } else {
      favoriteList[StatusesNames.notViewed].push(el);
    }
  });

  res.status(200).json({ favoriteList });
}
