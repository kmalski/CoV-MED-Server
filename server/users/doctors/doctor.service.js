const bcrypt = require('bcryptjs');
const { Doctor, User, Client } = require('../../_helpers/db');

module.exports = {
  create,
  addExamination,
  addRefferal,
  addPrescription,
  getAll,
  getVisits,
  getClients,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const doctor = new Doctor(userParam);

  if (userParam.password) {
    doctor.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await doctor.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}

async function addExamination(param, doctorId) {
  const client = await Client.findOne({ email: param.client.email });

  client.examinations.push({ name: param.name, result: param.result, doctor: doctorId });
  await client.save();
}

async function addRefferal(param, doctorId) {
  const client = await Client.findOne({ 'visits.doctor': doctorId, 'visits.date': param.visit.date });

  if (!client) throw 'This client does not exists';

  const visit = client.visits.find((visit) => visit.doctor == doctorId && visit.date.toISOString() == param.visit.date);
  visit.refferal = param.refferal;
  await client.save();
}

async function addPrescription(param, doctorId) {
  const client = await Client.findOne({ 'visits.doctor': doctorId, 'visits.date': param.visit.date });

  if (!client) throw 'This client does not exists';

  const visit = client.visits.find((visit) => visit.doctor == doctorId && visit.date.toISOString() == param.visit.date);
  visit.prescription = param.prescription;
  await client.save();
}

async function getAll() {
  return await Doctor.find().select('-hash');
}

async function getVisits(param, doctorId) {
  const clients = await Client.find({ 'visits.doctor': doctorId }).select(
    '-visits.clinic -createdDate -hash -examinations'
  );

  for (const client of clients) {
    client.visits = client.visits.filter((visit) => visit.doctor == doctorId);
  }

  if (!param.toDate) {
    return clients;
  }

  const toDate = new Date(param.toDate);

  for (const client of clients) {
    client.visits = client.visits.filter((visit) => visit.date < toDate);
  }

  return clients;
}

async function getClients(doctorId) {
  const clients = await Client.find({ 'visits.doctor': doctorId })
    .populate('visits.doctor', '-hash -createdDate')
    .populate('examinations.doctor', '-hash -createdDate')
    .select('-visits.clinic -hash -createdDate');

  return clients;
}
