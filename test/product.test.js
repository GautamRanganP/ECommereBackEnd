const request = require('supertest');
const {expect} = require('expect');

const app = require('../app');

describe('Testing POST Request /createproduct endpoint', () => {
  it('respond with valid HTTP status code and description and message', async () => { 
    const response = await request(app)
      .post('/createproduct')
      .send({
        title:"Mens Cotton Jacket",
        price:55.99,
        description:"great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
        category:"men's clothing",
        image:"https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Product Added Successfully');
  });
});