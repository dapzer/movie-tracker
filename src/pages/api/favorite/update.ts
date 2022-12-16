import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from '../../../lib/mongodb';
import { ObjectId } from 'bson';

type Data = {
  msg: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await (
    await clientPromise
  )
    .db()
    .collection('users')
    .updateOne(
      {
        _id: new ObjectId(req.body.userId),
        'favoriteList.id': req.body.id,
      },
      {
        $set: {
          'favoriteList.$.trackingData': req.body.trackingData,
        },
      }
    );

  res.status(200).json({ msg: `Movie with id ${req.body.id} was updated` });
}
