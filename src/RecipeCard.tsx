import React from 'react';
import {RecipeData} from './DataService';
import {DeleteWidget} from './DeleteWidget';

export interface RecipeProps
{
  recipeData : RecipeData,
  onMount(card: any) : void
  onUnMount(card: any) : void
  onDelete(recipe: string) : void
}

export class RecipeCard extends React.Component<RecipeProps>
{
  domElement : any;

  render()
  {
    return(
          <div className="item" ref={el => this.domElement = el}>
          <div className="item-content">
          <div className="recipeCard">
          <div className="cardHeader">
          <span className="cardTitle"> {this.props.recipeData.name}</span>        </div>
          <div className="cardBody">
            <DeleteWidget name={this.props.recipeData.name} onDelete={() => this.delete()} />
            {this.renderEditBtn()}
            {this.props.recipeData.text}
            <ul>
               {this.props.recipeData.keyIngredients && this.props.recipeData.keyIngredients.map( ( ing : string) => <li  key={ing} className="keyIngredient">{ing}</li> )}
               {this.props.recipeData.commonIngredients && this.props.recipeData.commonIngredients.map( ( ing : string) => <li  key={ing} className="commonIngredient">{ing}</li> )}
            </ul>

          </div>
        </div>
      </div>
      </div>
      );
  }

  renderEditBtn()
  {
    return <div className="editBtn"><img src={require('./images-/pencil.png')}/></div>
  }
  
  componentDidMount () {
    this.props.onMount(this.domElement);
  }
  
  componentWillUnmount () {
    this.props.onUnMount(this.domElement);
  }

  delete()
  {
    this.props.onDelete(this.props.recipeData.name);
  }
}
