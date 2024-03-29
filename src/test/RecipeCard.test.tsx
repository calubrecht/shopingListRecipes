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
  let addCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={true} selectRecipe= {() => {}} editRecipe= {() => {}} cancelNew = {cancelCB} addRecipe = {addCB}/>);


  expect(component.root.findAllByProps({className:"name"}).length).toBe(1);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(0);
  expect(component.root.findAllByProps({className:"name"})[0].props.placeholder).toBe('Enter a new recipe name.');
  expect(component.root.findAllByProps({className:"name"})[0].props.value).toBeUndefined();
  expect(component.root.findAllByType('input').length).toBe(3);
  
  component.root.findAllByProps({className:"cancelBtn"})[0].props.onClick();
  expect(cancelCB.mock.calls.length).toBe(1);

  // reenable edit
  component.root.instance.doEdit();
  // If no name, save does nothing
  component.root.findAllByProps({className:"confirmBtn"})[0].props.onClick();
  expect(addCB.mock.calls.length).toBe(0);

  // reenable edit
  component.root.instance.doEdit();
  // Change data
  let changeEvt = {target: {name: 'name', value: 'A good name'}};
  component.root.findAllByProps({className:"name"})[0].props.onChange(changeEvt);
  component.root.findAllByProps({className:"confirmBtn"})[0].props.onClick();
  expect(addCB.mock.calls.length).toBe(1);
  expect(addCB.mock.calls[0][0].name).toBe('A good name');
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
  let editCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={false} selectRecipe= {() => {}} editRecipe= {editCB} cancelNew = {() => {}} />);
  
  expect(component.root.findAllByProps({className:"name"}).length).toBe(0);
  expect(component.root.findAllByType(DeleteWidget).length).toBe(1);

  component.root.findAllByProps({className:"editBtn"})[0].children[0].props.onClick();
  expect(component.root.findAllByType('input').length).toBe(7);
  
  // reenable edit
  component.root.instance.doEdit();
  // Change data
  let changeEvt = {target: {name: 'text', value: 'Good Stuff'}};
  component.root.findAllByProps({className:"description"})[0].props.onChange(changeEvt);
  let listChangeEvt = {target: {name: 'key0', value: 'Bacon'}};
  component.root.findAllByProps({className:"keyIngredients"})[0].props.onChange(listChangeEvt);
  component.root.findAllByProps({className:"confirmBtn"})[0].props.onClick();
  expect(editCB.mock.calls[0][0].text).toBe('Good Stuff');
  expect(editCB.mock.calls[0][0].keyIngredients[0]).toBe('Bacon');

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

test('Cancel Edit KB', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let resizeCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);

  component.root.findAllByProps({className:"editBtn"})[0].children[0].props.onClick();
  let keyEvt = { key:"Enter", stopPropagation: () => {}, preventDefault: () => {} }
  component.root.findByProps({className:"recipeCard editing"}).props.onKeyDown(keyEvt);
  expect(component.root.findAllByType('input').length).toBe(7);
  keyEvt = { key:"Escape", stopPropagation: () => {}, preventDefault: () => {} }
  component.root.findByProps({className:"recipeCard editing"}).props.onKeyDown(keyEvt);
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

test('Test resizes', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: ['4','5']};
  let resizeCB = jest.fn(() => {});
  let component =  renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);

  // If missing style height, set style height and resize()
  let ta = {style:{}, scrollHeight:'1'};
  component.root.instance.textAreaElement = ta;
  component.update(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);
  expect(ta.style.height).toBe('1px');
  expect(resizeCB.mock.calls.length).toBe(1);

  // If style.height doesn't match scholl height, set height and resize
  ta.style.height = '2px';
  component.update(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);
  expect(ta.style.height).toBe('1px');
  expect(resizeCB.mock.calls.length).toBe(2);
  
  // If match, don't resize
  component.update(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={ () => {} } onResize= {resizeCB} newRecipe={false} selectRecipe= {() => {}} editRecipe= {() => {}} />);
  expect(ta.style.height).toBe('1px');
  expect(resizeCB.mock.calls.length).toBe(2);
});

test('Display QueryMode without select', () => {
  let recipeData = {id:'ID1', text: 'All the good stuff'};
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={true} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={false}  editRecipe= {() => {}} />);

  component.root.findAllByProps({className:"selectBtn"})[0].children[0].props.onClick();
});

test('Test handle edit list', () => {

  let recipeData = {name: 'Good recipe', id:'ID1', text: 'All the good stuff', keyIngredients: ['1','2','3'], commonIngredients: null}
  let editCB = jest.fn(() => {});
  let component = renderer.create(
     <RecipeCard recipeData={recipeData} queryMode={false} selected={false} onDelete={() => {}} onResize= {() => {}} newRecipe={false} selectRecipe= {() => {}} editRecipe= {editCB} cancelNew = {() => {}} />);

  let editList = component.root.instance.handleChangeList;

  // key ingredients changes key ingredients
  let changeEvent = {target: {name: 'key1', value:'butter'}};
  editList(changeEvent);
  expect(component.root.instance.state.recipeData.keyIngredients[1]).toBe('butter');
  expect(component.root.instance.state.recipeData.keyIngredients.length).toBe(3);

  // Add new key ingredient
  changeEvent = {target: {name: 'key3', value:'cake'}};
  editList(changeEvent);
  expect(component.root.instance.state.recipeData.keyIngredients[3]).toBe('cake');
  expect(component.root.instance.state.recipeData.keyIngredients.length).toBe(4);
  
  // Erase ingredient
  changeEvent = {target: {name: 'key2', value:''}};
  editList(changeEvent);
  expect(component.root.instance.state.recipeData.keyIngredients[2]).toBe('cake');
  expect(component.root.instance.state.recipeData.keyIngredients.length).toBe(3);
 
  // blanking last value does nothing
  changeEvent = {target: {name: 'key4', value:''}};
  editList(changeEvent);
  expect(component.root.instance.state.recipeData.keyIngredients[2]).toBe('cake');
  expect(component.root.instance.state.recipeData.keyIngredients.length).toBe(3);
  
  // Add common ingredient
  changeEvent = {target: {name: 'common0', value:'heat'}};
  editList(changeEvent);
  expect(component.root.instance.state.recipeData.commonIngredients[0]).toBe('heat');
  expect(component.root.instance.state.recipeData.commonIngredients.length).toBe(1);
});
