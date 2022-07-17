import  React from 'react';
import renderer from 'react-test-renderer';
import {App, setMock} from '../App';
import APIConstants from '../APIConstants.js';

jest.mock('../RecipeGrid', () =>  ({
  RecipeGrid: (props) => {
  return <div className="recipeGrid">Recipe Grid</div>;}
}));

jest.mock('../DataServiceImpl', () =>  ({
  DataServiceImpl:  class {
    getRecipes() { return Promise.reject({message:'Oops all berries'}) }
  }
}));

jest.mock('../CacheBuster', () =>  ({
  CacheBuster: (props) => {
  return <div className="cb">CB</div>;}
}));
jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {},
  consts: {isMock:true}
}));

const wait = () => new Promise(resolve => setTimeout(resolve));

beforeEach(() =>
  {
    setMock(true);
  });

test('Display App', async () => {

  let component = renderer.create(
     <App />);

  expect(component.root.findAllByProps({className:'recipeGrid'}).length).toBe(1);
  expect(component.root.findAllByProps({className:'cb'}).length).toBe(1);
  await wait();
  expect(component.root.children[0].children[1].children[0]).toBe("");


  setMock(false);
  // without mock
  component = renderer.create(
     <App />);
  await wait();
  expect(component.root.findAllByProps({className:'recipeGrid'}).length).toBe(1);
  expect(component.root.findAllByProps({className:'cb'}).length).toBe(1);
  expect(component.root.findAllByProps({className:'cb'}).length).toBe(1);
  expect(component.root.children[0].children[1].children[0]).toBe("Oops all berries");
  setMock(true);
});

test('Update state from published props', () => {

  let component = renderer.create(
     <App />);

  component.root.instance.reportError({message:'The problem with You'});
  expect(component.root.instance.state.error).toBe('The problem with You');
  let newRecipes = [{name:'Franks'},{name:'Beans'}];
  component.root.instance.updateRecipes(newRecipes);
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Franks'},{name:'Beans'}]);
  expect(component.root.instance.state.error).toBe('');
});

test('Delete recipe', async () => {

  let component = renderer.create(
     <App />);

  await wait();
  component.root.instance.service = {deleteRecipe: () => Promise.resolve([{name:'Bojo'}])};
  component.root.instance.deleteRecipe('Jaba');
  await wait();
  // If delete not deleting existing recipe, do nothing
  expect(component.root.instance.state.recipes.length).toBe(5);
  expect(component.root.instance.state.error).toBe('');

  component.root.instance.deleteRecipe('Good Recipe');
  await wait();
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Bojo'}]);
  expect(component.root.instance.state.error).toBe('');
  
  component.root.instance.service = {deleteRecipe: () => Promise.reject({message:'I hate you'})};
  component.root.instance.deleteRecipe('Bojo');
  await wait();
  expect(component.root.instance.state.recipes).toStrictEqual([]);
  expect(component.root.instance.state.error).toBe('I hate you');

});

test('Add recipe', async () => {

  let component = renderer.create(
     <App />);

  await wait();
  expect(component.root.instance.state.recipes.length).toBe(5);
  component.root.instance.service = {addRecipe: () => Promise.resolve([{name:'Bojo'}])};
  component.root.instance.addRecipe({name:'Jaba'});
  await wait();
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Bojo'}]);
  expect(component.root.instance.state.error).toBe('');
 
  // handle error
  component.root.instance.service = {addRecipe: () => Promise.reject({message:'What?'})};
  component.root.instance.addRecipe({name:'Jabba'});
  await wait();
  // Functino adds locally before api call
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Bojo'}, {name:'Jabba'}]);
  expect(component.root.instance.state.error).toBe('What?');

});

test('Edit recipe', async () => {

  let component = renderer.create(
     <App />);

  await wait();
  component.root.instance.service = {editRecipe: () => Promise.resolve([{name:'Bojo'}])};
  component.root.instance.editRecipe({name:"Better Recipe", text:"Made for the better"});
  await wait();
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Bojo'}]);
  expect(component.root.instance.state.error).toBe('');
 
  // handle error
  component.root.instance.service = {editRecipe: () => Promise.reject({message:'What?'})};
  component.root.instance.editRecipe({name:"Bojo", text:"Made for the better"});
  await wait();
  // Functino adds locally before api call
  expect(component.root.instance.state.recipes).toStrictEqual([{name:'Bojo', text:'Made for the better'}]);
  expect(component.root.instance.state.error).toBe('What?');

});
