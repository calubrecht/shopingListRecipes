import  React from 'react';
import renderer from 'react-test-renderer';
import {RecipeGrid} from '../RecipeGrid';
import {RecipeData} from '../DataService';
import {RecipeCard} from '../RecipeCard';
import {MuuriComponent, muuriMap} from 'muuri-react';

class WrapperComponent extends React.Component
{
    constructor(props: WrapperProps)
    {
      super(props);
    }

    render()
    {
      return <RecipeGrid recipes={this.props.recipes} service={this.props.service}  />
    }
}

jest.mock('../RecipeCard', () =>  ({
  RecipeCard: (props) => {
  return <div className="recipeCard">{props.recipeData.name}</div>;}
}));

jest.mock('muuri-react', () => ({
  MuuriComponent: (props) => {
    return <div >{props.children}</div>;
  },
  muuriMap: {}
}));

jest.mock('../APIConstants.js', () => ( {
  EXT_CALLBACK_REGISTRY: {}
}));

test('Display Grid', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
    <WrapperComponent recipes={recipes} />
  );

  expect(component.root.findAllByType(RecipeCard).length).toBe(2);
  expect(component.root.findAllByType(RecipeCard)[0].children[0].children[0]).toBe('Good recipe');
});

test('Display Empty Grid', () => {
  let recipes = [];
  let component = renderer.create(
    <WrapperComponent recipes={recipes} />
  );

  expect(component.root.findAllByType("button").length).toBe(1);
});

test('Add recipe to Empty', () => {
  let recipes = [];
  let component = renderer.create(
    <WrapperComponent recipes={recipes} />
  );

  component.root.findAllByType("button")[0].props.onClick();
  expect(component.root.findAllByType(RecipeCard).length).toBe(1);
  expect(component.root.findAllByType(RecipeCard)[0]._fiber.key).toBe("THE_NEW_RECIPE");
});

test('Add recipe', () => {
  let recipes = [{name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']},
  {name: 'Goodedr recipe', id:'ID2', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']}];
  let component = renderer.create(
    <WrapperComponent recipes={recipes} />
  );

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
