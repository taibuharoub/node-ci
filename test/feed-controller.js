const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
  before(function (done) {
    //connect to test dataabse
    mongoose
      .connect("mongodb://localhost:27017/nodetestDB", {
        useUnifiedTopology: true,
      })
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
        done();
      });
  });

  it("should add a created post to the posts of the creater", function (done) {
    
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
          path: "some url"
      },
      userId: "5c0f66b979af55031b34728a"
    };

    const res = {
        status: function() { return this; },
        json: function() {}
    };

    FeedController.createPost(req, res, () => {})
      .then((savedUser) => {
        //   console.log(result);
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch(done);

  });

  after(function (done) {
    //Clean up
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
