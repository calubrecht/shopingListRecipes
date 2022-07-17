import  React from 'react';
import renderer from 'react-test-renderer';
import {RecipeGrid} from '../RecipeGrid';
import {RecipeData} from '../DataService';
import {RecipeCard} from '../RecipeCard';
import {MuuriComponent, muuriMap} from 'muuri-react';
import APIConstants from '../APIConstants.js';

jest.mock('../RecipeCard', () =>  ({
  RecipeCard: (props) => {
  return <div className="recipeCard">{props.recipeData.name}</div>;}
}));


jest.mock('muuri-react', () => {
  let grid = {refreshItems: jest.fn(() => {}), layout: jest.fn(() => {}),
    getItems: () => [
      {getElement: () => ({children: [{children: [{id:'id_soup'}]}]})},
      {getElement: () => ({children: [{children: [{id:'id_nuts'}]}]})}
    ]
  };
  let control = {block: false};
  function getGrid()
  {
    if (control.block)
    {
      return null;
    }
    return grid;
  }

  return{
  MuuriComponent: (props) => {
    return <div >{props.children}</div>;
  },
    muuriMap: {get: () => getGrid(), blockG: () => {control.block = true;}, restoreG: () => {control.block = false}}
}; });

jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {}
}));

test('Display Grid', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  expect(component.root.findAllByType(RecipeCard).length).toBe(2);
  expect(component.root.findAllByType(RecipeCard)[0].children[0].children[0]).toBe('Good recipe');
});

test('Display Empty Grid', () => {
  let recipes = [];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  expect(component.root.findAllByType("button").length).toBe(1);
});

test('Add recipe to Empty', () => {
  let recipes = [];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  component.root.findAllByType("button")[0].props.onClick();
  expect(component.root.findAllByType(RecipeCard).length).toBe(1);
  expect(component.root.findAllByType(RecipeCard)[0]._fiber.key).toBe("THE_NEW_RECIPE");
});

test('Add recipe', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  component.root.findAllByType("button")[0].props.onClick();
  expect(component.root.findAllByType(RecipeCard).length).toBe(3);
  expect(component.root.findAllByType(RecipeCard)[0]._fiber.key).toBe("keyID1");
  expect(component.root.findAllByType(RecipeCard)[2]._fiber.key).toBe("THE_NEW_RECIPE");
});

test('Drag', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  let dragFnc = component.root.instance.gridOptions.dragStartPredicate;

  expect(dragFnc('blue', {target:{className:'nonItem'}}, {})).toBe(false);
  let item = {'_drag':{'_startPredicateData':{handleElement:true}, '_resolveStartPredicate': () => true}};
  expect(dragFnc(item, {target:{className:'cardTitle'}}, {})).toBe(true);
});

test('Respond to cancel new recipe', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes}  />);

  component.root.findAllByType("button")[0].props.onClick();
  component.root.instance.cancelNew();
  expect(component.root.findAllByType(RecipeCard).length).toBe(2);
});

test('Respond to cancel add recipe', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let addRecipe = jest.fn(() => {});
  let component = renderer.create(
     <RecipeGrid recipes={recipes} addRecipe={addRecipe} />);

  component.root.instance.addRecipe({name: 'new Recipe'});
  expect(addRecipe.mock.calls.length).toBe(1);
  expect(addRecipe.mock.calls[0][0].name).toBe('new Recipe');
});

test('Respond to select recipe', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let selectCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeGrid recipes={recipes} />);

  component.root.instance.selectRecipe('Goodedr recipe');
  expect(selectCB.mock.calls.length).toBe(0);

  APIConstants.EXT_CALLBACK_REGISTRY['setSelectCB'](selectCB);
  component.root.instance.selectRecipe('Goodedr recipe');
  expect(selectCB.mock.calls.length).toBe(1);
  expect(selectCB.mock.calls[0][0]).toBe('Goodedr recipe');
});

test('Respond to resize', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let selectCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeGrid recipes={recipes} />);

  let oldRefreshCnt = component.root.instance.getGrid().refreshItems.mock.calls.length;
  let oldLayoutCnt = component.root.instance.getGrid().layout.mock.calls.length;
  component.root.instance.onResize('');
  
  expect(component.root.instance.getGrid().refreshItems.mock.calls.length).toBe(oldRefreshCnt + 1);
  expect(component.root.instance.getGrid().layout.mock.calls.length).toBe(oldLayoutCnt + 1);
});

test('Respond to refresh', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let fetchCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeGrid recipes={recipes} fetchRecipes={fetchCB}/>);

  let refreshFn = muuriMap.get().refreshItems;
  let layoutFn = muuriMap.get().layout;
  let oldRefreshCnt = refreshFn.mock.calls.length;
  let oldLayoutCnt = layoutFn.mock.calls.length;
  muuriMap.blockG();
  component.root.instance.refreshGrid();
  expect(refreshFn.mock.calls.length).toBe(oldRefreshCnt);
  expect(layoutFn.mock.calls.length).toBe(oldLayoutCnt);
  expect(fetchCB.mock.calls.length).toBe(1);

  muuriMap.restoreG();
  component.root.instance.refreshGrid();
  expect(refreshFn.mock.calls.length).toBe(oldRefreshCnt + 1);
  expect(layoutFn.mock.calls.length).toBe(oldLayoutCnt +1);
  expect(fetchCB.mock.calls.length).toBe(2);
});

test('set Query Mode', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes} />);

  component.root.instance.state.selectedItems ={'george':true};
  component.root.instance.setQueryMode(true);

  expect(component.root.instance.state.queryMode).toBe(true);
  expect(component.root.instance.state.selectedItems).toStrictEqual({});
});

test('id from grid element', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes} />);

  component.root.instance.state.selectedItems ={'george':true};
  component.root.instance.setQueryMode(true);

  let element = {children: [{children: [{id:5}]}]};
  expect(component.root.instance.idFromGridElement(element)).toBe(5);
});

test('store sort order', () => {
  let service = { setOrder: jest.fn(() => {})};
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
     <RecipeGrid recipes={recipes} service={service} />);

 
  let element = muuriMap.get().getItems()[0];
  component.root.instance.storeSortOrder();

  expect(service.setOrder.mock.calls.length).toBe(1);
  expect(service.setOrder.mock.calls[0][0]).toStrictEqual(['soup', 'nuts']);
});
