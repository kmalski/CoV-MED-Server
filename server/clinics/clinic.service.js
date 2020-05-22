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

async function getStreets(city) {
  return await Clinic.find({ city: city }).distinct('street');
}

async function getServices(clinicParam) {
  const clinic = await Clinic.findOne({ city: clinicParam.city, street: clinicParam.street }).select('medicalServices');

  return clinic.medicalServices;
}

async function getDoctors(clinicParam) {
  const clinic = await Clinic.findOne({
    city: clinicParam.city,
    street: clinicParam.street,
    'medicalServices.name': clinicParam.service,
  })
    .select('medicalServices.doctors')
    .populate('medicalServices.doctors');

  return clinic.medicalServices[0].doctors;
}

async function create(clinicParam) {
  if (await Clinic.findOne({ city: clinicParam.city, street: clinicParam.street })) {
    throw 'Clinic in ' + clinicParam.city + ' at ' + clinicParam.street + ' already exsists';
  }

  const clinic = new Clinic(clinicParam);
  await clinic.save();
}

async function addService(param) {
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

  const doctor = await Doctor.findOne({ email: param.email });
  medicalService.doctors.push(doctor._id);

  await clinic.save();
}

async function deleteByCityStreet(param) {
  const clinic = await Clinic.findOne({ city: param.city, street: param.street });

  if (!clinic) throw 'Clinic does not exist';

  await Clinic.findOneAndRemove({ city: param.city, street: param.street });
}

async function getNotAvailableHours(param) {
  const doctor = await Doctor.findOne({ email: param.doctor.email });
  const clinic = await Clinic.findOne({ city: param.clinic.city, street: param.clinic.street });
  const clients = await Client.find({ 'visits.doctor': doctor._id, 'visits.clinic': clinic._id }).select('visits');

  const dates = clients
    .map((client) => {
      return client.visits.filter((visit) => {
        return visit.date.toDateString() == new Date(param.date).toDateString();
      });
    })
    .flat()
    .map((visit) => visit.date.toTimeString());

  return dates;
}
