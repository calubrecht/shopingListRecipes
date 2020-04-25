import React from 'react';

export interface RecipeProps
{
  text: string
}

export default class RecipeCard extends React.Component<RecipeProps>
{

render()
{
  return(
        <div className="cardBody">
        {this.props.text}
      </div>
    );
}

}