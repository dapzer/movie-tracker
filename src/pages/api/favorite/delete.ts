import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
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

  res.status(200).json({ msg: `Movie with id ${req.body.id} was deleted` });
}
