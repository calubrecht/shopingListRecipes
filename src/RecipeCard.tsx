import React from 'react';
import {RecipeData} from './DataService';
import {DeleteWidget} from './DeleteWidget';

export interface RecipeProps
{
  recipeData : RecipeData,
  onDelete(recipe: string) : void
}

export class RecipeCard extends React.Component<RecipeProps>
{

  render()
  {
    return(
          <div className="recipeCard">
          <div className="cardHeader">
          <span className="cardTitle"> {this.props.recipeData.name}</span>        </div>
          <div className="cardBody">
            <DeleteWidget name={this.props.recipeData.name} onDelete={() => this.delete()} />
            {this.props.recipeData.text}
            <ul>
               {this.props.recipeData.keyIngredients && this.props.recipeData.keyIngredients.map( ( ing : string) => <li  key={ing} className="keyIngredient">{ing}</li> )}
               {this.props.recipeData.commonIngredients && this.props.recipeData.commonIngredients.map( ( ing : string) => <li  key={ing} className="commonIngredient">{ing}</li> )}
            </ul>

          </div>
        </div>
      );
  }

  delete()
  {
    this.props.onDelete(this.props.recipeData.name);
  }
}
