const bcrypt = require('bcryptjs');
const { Doctor, User, Client } = require('../../_helpers/db');

module.exports = {
  create,
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

async function getAll() {
  return await Doctor.find().select('-hash');
}

async function getVisits(param, doctorId) {
  const clients = await Client.find({ 'visits.doctor': doctorId })
    .populate('visits.doctor', '-hash -createdDate')
    .select('-visits.clinic');

  let visits = clients
    .map((client) => client.visits)
    .flat()
    .filter((visit) => {
      return visit.doctor._id == doctorId;
    });

  if (!param.toDate) {
    return visits;
  }

  const toDate = new Date(param.toDate);

  visits = visits.filter((visit) => {
    return visit.date < toDate;
  });

  return visits;
}

async function getClients(doctorId) {
  const clients = await Client.find({ 'visits.doctor': doctorId })
    .populate('visits.doctor', '-hash -createdDate')
    .select('-visits.clinic');

  return clients;
}
