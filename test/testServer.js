let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/index');

//Assertion Style
chai.should();

chai.use(chaiHttp);

const clientUser = {
  username: 'ClientTestAccount',
  password: 'ClientTestPassword',
  firstName: 'ClientTestName',
  lastName: 'ClientTestLastName'
};

const doctorUser = {
  username: 'DoctorTestAccount',
  password: 'DoctorTestPassword',
  firstName: 'DoctorTestName',
  lastName: 'DoctorTestLastName'
};


const receptionistUser = {
  username: 'ReceptionistTestAccount',
  password: 'ReceptionistTestPassword',
  firstName: 'ReceptionistTestName',
  lastName: 'ReceptionistTestLastName'
};

let token = "";
let id = "";

describe('Testing Cov-Med API', () => {

//Testing client user
  describe('POST /clients/register', () => {
    it('(Client) It should register an user', (done) => {
      console.log(clientUser);
      chai
        .request(server)
        .post('/clients/register')
        .send(clientUser)
        .end((err, response) => {
          id = response.body.id;
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(clientUser.username);
          response.body.should.not.have.property("password");
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
        .send({ username: clientUser.username, password: clientUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(clientUser.username);
          response.body.should.not.have.property("password");
          response.body.should.have.property('userType').eq('Client');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });


  describe('POST /users/:id', () => {
    it('(Client) It should find the user by id ', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ username: clientUser.username, password: clientUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(clientUser.username);
          response.body.should.not.have.property("password");
          response.body.should.have.property('userType').eq('Client');
          response.body.should.have.property('firstName').eq(clientUser.firstName);
          response.body.should.have.property('lastName').eq(clientUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string').and.to.be.eq(id);
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
          response.status.should.eq(500);
          done();
        });
    });
  });

  describe('POST /users/delete', () => {
    it('(Client) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ username: clientUser.username, password: clientUser.password })
        .end((err, response) => {
          console.log(response.body);
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
          response.body.should.have.property('username').eq(doctorUser.username);
          response.body.should.not.have.property("password");
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
        .send({ username: doctorUser.username, password: doctorUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(doctorUser.username);
          response.body.should.not.have.property("password");
          response.body.should.have.property('userType').eq('Doctor');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });


  describe('POST /users/:id', () => {
    it('(Doctor) It should find the user by id ', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ username: doctorUser.username, password: doctorUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(doctorUser.username);
          response.body.should.not.have.property("password");
          response.body.should.have.property('userType').eq('Doctor');
          response.body.should.have.property('firstName').eq(doctorUser.firstName);
          response.body.should.have.property('lastName').eq(doctorUser.lastName);
          response.body.should.have.property('id').and.to.be.a('string').and.to.be.eq(id);
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
          response.status.should.eq(500);
          done();
        });
    });
  });

  describe('POST /users/delete', () => {
    it('(Doctor) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ username: doctorUser.username, password: doctorUser.password })
        .end((err, response) => {
          console.log(response.body);
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
          response.body.should.have.property('username').eq(receptionistUser.username);
          response.body.should.not.have.property("password");
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
        .send({ username: receptionistUser.username, password: receptionistUser.password })
        .end((err, response) => {
          token = response.body.token;
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(receptionistUser.username);
          response.body.should.not.have.property("password");
          response.body.should.have.property('userType').eq('Receptionist');
          response.body.should.have.property('token').and.to.be.a('string');
          done();
        });
    });
  });


  describe('POST /users/:id', () => {
    it('(Receptionist) It should find the user by id ', (done) => {
      chai
        .request(server)
        .get('/users/' + id)
        .set('Authorization', 'bearer ' + token)
        .send({ username: receptionistUser.username, password: receptionistUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          response.body.should.have.property('username').eq(receptionistUser.username);
          response.body.should.not.have.property("password");
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
          response.status.should.eq(500);
          done();
        });
    });
  });

  describe('POST /users/delete', () => {
    it('(Receptionist) It should delete the user', (done) => {
      chai
        .request(server)
        .delete('/users/delete')
        .set('Authorization', 'bearer ' + token)
        .send({ username: receptionistUser.username, password: receptionistUser.password })
        .end((err, response) => {
          response.status.should.eq(200);
          done();
        });
    });
  });

});
