const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function(){
    test('Should create an issue with every field', function(done){
        chai
          .request(server)
          .post("/api/issues/apitest")
          .send({
            issue_title: 'My_Title',
            issue_text: 'My_text',
            created_by: 'Darell',
            assigned_to: 'Robert',
            status_text: 'In QA'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'My_Title');
            assert.equal(res.body.issue_text, 'My_text');
            assert.equal(res.body.created_by, 'Darell');
            assert.equal(res.body.assigned_to, 'Robert');
            assert.equal(res.body.status_text, 'In QA');
            done();
          });
    });
    test("should create an issue with only required fields", function(done){
        chai
          .request(server)
          .post("/api/issues/apitest")
          .send({
            issue_title: 'My_Title',
            issue_text: 'My_Text',
            created_by: 'Darell'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'My_Title');
            assert.equal(res.body.issue_text, 'My_Text');
            assert.equal(res.body.created_by, 'Darell');
            done();
          })
    });
    test("should create an issue with missing required fields", function(done){
        chai
          .request(server)
          .post("/api/issues/apitest")
          .send({
            assigned_to: 'Robert',
            status_text: 'In QA'
          })
          .end(function(err, res){
            console.log(res.bo)
            assert.strictEqual(res.status, 400);
            assert.equal(typeof res.body.issue_title, "undefined")
            assert.equal(typeof res.body.issue_text, "undefined");
            assert.equal(typeof res.body.created_by, "undefined");
            done();
          })
    });
  });

  suite("GET /api/issues/{project} =>object with issue data", function(){
    test("View issues on a project", function(done){
        chai
          .request(server)
          .get("/api/issues/apitest")
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.instanceOf(res.body, Array);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], '_id');
            done();
          });
    });
    test("View issues on a project with one filter", function(done){
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({issue_title: "My_Title"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.instanceOf(res.body, Array);
            assert.equal(res.body[0].issue_title, "My_Title");
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], '_id');
            done();
          })
    });
    test("View issues on a project with multiple filters(data that exists in db)", function(done){
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({
            issue_title: "My_Title", 
            issue_text: "My_Text",
            created_by: "Darell"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.instanceOf(res.body, Array);
            assert.equal(res.body[0].issue_title, "My_Title");
            assert.equal(res.body[0].issue_text, "My_Text");
            assert.equal(res.body[0].created_by, "Darell");
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], '_id');
            done();
          })
    });
  });
  suite(" PUT request to /api/issues/{project} => object with issue data", function(){
    test("Update one field on an issue", function(done){
        chai.request(server)
        .put("/api/issues/apitest")
        .send({_id:"648da8f3d9e9cd7ad907faae", assigned_to: "Morgan"})
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "648da8f3d9e9cd7ad907faae");
            done();
        })
    });
    test("Update multiple fields on an issue", function(done){
        chai.request(server)
        .put("/api/issues/apitest")
        .send({
            _id:"648da8f3d9e9cd7ad907faae",
            open: false,
            status_text: "Planning"
        })
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "648da8f3d9e9cd7ad907faae");
            done();
        })
    });
    test("Update an issue with missing _id", function(done){
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            open: false,
            status_text: "Planning"
          })
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "missing _id");
            done();
          })
    });
    test("Update an issue with no fields to update", function(done){
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "648da8f3d9e9cd7ad907faae"
          })
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "no update field(s) sent");
            assert.equal(res.body._id, "648da8f3d9e9cd7ad907faae");
            done();
          })
    });
    test("Update an issue with an invalid _id", function(done){
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id:"648da8f3d9e9cd7ad907faad",
            open: true,
            status_text: "Planning"
        })
        .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'could not update');
            assert.equal(res.body._id, "648da8f3d9e9cd7ad907faad");
            done();
        })
    })
  });
  suite("DELETE /api/issues/{project} => with object of missing id", function(){
    test("Delete an issue with missing _id", function(done){
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "missing _id");
            done();
          });
    });
    test("Delete an issue with an invalid _id", function(done){
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({_id: "64chamf3d9e9cd7ad907fwwe"})
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "could not delete");
            assert.equal(res.body._id, "64chamf3d9e9cd7ad907fwwe");
            done();
          });
    });
    test("Delete an issue with an invalid _id", function(done){
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({_id: "648e061130aa811ade84195e"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            assert.equal(res.body._id, "648e061130aa811ade84195e");
            done();
          });
    });
  });
});
