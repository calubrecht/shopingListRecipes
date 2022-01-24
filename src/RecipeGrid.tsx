import React, { Component } from 'react';
import {RecipeCard} from './RecipeCard';
import {MuuriComponent, muuriMap} from 'muuri-react';
import {RecipeData} from './DataService';
import * as APIConstants from './APIConstants.js';
import * as utils from './utils';
import {DataService} from './DataService';

interface GridProps {
  recipes: RecipeData[],
  deleteRecipeFromSvr(recipeName : string) : void
  editRecipe(recipe: RecipeData) : void
  addRecipe(recipe: RecipeData) : void
  fetchRecipes() : void
  service : DataService
}


interface GridState {
  addingRecipe: boolean
  queryMode: boolean
  selectedItems: { [key:string]: boolean;}
  selectCB?(cb : string) : void
}
export class RecipeGrid extends Component<GridProps, GridState> {
  gridElement : any;
  gridOptions : any;


  constructor(props : GridProps) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.cancelNew = this.cancelNew.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.selectRecipe = this.selectRecipe.bind(this);
    this.storeSortOrder = this.storeSortOrder.bind(this);
    this.state = {addingRecipe: false, queryMode: false, selectedItems:{}};
    APIConstants.EXT_CALLBACK_REGISTRY['refreshRecipeGrid'] =  this.refreshGrid.bind(this);
    APIConstants.EXT_CALLBACK_REGISTRY['setQueryMode'] =  this.setQueryMode.bind(this);
    APIConstants.EXT_CALLBACK_REGISTRY['setSelectCB'] =(cb : any) => this.setState({selectCB: cb});
    this.gridOptions = {
            id: 'THEGRID',
            dragEnabled: true,
            onDragEnd: this.storeSortOrder,
            dragStartPredicate: function (item : any, e : any, options:any)
            {
              if (e.target.className === 'cardTitle')
              {
                return utils.defaultStartPredicate(item, e, options);
              }
              return false;
            }};
  }
  
  render() {
    if (this.props.recipes.length === 0)
    {
      return <div>
        <h1>Your Recipes</h1>
        {this.state.addingRecipe || this.state.queryMode ||
            <button onClick={e => this.setState({addingRecipe:true})}>Add Recipe</button>}
      </div>;
    }
    return (
      <div>
        <h1>Your Recipes</h1>
        <MuuriComponent {...this.gridOptions}>
        {this.state.addingRecipe ? this.renderCardsWithNew() : this.renderCards()}
        </MuuriComponent>
        {this.state.addingRecipe || this.state.queryMode ||
            <button onClick={e => this.setState({addingRecipe:true})}>Add Recipe</button>}
      </div>
    );
  }

  renderCards()
  {
    return this.props.recipes.map((recipeData : RecipeData) => this.renderCard(recipeData));
  }

  renderCardsWithNew()
  {
    let roCards = this.renderCards();
    roCards.push(this.renderNewCard());
    return roCards;
  }

  renderCard(recipe : RecipeData)
  {
     return (
      <RecipeCard
        key={"key" + recipe.id}
        recipeData={recipe}
        editRecipe={ this.props.editRecipe }
        onResize={ this.onResize }
        queryMode={ this.state.queryMode }
        newRecipe = {false}
        selected = {this.state.selectedItems[recipe.name]}
        selectRecipe = { this.selectRecipe }
        onDelete={ this.props.deleteRecipeFromSvr} />);
  }
  
  renderNewCard()
  {
     return (
      <RecipeCard
        key='THE_NEW_RECIPE'
        recipeData={ {name:"", text:"", id:"recipe_NEW"} }
        editRecipe={ this.props.editRecipe }
        addRecipe={ this.addRecipe }
        queryMode={ false}
        onResize={ this.onResize }
        newRecipe = {true}
        selected = {false}
        cancelNew = {this.cancelNew}
        onDelete={ this.props.deleteRecipeFromSvr} />);
  }

  cancelNew()
  {
    this.setState( { addingRecipe: false});
  }

  addRecipe(recipe : RecipeData)
  {
    this.setState( { addingRecipe: false});
    this.props.addRecipe(recipe);
  }

  selectRecipe(recipeName : string)
  {
    let oldState = this.state.selectedItems;
    oldState[recipeName] = true;
    this.setState({ selectedItems : oldState});
    if (this.state.selectCB)
    {
      this.state.selectCB(recipeName);
    }
  }

  onResize(component :any)
  {
    let g = this.getGrid();
    g.refreshItems();
    g.layout();
  }
  
  refreshGrid()
  {
    let g = this.getGrid();
    if (g)
    {
      g.refreshItems();
      g.layout();
    }
    this.props.fetchRecipes();
  }
  
  setQueryMode(queryMode: boolean)
  {
    this.setState( {queryMode: queryMode, selectedItems: {} } );
  }

  idFromGridElement(gridElement: HTMLElement)
  {
    return gridElement.children[0].children[0].id;
  }

  storeSortOrder()
  {
    let items = this.getGrid().getItems().map( (item:any) => this.idFromGridElement(item.getElement())).map( (htmlId:string) => htmlId.split('_')[1]);
    this.props.service.setOrder(items);
  }

  getGrid()
  { 
    return muuriMap.get(this.gridOptions.id);
  }
}
