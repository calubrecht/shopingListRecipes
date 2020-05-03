import React, { Component } from 'react';
import {Hello} from './Hello';
import {RecipeCard} from './RecipeCard';
import MuuriGrid from 'react-muuri';
import {RecipeData} from './DataService';
import * as utils from './utils';


interface GridProps {
  recipes: RecipeData[],
  deleteRecipeFromSvr(recipeName : string) : void
  editRecipe(recipe: string) : void
}
export class RecipeGrid extends Component<GridProps> {
  grid : any;
  gridElement : any;


  constructor(props : GridProps) {
    super(props);
    this.addToGrid = this.addToGrid.bind(this);
    this.removeFromGrid = this.removeFromGrid.bind(this);
    this.onResize = this.onResize.bind(this);

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
        </div>
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
        onDelete={ this.props.deleteRecipeFromSvr} />);
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

}
