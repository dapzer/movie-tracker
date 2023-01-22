import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'bson';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  await (
    await clientPromise
  )
    .db()
    .collection('users')
    .updateOne(
      {
        _id: new ObjectId(req.body.userId),
        favoriteList: {
          $elemMatch: {
            id: req.body.id,
          },
        },
      },
      {
        $pull: {
          favoriteList: {
            id: req.body.id,
          },
        },
      }
    );

  res.status(200).json({ msg: `Movie with id ${req.body.id} was deleted` });
}
