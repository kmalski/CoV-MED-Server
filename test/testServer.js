let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/index');

//Assertion Style
chai.should();

chai.use(chaiHttp);

const clientUser = {
  email: 'ClientTestAccount@mail.com',
  password: 'ClientTestPassword',
  firstName: 'ClientTestName',
  lastName: 'ClientTestLastName',
  phoneNumber: '123456789',
  pesel: '12345678999',
};

const doctorUser = {
  email: 'DoctorTestAccount@mail.com',
  password: 'DoctorTestPassword',
  firstName: 'DoctorTestName',
  lastName: 'DoctorTestLastName',
  phoneNumber: '123456789',
  specialization: 'dermatologist',
};

const receptionistUser = {
  email: 'ReceptionistTestAccount@mail.com',
  password: 'ReceptionistTestPassword',
  firstName: 'ReceptionistTestName',
  lastName: 'ReceptionistTestLastName',
  phoneNumber: '123456789',
};

let token = '';
let id = '';

describe('Testing Cov-Med API', () => {
  //Testing client user
  describe('POST /clients/register', () => {
    it('(Client) It should register an user', (done) => {
      chai
        .request(server)
        .post('/clients/register')
        .send(clientUser)
        .end((err, response) => {
          id = response.body.id;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(clientUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Client');
          response.body.should.have.property('firstName').eq(clientUser.firstName);
          response.body.should.have.property('lastName').eq(clientUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string');
          done();
        });
    }).timeout(10000);
  });

  describe('POST /users/authenticate', () => {
    it('(Client) It should find the user', (done) => {
      chai
        .request(server)
        .post('/users/authenticate')
        .send({ email: clientUser.email, password: clientUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(clientUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Client');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('(Client) It should not let to find the user by id', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ email: clientUser.email, password: clientUser.password })
        .end((err, response) => {
          response.status.should.eq(403);
          response.text.should.be.eq('Insufficient scope');
          done();
        });
    });
  });

  describe('POST /clients/register', () => {
    it('(Client) It should not register an user', (done) => {
      chai
        .request(server)
        .post('/clients/register')
        .send(clientUser)
        .end((err, response) => {
          response.status.should.eq(400);
          done();
        });
    });
  });

  describe('DELETE /users/delete', () => {
    it('(Client) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ email: clientUser.email, password: clientUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          done();
        });
    });
  });

  //Testing doctor user
  describe('POST /doctors/register', () => {
    it('(Doctor) It should register an user', (done) => {
      chai
        .request(server)
        .post('/doctors/register')
        .send(doctorUser)
        .end((err, response) => {
          id = response.body.id;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(doctorUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Doctor');
          response.body.should.have.property('firstName').eq(doctorUser.firstName);
          response.body.should.have.property('lastName').eq(doctorUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string');
          done();
        });
    });
  });

  describe('POST /users/authenticate', () => {
    it('(Doctor) It should find the user', (done) => {
      chai
        .request(server)
        .post('/users/authenticate')
        .send({ email: doctorUser.email, password: doctorUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(doctorUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Doctor');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('(Doctor) It should not let to find the user by id ', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ email: doctorUser.email, password: doctorUser.password })
        .end((err, response) => {
          response.status.should.eq(403);
          response.text.should.be.eq('Insufficient scope');
          done();
        });
    });
  });

  describe('POST /doctors/register', () => {
    it('(Doctor) It should not register an user', (done) => {
      chai
        .request(server)
        .post('/doctors/register')
        .send(doctorUser)
        .end((err, response) => {
          response.status.should.eq(400);
          done();
        });
    });
  });

  describe('DELETE /users/delete', () => {
    it('(Doctor) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ email: doctorUser.email, password: doctorUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          done();
        });
    });
  });

  //Testing receptionists user
  describe('POST /receptionists/register', () => {
    it('(Receptionist) It should register an user', (done) => {
      chai
        .request(server)
        .post('/receptionists/register')
        .send(receptionistUser)
        .end((err, response) => {
          id = response.body.id;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(receptionistUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Receptionist');
          response.body.should.have.property('firstName').eq(receptionistUser.firstName);
          response.body.should.have.property('lastName').eq(receptionistUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string');
          done();
        });
    });
  });

  describe('POST /users/authenticate', () => {
    it('(Receptionist) It should find the user', (done) => {
      chai
        .request(server)
        .post('/users/authenticate')
        .send({ email: receptionistUser.email, password: receptionistUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(receptionistUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Receptionist');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('(Receptionist) It should find the user by id ', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ email: receptionistUser.email, password: receptionistUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          response.body.should.have.property('email').eq(receptionistUser.email);
          response.body.should.not.have.property('password');
          response.body.should.have.property('userType').eq('Receptionist');
          response.body.should.have.property('firstName').eq(receptionistUser.firstName);
          response.body.should.have.property('lastName').eq(receptionistUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string').and.to.be.eq(id);
          done();
        });
    });
  });

  describe('POST /receptionists/register', () => {
    it('(Receptionist) It should not register an user', (done) => {
      chai
        .request(server)
        .post('/receptionists/register')
        .send(receptionistUser)
        .end((err, response) => {
          response.status.should.eq(400);
          done();
        });
    });
  });

  describe('DELETE /users/delete', () => {
    it('(Receptionist) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ email: receptionistUser.email, password: receptionistUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          done();
        });
    });
  });
});
