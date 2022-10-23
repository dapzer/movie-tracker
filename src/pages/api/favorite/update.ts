import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from '../../../lib/mongodb';
import { ObjectId } from 'bson';

type Data = {
  msg: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.body);
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
          'favoriteList.$.seriesData.currentEpisode': req.body.currentEpisode,
          'favoriteList.$.seriesData.currentSeason': req.body.currentSeason,
          'favoriteList.$.seriesData.siteToView': req.body.siteToView,
        },
      }
    );

  res.status(200).json({ msg: `Movie with id ${req.body.id} was updated` });
}
