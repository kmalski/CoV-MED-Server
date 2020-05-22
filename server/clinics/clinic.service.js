const { Clinic, Doctor } = require('../_helpers/db');

module.exports = {
  getAll,
  getById,
  getCities,
  getStreets,
  getServices,
  getDoctors,
  create,
  addService,
  addDoctor,
};

async function getAll() {
  return await Clinic.find();
}

async function getById(id) {
  return await Clinic.findById(id);
}

async function getCities() {
  return await Clinic.distinct('city');
}

async function getStreets(city) {
  return await Clinic.find({ city: city }).distinct('street');
}

async function getServices(clinicParam) {
  clinic = await Clinic.findOne({ city: clinicParam.city, street: clinicParam.street }).select('medicalServices');

  return clinic.medicalServices;
}

async function getDoctors(clinicParam) {
  clinic = await Clinic.findOne({
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
  clinic = await Clinic.findOne({ city: param.city, street: param.street });

  if (!clinic) throw 'Clinic not found';

  clinic.medicalServices.push({ name: param.service });
  await clinic.save();
}

async function addDoctor(param) {
  clinic = await Clinic.findOne({ city: param.city, street: param.street });
  if (!clinic) throw 'Clinic not found';

  medicalService = clinic.medicalServices.filter((service) => {
    return service.name == param.service;
  })[0];
  if (!medicalService) throw 'Medical service not found in this Clinic';

  doctor = await Doctor.findOne({ email: param.email });
  medicalService.doctors.push(doctor._id);

  await clinic.save();
}

async function deleteByCityStreet(param) {
  const clinic = await Clinic.findOne({ city: param.city, street: param.street });

  if (!clinic) throw 'Clinic does not exist';

  await Clinic.findOneAndRemove({ city: param.city, street: param.street });
}
