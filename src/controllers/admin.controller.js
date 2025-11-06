

export const admin = async (req, res) => {
  const { accesstoken } = req.body;
  if (!accesstoken)
    res.json({ message: "admin route" })
}
