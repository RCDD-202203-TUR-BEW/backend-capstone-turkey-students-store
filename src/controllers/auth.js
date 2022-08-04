const jwt = require('jsonwebtoken');

const sendJwtToken = (req, res) => {
  if (req.user) {
    //     const token = auth.getToken({ _id: req.user._id });
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET_KEY, {
      expiresIn: '60s',
    });
    res.cookie('token', token, { secure: true, httpOnly: true });
    return res.status(200).send(req.user);
  }

  return res.status(401).send('Unauthorized');
};

module.exports = sendJwtToken;
