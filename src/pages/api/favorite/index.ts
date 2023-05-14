import type { NextApiRequest, NextApiResponse } from 'next';
import { FavoriteList } from '@/types/FavoriteList';
import { StatusesNames } from '@/types/Enums';
import { prisma } from '@/lib/prisma';

const addFavoriteItem = async (req: NextApiRequest) => {
  const newFavoriteItem: FavoriteList.RootObject = {
    id: req.body.mediaId,
    addedDate: Date.now(),
    mediaType: req.body.mediaType,
    trackingData: {
      currentStatus: StatusesNames.notViewed,
      note: '',
      sitesToView: [],
      seriesInfo: {
        currentSeason: 0,
        currentEpisode: 1,
      },
    },
  };

  await prisma.user.update({
    where: {
      id: req.body.userId as string,
    },
    data: {
      favoriteList: {
        push: newFavoriteItem,
      },
    },
  });

  return newFavoriteItem;
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
  favoriteItem?: FavoriteList.RootObject;
  msg?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method === 'GET') {
    const favoriteList = await getFavoriteList(req);
    return res.status(200).json({ favoriteList });
  }

  if (req.method === 'POST') {
    const favoriteItem = await addFavoriteItem(req);
    return res.status(200).json({ msg: `Movie with id ${req.body.mediaId} was added`, favoriteItem });
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
