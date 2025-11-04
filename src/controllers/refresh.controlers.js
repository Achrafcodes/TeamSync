import jwt from 'jsonwebtoken';

export const refresh = async (req, res) => {
  const { refreshtoken } = req.body;
  console.log(req.body);
};
