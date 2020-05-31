const { Clinic, Doctor, Client } = require('../_helpers/db');

module.exports = {
  getAll,
  getById,
  getCities,
  getStreets,
  getServices,
  getDoctors,
  getNotAvailableHours,
  create,
  addService,
  addDoctor,
  deleteByCityStreet,
};

async function getAll() {
  return await Clinic.find();
}

async function getById(id) {
  return await Clinic.findById(id);
}

async function getByCityStreet(city, street) {
  return await Clinic.findOne({ city: clinicParam.city, street: clinicParam.street });
}

async function getCities() {
  return await Clinic.distinct('city');
}

async function getStreets(param) {
  return await Clinic.find({ city: param.city }).distinct('street');
}

async function getServices(param) {
  const clinic = await Clinic.findOne({ city: param.city, street: param.street }).select('medicalServices');

  const services = clinic.medicalServices.map((service) => {
    return service.name;
  });

  return services;
}

async function getDoctors(param) {
  const clinic = await Clinic.findOne({
    city: param.city,
    street: param.street,
    'medicalServices.name': param.service,
  }).populate('medicalServices.doctors', 'firstName lastName email');

  const service = clinic.medicalServices.find((service) => {
    return service.name == param.service;
  });

  const doctors = service.doctors.map(({ firstName, lastName, email }) => ({
    firstName,
    lastName,
    email,
  }));

  return doctors;
}

async function getNotAvailableHours(param, date) {
  const doctor = await Doctor.findOne({ email: param.doctor });
  const clinic = await Clinic.findOne({ city: param.city, street: param.street });
  const clients = await Client.find({ 'visits.doctor': doctor._id, 'visits.clinic': clinic._id }).select('visits');

  const dates = clients
    .map((client) => {
      return client.visits.filter((visit) => {
        return visit.date.toDateString() == new Date(date).toDateString();
      });
    })
    .flat()
    .map((visit) => visit.date.toISOString());

  return dates;
}

async function create(clinicParam) {
  if (await Clinic.findOne({ city: clinicParam.city, street: clinicParam.street })) {
    throw 'Clinic in ' + clinicParam.city + ' at ' + clinicParam.street + ' already exsists';
  }

  const clinic = new Clinic(clinicParam);
  await clinic.save();
}

async function addService(param) {
  if (await Clinic.findOne({ city: param.city, street: param.street, 'medicalServices.name': param.service }))
    throw 'This clinic already has this service';

  const clinic = await Clinic.findOne({ city: param.city, street: param.street });

  if (!clinic) throw 'Clinic not found';

  clinic.medicalServices.push({ name: param.service });
  await clinic.save();
}

async function addDoctor(param) {
  const clinic = await Clinic.findOne({ city: param.city, street: param.street });
  if (!clinic) throw 'Clinic not found';

  const medicalService = clinic.medicalServices.find((service) => {
    return service.name == param.service;
  });
  if (!medicalService) throw 'Medical service not found in this Clinic';

  const doctor = await Doctor.findOne({ email: param.doctor.email });
  medicalService.doctors.push(doctor._id);

  await clinic.save();
}

async function deleteByCityStreet(param) {
  const clinic = await Clinic.findOne({ city: param.city, street: param.street });

  if (!clinic) throw 'Clinic does not exist';

  await Clinic.findOneAndRemove({ city: param.city, street: param.street });
}
