import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
  err?: number;
  errorCode?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!req.query.url) return res.status(400).json({ message: 'Url is not defined' });

  try {
    const response = await fetch(req.query.url.toString());

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: `Error when fetching data from proxy. Code: ${response.status}`, errorCode: response.status });
    }
  } catch ({ message }) {
    res.status(400).json({ message: 'Error from proxy', err: Number(message) });
  }
}
