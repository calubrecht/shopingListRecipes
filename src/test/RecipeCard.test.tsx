import  React from 'react';
import renderer from 'react-test-renderer';
import {RecipeCard} from '../RecipeCard';
import {RecipeData} from '../DataService';
import {DeleteWidget} from '../DeleteWidget';

interface WrapperProps
{
  recipeData : RecipeData
}

class WrapperComponent extends React.Component
{
    constructor(props: WrapperProps)
    {
      super(props);
    }

    render()
    {
      return <RecipeCard recipeData={this.props.recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />;
    }
}


test('Display Card', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let component = renderer.create(
    <WrapperComponent recipeData={recipeData} />
  );
  
  expect(component.root.findAllByProps({className:"name"}).length).toBe(0);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(1);
  expect(component.root.findAllByProps({className:"cardTitle"}).length).toBe(1);

});

test('Display Card as new', () => {
  let recipeData = {id:'ID1', text: 'All the good stuff'};
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={true} selectRecipe= {() => {}} editRecipe= {() => {}} />);


  expect(component.root.findAllByProps({className:"name"}).length).toBe(1);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(0);
  expect(component.root.findAllByProps({className:"name"})[0].props.placeholder).toBe('Enter a new recipe name.');
  expect(component.root.findAllByProps({className:"name"})[0].props.value).toBeUndefined();
  expect(component.root.findAllByType('input').length).toBe(3);

});
