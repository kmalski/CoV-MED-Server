let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server/index");

//Assertion Style
chai.should();

chai.use(chaiHttp)
;
const user1 = {
    username: "ClientTestAccount1",
    password: "ClientTestPassword1",
    firstName: "ClientTestName1",
    lastName: "ClientTestLastName1"
    };

describe('Testing Cov-Med API', () => {

    describe("POST /clients/register", () => {
        it("It should register an user", (done) => {
            console.log(user1);
            chai.request(server)                
                .post("/clients/register")
                .send(user1)
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
    });


    describe("POST /users/authenticate", () => {
        it("It should finde user", (done) => {

            chai.request(server)
                .post("/users/authenticate")
                .send({ username: user1.username,
                        password: user1.password})
                .end((err, response) => {
                    response.body.should.have.property('username').eq(user1.username);
                    response.body.should.have.property('password').eq(user1.password);
                done();
                });
        });

    });

});


