const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function () {
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "ty@ty.com",
        password: "tester",
      },
    };

    AuthController.login(req, {}, () => {})
      .then((result) => {
        //   console.log(result);
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        // expect(result).to.have.property("statusCode", 401); //to tigger error
        done(); //will signal to mocha to wait for this code to finish to execute
      })
      .catch(done);

    User.findOne.restore();
  });

  //will use a dedicated database instead of stubs
  it("should send a response with a valid user status for an existing user", function (done) {
    //connect to test dataabse
    mongoose
      .connect("mongodb://localhost:27017/nodetestDB", { useUnifiedTopology: true })
      .then((result) => {
        //Define testing logic
        const user = new User({
          email: "ty@ty.com",
          password: "tester",
          name: "taibu",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        const req = { userId: "5c0f66b979af55031b34728a" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal("I am new!");
          //Clean up
          User.deleteMany({})
            .then(() => {
              return mongoose.disconnect();
            })
            .then(() => {
              done();
            });
        });
      })
      .catch((err) => console.log(err));
  });
});
