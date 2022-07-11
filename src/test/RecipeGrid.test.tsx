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
