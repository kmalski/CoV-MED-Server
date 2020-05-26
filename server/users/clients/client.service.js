const bcrypt = require('bcryptjs');
const { Client, Doctor, Clinic, User } = require('../../_helpers/db');

module.exports = {
  create,
  makeVisit,
  getVisits,
  activate,
  deactivate,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const client = new Client(userParam);

  if (userParam.password) {
    client.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await client.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}

async function makeVisit(param, clientId) {
  const doctorId = await Doctor.findOne({ email: param.doctor.email }).select('id');
  const clinicId = await Clinic.findOne({ city: param.clinic.city, street: param.clinic.street }).select('id');
  const client = await Client.findById(clientId);

  client.visits.push({ date: param.date, doctor: doctorId, clinic: clinicId });
  await client.save();
}

async function getVisits(param, clientId) {
  const client = await Client.findById(clientId).populate('visits.doctor', '-hash -createdDate').select('-visits.clinic');
  const toDate = new Date(param.toDate);

  visits = client.visits.filter((visit) => {
    return visit.date < toDate;
  });
  console.log(visits);
  return visits;
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
