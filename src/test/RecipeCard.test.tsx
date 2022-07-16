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
  let cancelCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={true} selectRecipe= {() => {}} editRecipe= {() => {}} cancelNew = {cancelCB} />);


  expect(component.root.findAllByProps({className:"name"}).length).toBe(1);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(0);
  expect(component.root.findAllByProps({className:"name"})[0].props.placeholder).toBe('Enter a new recipe name.');
  expect(component.root.findAllByProps({className:"name"})[0].props.value).toBeUndefined();
  expect(component.root.findAllByType('input').length).toBe(3);
  

});

test('Display QueryMode', () => {
  let recipeData = {id:'ID1', text: 'All the good stuff'};
  let selectCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={true} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={false} selectRecipe= { selectCB } editRecipe= {() => {}} />);

  expect(component.root.findAllByProps({className:"editBtn"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"selectBtn"}).length).toBe(1);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(0);
  expect(component.root.findAllByProps({className:"cardTitle"}).length).toBe(1);
  expect(component.root.findAllByProps({className:"selectBtn"})[0].children[0].props.src).toBe("sl_icons/checkOff.png");
  
  component.root.findAllByProps({className:"selectBtn"})[0].children[0].props.onClick();
  expect(selectCB.mock.calls.length).toBe(1);
  
  component.update(
     <RecipeCard recipeData={recipeData} queryMode={true} selected={true} onDelete={() => {}} onResize= {() => {}} newRecipe={false} selectRecipe= { selectCB } editRecipe= {() => {}} />);
  expect(component.root.findAllByProps({className:"selectBtn"})[0].children[0].props.src).toBe("sl_icons/check.png");

});

test('Edit Card', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let component = renderer.create(
    <WrapperComponent recipeData={recipeData} />
  );
  
  expect(component.root.findAllByProps({className:"name"}).length).toBe(0);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(1);

  component.root.findAllByProps({className:"editBtn"})[0].children[0].props.onClick();
  expect(component.root.findAllByType('input').length).toBe(7);

});

test('Cancel Edit Card', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let resizeCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);
  
  expect(component.root.findAllByProps({className:"name"}).length).toBe(0);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(1);

  component.root.findAllByProps({className:"editBtn"})[0].children[0].props.onClick();
  expect(component.root.findAllByType('input').length).toBe(7);
  component.root.findAllByProps({className:"cancelBtn"})[0].props.onClick();
  expect(component.root.findAllByType('input').length).toBe(0);
  expect(resizeCB.mock.calls.length).toBe(1);

});

test('Delete Card', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let deleteCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={deleteCB } onResize= {() => {}} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);
  
  component.root.findAllByType(DeleteWidget)[0].props.onDelete();

  expect(deleteCB.mock.calls.length).toBe(1);

});
