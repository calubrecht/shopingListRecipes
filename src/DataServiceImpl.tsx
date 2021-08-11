import {DataService} from './DataService';
import {RecipeData} from './DataService';
import * as APIConstants from './APIConstants.js';

export class DataServiceImpl extends DataService
{
  apiServer : string;
  nameForID : Map<string, string>;
  constructor()
  {
    super();
    this.handleErrors = this.handleErrors.bind(this);
    this.apiServer = '';
    if (APIConstants.consts.apiServer)
    {
      this.apiServer = APIConstants.consts.apiServer;
    }
    else if (APIConstants.consts.apiPort)
    {
      this.apiServer = window.location.protocol + '//' +  window.location.hostname + ':' + APIConstants.consts.apiPort;
    }
    this.nameForID = new Map();
  }

  getRecipes() : Promise<RecipeData[]>
  {
    let req = {action: 'getRecipes'};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req), headers: this.getPostHeaders()})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  deleteRecipe(name : string) : Promise<RecipeData[]>
  {
    let req = {action: 'deleteRecipe', recipe:name};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req), headers: this.getPostHeaders()})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'editRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req), headers: this.getPostHeaders()})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'addRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req), headers: this.getPostHeaders()})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  setOrder(orderedItems: string[]) : Promise<void>
  {
    let req = {action: 'setOrder', orderedItems: orderedItems};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req), headers: this.getPostHeaders()})
         .then(this.handleErrors)
         .then(res => {});
  }
  
  getNameForIDNum(id: string) : string
  {
    return this.nameForID.has(id) ? this.nameForID.get(id)! : '';
  }

  parseResponse(response : Response)
  {
    let lThis = this;
    return response.json().then(
      r => 
      {
        if (!r.isLoggedIn)
        {
          throw Error("Please log in again.");
        }
        if (r.error)
        {
          throw Error(r.error);
        }
        lThis.nameForID = new Map();
        for (let recipe of r.recipes)
        {
          lThis.nameForID.set(recipe.id, recipe.name);
        }
        return r.recipes;
      });
  }

  handleErrors(response : Response)
  {
    if (!response.ok)
    {
      throw Error(response.statusText);
    }
    return response;
  } 

  getPostHeaders() : Record<string, string>
  {
    let XSRFTOKEN = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='));
    return XSRFTOKEN ?
    {
      'Content-Type': 'application/json',
      'x-xsrf-token': XSRFTOKEN
    } 
    :
    { 'Content-Type': 'application/json'};
  }
}
