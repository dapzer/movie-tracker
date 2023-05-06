import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

type Data = {
  msg: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await prisma.user.update({
    where: {
      id: req.body.userId as string,
    },
    data: {
      favoriteList: {
        updateMany: {
          where: {
            id: req.body.id
          },
          data: {
            trackingData: req.body.trackingData
          }
        }
      },
    },
  });

  res.status(200).json({ msg: `Movie with id ${req.body.id} was updated` });
}
