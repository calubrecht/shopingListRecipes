import {MockDataService} from '../MockDataService';
import {RecipeData} from '../DataService';


const wait = () => new Promise(resolve => setTimeout(resolve));

const baseReq = '/app/api/v1';
/*jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {},
  consts: {'apiServer':baseReq, 'apiPort':5000}
}));*/


test('MockDataService getRecipes', async () => {
  let svc = new MockDataService();

  let callback = jest.fn(() => {});
  svc.getRecipes().then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].length).toBe(5);
  expect(callback.mock.calls[0][0][0]).toMatchObject({"id": "0", "name": "Good Recipe", text: "This is a recipe"});

  expect(svc.getNameForIDNum('2')).toBe('Awesomesauce Recipe');
  expect(svc.getNameForIDNum('1r3')).toBe('');
});

test('MockDataService deleteRecipe', async () => {
  let svc = new MockDataService();

  let callback = jest.fn(() => {});
  svc.deleteRecipe('Bad Recipe').then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].length).toBe(4);
});

test('MockDataService editRecipe', async () => {
  let svc = new MockDataService();
  let recipe = {name: 'Jerked Jerky', id:5, text:"Bad jerkey"};
  let callback = jest.fn(() => {});
  svc.editRecipe('Jerked Jerky', recipe).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0][4]).toMatchObject({"id": 5, "name": "Jerked Jerky", "text":"Bad jerkey"});
});

test('MockDataService addRecipe', async () => {
  let svc = new MockDataService();

  let callback = jest.fn(() => {});
  let recipe = {name: 'worky Jerky', text:"Badder jerkey"};
  svc.addRecipe('worky Jerky', recipe).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0][5]).toMatchObject({"id": "5", "name": "worky Jerky", "text":"Badder jerkey"});
});

test('MockDataService setOrder', async () => {
  let svc = new MockDataService();
  let callback = jest.fn(() => {});
  
  svc.setOrder(['Bad Recipe', 'Good Recipe', 'Better Recipe', 'Awesomesauce Recipe', 'Jerked Jerky']).then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  // Set Order in MockDataService ain't do squat 

  callback = jest.fn(() => {});
  svc.getRecipes().then(callback);

  await wait();

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0][0].length).toBe(5);
  // Order didn't chagne because setOrder is no-op
  expect(callback.mock.calls[0][0][0].name).toBe("Good Recipe");
});
/*
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
/*
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
}); */
