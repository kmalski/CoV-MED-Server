const bcrypt = require('bcryptjs');
const { Client, Doctor, Clinic, User } = require('../../_helpers/db');

module.exports = {
  create,
  makeVisit,
  getAll,
  getVisits,
  getExaminations,
  getStatus,
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

  if (await Client.findOne({ 'visits.date': param.date, 'visits.doctor': doctorId }))
    throw 'Doctor already has a visit at this time';

  const clinicId = await Clinic.findOne({ city: param.clinic.city, street: param.clinic.street }).select('id');
  const client = await Client.findById(clientId);

  if (client.visits.find((visit) => visit.date.toISOString() == param.date))
    throw 'Client already has a visit at this time';

  client.visits.push({ date: param.date, service: param.service, doctor: doctorId, clinic: clinicId });
  await client.save();
}

async function getAll() {
  return await Client.find().select('-hash -visits -examinations');
}

async function getVisits(param, clientId) {
  const client = await Client.findById(clientId)
    .populate('visits.doctor', '-hash -createdDate')
    .select('-visits.clinic');

  if (!param.toDate) {
    return client.visits;
  }

  const toDate = new Date(param.toDate);

  visits = client.visits.filter((visit) => {
    return visit.date < toDate;
  });

  return visits;
}

async function getExaminations(clientId) {
  const client = await Client.findById(clientId)
    .populate('examinations.doctor', 'firstName lastName email')
    .select('examinations');

  return client.examinations;
}

async function getStatus(clientId) {
  const client = await Client.findById(clientId);

  if (!client) throw 'User not found';

  return { active: client.active };
}
