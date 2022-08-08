const jwt = require('jsonwebtoken');

const googleAuthJWT = (req, res) => {
  // Successful authentication, redirect home.
  const { name, firstName, lastName, email, providerId, profilePicture } =
    req.user;

  console.log('req.user:', req.user);
  const payload = {
    name,
    firstName,
    lastName,
    email,
    providerId,
    avatar: profilePicture,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });

  // 1st token is the cookies name
  res.cookie('token', token, {
    signed: true,
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 14,
  });
  return res.status(200).send(req.user);
};

module.exports = googleAuthJWT;
