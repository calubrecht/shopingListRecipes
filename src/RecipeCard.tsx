import React from 'react';
import {RecipeData} from './DataService';
import {DeleteWidget} from './DeleteWidget';

export interface RecipeProps
{
  recipeData : RecipeData
  onMount(card: any) : void
  onUnMount(card: any) : void
  onDelete(recipe: string) : void
  onResize(card: any) : void
  editRecipe(recipe: RecipeData) : void
}

export interface RecipeState
{
  editing : boolean
  recipeData : RecipeData
}

export class RecipeCard extends React.Component<RecipeProps, RecipeState>
{
  domElement : any;
  elementToFocus : string = '';
  needResize = false;
  textAreaElement? : HTMLTextAreaElement | null;

  constructor (props : RecipeProps)
  {
    super(props);
    this.state = { editing: false, recipeData: props.recipeData};
    this.doEdit = this.doEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeList = this.handleChangeList.bind(this);
  }

  render()
  {
    if (this.state.editing)
    {
      return this.renderEdit();
    }
    else
    {
      return this.renderReadOnly();
    }
  }

  renderReadOnly()
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
  
  renderEdit()
  {
    let keyI = 0;
    let commonI = 0;
    return(
          <div className="item" ref={el => this.domElement = el}>
          <div className="item-content">
          <div className="recipeCard editing">
          <div className="cardHeader">
          <span className="cardTitle"> {this.state.recipeData.name}</span>        </div>
          <div className="cardBody">
            <textarea className="description" name="text" value={this.state.recipeData.text} ref={el => this.textAreaElement = el} onChange={this.handleChangeField} />
            <ul>
               {this.state.recipeData.keyIngredients && this.state.recipeData.keyIngredients.map( ( ing : string) => <li key={"key" + (keyI).toString()} className="keyIngredient"><input type="text" className="keyIngredients" value={ing} onChange={this.handleChangeList} name={"key" + (keyI++).toString()} /></li> )}
               <li key={"key" + (keyI).toString()} className="keyIngredient"><input type="text" className="keyIngredients" value="" onChange={this.handleChangeList} name={"key" + (keyI++).toString()} /></li>
               {this.state.recipeData.commonIngredients && this.state.recipeData.commonIngredients.map( ( ing : string) => <li key={"common" + (commonI).toString()} className="commonIngredient"><input type="text" className="commonIngredients" value={ing} onChange={this.handleChangeList} name={"common" + (commonI++).toString()} /></li> )}
               <li key={"common" + (commonI).toString()} className="commonIngredient"><input type="text" className="commonIngredients" value="" onChange={this.handleChangeList} name={"common" + (commonI++).toString()} /></li>
            </ul>
            <div>
               <button type="button" onClick={this.cancelEdit}>Cancel</button><button type="button" onClick={this.confirmEdit}>Save</button>
            </div>

          </div>
        </div>
      </div>
      </div>
      );
  }

  renderEditBtn()
  {
    return <div className="editBtn"><img src={require('./images-/pencil.png')} alt="edit" onClick={this.doEdit} /></div>
  }
  
  componentDidMount () {
    this.props.onMount(this.domElement);
  }

  componentDidUpdate()
  {
    this.setEditDesciptionHeight();
    if (this.elementToFocus)
    {
      let className = this.elementToFocus.split(':')[0];
      let count = this.elementToFocus.split(':')[1];
      let el = this.domElement.getElementsByClassName(className)[count];
      el.focus();
      this.elementToFocus = '';
    }
    if (this.needResize)
    {
      this.needResize = false;
      this.props.onResize(this.domElement);
    }
  }

  setEditDesciptionHeight()
  {
    let ta = this.textAreaElement;
    if (ta)
    {
      if (!ta.style.height || ta.style.height !== ta.scrollHeight + 'px')
      {
        ta.style.height = '1px'
        ta.style.height = ta.scrollHeight + 'px';
        this.props.onResize(this.domElement);
      }
    }
  }
  
  componentWillUnmount () {
    this.props.onUnMount(this.domElement);
  }

  doEdit() {
    this.elementToFocus = "description:0";
    this.setState( {
      editing : true,
      recipeData : Object.assign({},this.props.recipeData)});
  }

  cancelEdit()
  {
    this.needResize = true;
    this.setState( { editing : false } );
  }

  confirmEdit()
  {
    this.needResize = true;
    this.props.editRecipe(this.state.recipeData);
    this.setState ( {editing : false});
  }

  handleChangeField(event: any)
  {
    let data = { ...this.state.recipeData} as {[index: string] : string | string[]};
    let fieldName = event.target.name as string;
    data[fieldName] =  event.target.value as string;
    this.setState({recipeData : data as unknown as RecipeData});
  }
  
  handleChangeList(event: any)
  {
    let data = { ...this.state.recipeData} as {[index: string] : string | string[]};
    let itemName = event.target.name as string;
    let value = event.target.value as string;
    let ingredients :string[] = [];
    let index = 0;
    if (itemName.startsWith("key"))
    {
      ingredients = data.keyIngredients as string[];
      index = parseInt(itemName.substring(3));
    }
    else
    {
      ingredients = data.commonIngredients as string[];
      index = parseInt(itemName.substring(6));
    }
    if (ingredients)
    {
      ingredients = [...ingredients];
    }
    else
    {
      ingredients = [];
    }

    if (value.trim().length === 0)
    {
      if (index >= ingredients.length)
      {
        // Last element is zero? who cares
        return;
      }
      ingredients.splice(index, 1);
    }
    else
    {
      if (index >= ingredients.length)
      {
        ingredients.push(value);
        this.elementToFocus = event.target.className + ":" + index.toString();
      }
      else
      {
        ingredients[index] = value;
      }
    }
    if (itemName.startsWith("key"))
    {
      data.keyIngredients = ingredients;
    }
    else
    {
      data.commonIngredients = ingredients;
    }
    
    
    this.setState({recipeData : data as unknown as RecipeData});
  }

  delete()
  {
    this.props.onDelete(this.props.recipeData.name);
  }
}
