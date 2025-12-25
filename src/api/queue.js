import dbConnect from '../lib/mongodb';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: [
        { name: 'Aniket', token: 'T001' },
        { name: 'Adarsh', token: 'T002' },
        { name: 'Chandan', token: 'T003' },
        { name: 'Aniket', token: 'T004' },
      ]
    });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
