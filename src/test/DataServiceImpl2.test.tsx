import {DataServiceImpl} from '../DataServiceImpl';
import {RecipeData} from '../DataService';
import APIConstants from '../APIConstants.js';


const wait = () => new Promise(resolve => setTimeout(resolve));

const baseReq = '/app/api/v1';
jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {},
  consts: {'apiServer':null, 'apiPort':5000}
}));


test('DataService Weirdness', async () => {
  window.location = 'localhost';
  window.protocol = 'http';
  let svc = new DataServiceImpl();

  expect(svc.apiServer).toBe('http://localhost:5000');
});
