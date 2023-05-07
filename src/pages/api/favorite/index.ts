import type { NextApiRequest, NextApiResponse } from 'next';
import { FavoriteList } from '@/types/FavoriteList';
import { StatusesNames } from '@/types/Enums';
import { prisma } from '@/lib/prisma';

const addFavoriteItem = async (req: NextApiRequest) => {
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


const deleteFavoriteItem = async (req: NextApiRequest) => {
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

const updateFavoriteItem = async (req: NextApiRequest) => {
  await prisma.user.update({
    where: {
      id: req.body.userId as string,
    },
    data: {
      favoriteList: {
        updateMany: {
          where: {
            id: req.body.id,
          },
          data: {
            trackingData: req.body.trackingData,
          },
        },
      },
    },
  });
};


const getFavoriteList = async (req: NextApiRequest) => {
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

  return favoriteList;
};

interface Response {
  favoriteList?: FavoriteList.StatusedObject;
  msg?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method === 'GET') {
    const favoriteList = await getFavoriteList(req);
    return res.status(200).json({ favoriteList });
  }

  if (req.method === 'POST') {
    await addFavoriteItem(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.favoriteItem.id} was added` });
  }

  if (req.method === 'DELETE') {
    await deleteFavoriteItem(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.id} was deleted` });
  }

  if (req.method === 'PATCH') {
    await updateFavoriteItem(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.id} was updated` });
  }

  res.status(200).json({ msg: 'Method not supported' });
}
