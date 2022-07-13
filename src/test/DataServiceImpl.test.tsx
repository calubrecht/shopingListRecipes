import {DataServiceImpl} from '../DataServiceImpl';
import {RecipeData} from '../DataService';
import APIConstants from '../APIConstants.js';


const wait = () => new Promise(resolve => setTimeout(resolve));

const baseReq = '/app/api/v1';
jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {},
  consts: {'apiServer':baseReq, 'apiPort':5000}
}));
/*
beforeEach(() => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});
*/
test('DataService getRecipes', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:1, name:'blue'}]} ),
    ok: true
  }));

  let callback = jest.fn(() => {});
  //document.cookie  = 'XSRF-TOKEN=clarence';
  svc.getRecipes('a', 'b').then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": 1, "name": "blue"}]);
});
