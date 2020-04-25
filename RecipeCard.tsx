import React from 'react';
import {RecipeData} from './DataService';

export interface RecipeProps
{
  text: string
}

export class RecipeCard extends React.Component<RecipeData>
{

render()
{
  return(
        <div className="recipeCard">
        <div className="cardHeader">
        <span className="cardTitle"> {this.props.recipeData.name}</span>        </div>
        <div className="cardBody"> {this.props.recipeData.text} </div>

      </div>
    );
}

}