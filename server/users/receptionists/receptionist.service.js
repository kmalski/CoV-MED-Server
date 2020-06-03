const bcrypt = require('bcryptjs');
const { User, Receptionist, Client } = require('../../_helpers/db');

module.exports = {
  create,
  getVisits,
  postponeVisit,
  activate,
  deactivate,
  cancelVisit,
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

async function postponeVisit(param) {
  const client = await Client.findOne({ email: param.client.email, 'visits.date': param.oldDate });

  if (!client) throw 'Visit not found';

  const visit = client.visits.find((visit) => param.oldDate == visit.date.toISOString());
  visit.date = param.newDate;

  await client.save();
}

async function activate(email) {
  const client = await Client.findOne({ email: email });

  if (!client) throw 'User not found';

  client.active = true;
  client.save();
}

async function deactivate(email) {
  const client = await Client.findOne({ email: email });

  if (!client) throw 'User not found';

  client.active = false;
  client.save();
}

async function cancelVisit(param) {
  const client = await Client.findOne({ email: param.client.email, 'visits.date': param.date });

  if (!client) throw 'Visit not found';

  client.visits = client.visits.filter((visit) => param.date != visit.date.toISOString());
  await client.save();
}
