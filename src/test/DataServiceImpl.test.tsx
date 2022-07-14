import {DataServiceImpl} from '../DataServiceImpl';
import {RecipeData} from '../DataService';
import APIConstants from '../APIConstants.js';


const wait = () => new Promise(resolve => setTimeout(resolve));

const baseReq = '/app/api/v1';
jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {},
  consts: {'apiServer':baseReq, 'apiPort':5000}
}));

beforeEach(() => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});


test('DataService getRecipes', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:'1', name:'blue'}]} ),
    ok: true
  }));

  let callback = jest.fn(() => {});
  svc.getRecipes().then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"getRecipes\"}");
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": "1", "name": "blue"}]);

  expect(svc.getNameForIDNum('1')).toBe('blue');
  expect(svc.getNameForIDNum('2')).toBe('');
});

test('DataService deleteRecipe', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:1, name:'blue'}]} ),
    ok: true
  }));

  let callback = jest.fn(() => {});
  svc.deleteRecipe('franksAndBeans').then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"deleteRecipe\",\"recipe\":\"franksAndBeans\"}");
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": 1, "name": "blue"}]);
});

test('DataService editRecipe', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:1, name:'blue'}]} ),
    ok: true
  }));

  let callback = jest.fn(() => {});
  let recipe = {name: 'name', id:5};
  svc.editRecipe('name', recipe).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"editRecipe\",\"recipe\":{\"name\":\"name\",\"id\":5}}");
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": 1, "name": "blue"}]);
});

test('DataService addRecipe', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:1, name:'blue'}]} ),
    ok: true
  }));

  let callback = jest.fn(() => {});
  let recipe = {name: 'name', id:5};
  svc.addRecipe('name', recipe).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"addRecipe\",\"recipe\":{\"name\":\"name\",\"id\":5}}");
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": 1, "name": "blue"}]);
});

test('DataService setOrder', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true
  }));

  let callback = jest.fn(() => {});
  svc.setOrder(['item1', 'item2', 'item3']).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"setOrder\",\"orderedItems\":[\"item1\",\"item2\",\"item3\"]}");
});

test('DataService handleError', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    statusText: 'This is an error',
    ok: false
  }));

  let callback = jest.fn(() => {});
  svc.setOrder(['item1', 'item2', 'item3']).catch(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].toString()).toBe('Error: This is an error');
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].method).toBe('post');
  expect(global.fetch.mock.calls[0][1].body).toBe("{\"action\":\"setOrder\",\"orderedItems\":[\"item1\",\"item2\",\"item3\"]}");
});

test('DataService loggedOut', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: false}),
    ok: true
  }));

  let callback = jest.fn(() => {});
  svc.getRecipes().catch(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].toString()).toBe('Error: Please log in again.');
});

test('DataService server error', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, error:'Woof'}),
    ok: true
  }));

  let callback = jest.fn(() => {});
  svc.getRecipes().catch(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].toString()).toBe('Error: Woof');
});

test('DataService xsrf', async () => {
  let svc = new DataServiceImpl();
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({isLoggedIn: true, recipes: [{id:'1', name:'blue'}]} ),
    ok: true
  }));
  document.cookie  = 'XSRF_TOKEN=clarence';

  let callback = jest.fn(() => {});
  svc.getRecipes().then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(global.fetch.mock.calls[0][0]).toBe(baseReq+'/service/');
  expect(global.fetch.mock.calls[0][1].headers['x-xsrf-token']).toBe('clarence');
  expect(callback.mock.calls[0][0]).toMatchObject([{"id": "1", "name": "blue"}]);

  expect(svc.getNameForIDNum('1')).toBe('blue');
});
