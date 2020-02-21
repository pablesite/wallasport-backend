const request = require('supertest');
require('dotenv').config();


describe('endpoints express', function () {
  const server = require('./app');


  it('responds to /apiv1/register with 500 because user exist', async (done) => {

    const res = await request(server)
    .post('/apiv1/register')
    .send({username: 'pablesite', email: 'pablo.ruiz.molina@gmail.com', password: '1234'})
    expect(res.status).toBe(500)
  
    done()
  });


  it('responds to /apiv1/login with auth', async (done) => {

    const res = await request(server)
    .post('/apiv1/login')
    .send({username: 'pablesite', email: 'pablo.ruiz.molina@gmail.com', password: '1234'})
    expect(res.status).toBe(200)
  
    done()
  });

  it('responds to /apiv1/login without auth', async (done) => {

    const res = await request(server)
    .post('/apiv1/login')
    .send({username: 'test', password: 'NA'})
    expect(res.status).toBe(200) //return false
  
    done()
  });


  it('responds to /apiv1/adverts', async (done) => {

    const res = await request(server).get('/apiv1/adverts')

    expect(res.status).toBe(200)
  
    done()
  });

  
  it('responds to /apiv1/tags', async (done) => {

    const res = await request(server).get('/apiv1/tags')

    expect(res.status).toBe(200)
  
    done()
  });


    it('404 everything else', function testPath(done) {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
    });


});

