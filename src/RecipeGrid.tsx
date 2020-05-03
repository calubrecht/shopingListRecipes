import React, { Component } from 'react';
import {Hello} from './Hello';
import {RecipeCard} from './RecipeCard';
import MuuriGrid from 'react-muuri';
import {RecipeData} from './DataService';
import * as utils from './utils';


interface GridProps {
  recipes: RecipeData[],
  deleteRecipeFromSvr(recipeName : string) : void
  editRecipe(recipe: RecipeData) : void
  addRecipe(recipe: RecipeData) : void
}

interface GridState {
  addingRecipe: boolean
}
export class RecipeGrid extends Component<GridProps, GridState> {
  grid : any;
  gridElement : any;


  constructor(props : GridProps) {
    super(props);
    this.addToGrid = this.addToGrid.bind(this);
    this.removeFromGrid = this.removeFromGrid.bind(this);
    this.onResize = this.onResize.bind(this);
    this.cancelNew = this.cancelNew.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.state = {addingRecipe: false};

  }
  
  componentDidMount () {
    this.grid = new MuuriGrid({
      node: this.gridElement,
      defaultOptions: {
        dragEnabled: true,
        dragStartPredicate: function (item : any, e : any, options:any)
        {
          if (e.target.className === 'cardTitle')
          {
            return utils.defaultStartPredicate(item, e, options);
          }
          return false;
        }
      },
    });

    this.grid.getEvent('dragEnd');
  }

  componentWillUnmount () {
    this.grid.getMethod('destroy');
  }
  
  render() {
    return (
      <div>
        <Hello name="the Recipes" />
        <div ref={gridElement => this.gridElement = gridElement}>
        {this.props.recipes.map( (recipeData : RecipeData) => this.renderCard(recipeData))}
        {this.state.addingRecipe && 
            this.renderNewCard()}
        </div>
        {this.state.addingRecipe ||
            <button onClick={e => this.setState({addingRecipe:true})}>Add Recipe</button>}
      </div>
    );
  }

  renderCard(recipe : RecipeData)
  {
     return (
      <RecipeCard
        key={recipe.name}
        recipeData={recipe}
        onMount={ this.addToGrid }
        onUnMount={ this.removeFromGrid }
        editRecipe={ this.props.editRecipe }
        onResize={ this.onResize }
        newRecipe = {false}
        onDelete={ this.props.deleteRecipeFromSvr} />);
  }
  renderNewCard()
  {
     return (
      <RecipeCard
        key='THE_NEW_RECIPE'
        recipeData={ {name:"", text:""} }
        onMount={ this.addToGrid }
        onUnMount={ this.removeFromGrid }
        editRecipe={ this.props.editRecipe }
        addRecipe={ this.addRecipe }
        onResize={ this.onResize }
        newRecipe = {true}
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

  addToGrid(component : any)
  {
    this.grid.getMethod('add', [component], {isActive:true});
  }
  
  removeFromGrid(component : any)
  {
    this.grid.getMethod('remove', [component], {removeElements:false});
  }

  onResize(component :any)
  {
    this.grid.getMethod('refreshItems', [component]);
    this.grid.getMethod('layout');
  }
  
  refreshGrid()
  {
    this.grid.getMethod('layout');
  }
}
