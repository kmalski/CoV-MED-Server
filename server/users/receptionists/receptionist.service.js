const bcrypt = require('bcryptjs');
const { User, Receptionist, Client } = require('../../_helpers/db');

module.exports = {
  create,
  getVisits,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const receptionist = new Receptionist(userParam);

  if (userParam.password) {
    receptionist.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await receptionist.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}

async function getVisits(param) {
  const clients = await Client.find({ active: true })
    .where('visits')
    .ne([])
    .populate('visits.clinic', 'city street')
    .populate('visits.doctor', 'firstName lastName email')
    .select('-createdDate -hash -examinations -visits.prescription -visits.refferal');

  if (!param.fromDate) {
    return clients;
  }

  const fromDate = new Date(param.fromDate);

  for (const client of clients) {
    client.visits = client.visits.filter((visit) => visit.date >= fromDate);
  }

  return clients;
}
