import {DataService} from './DataService';
import {RecipeData} from './DataService';
import * as APIConstants from './APIConstants.js';

export class DataServiceImpl extends DataService
{
  apiServer : string;
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
  }

  getRecipes() : Promise<RecipeData[]>
  {
    let req = {action: 'getRecipes'};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  deleteRecipe(name : string) : Promise<RecipeData[]>
  {
    let req = {action: 'deleteRecipe', recipe:name};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'editRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'addRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }

  parseResponse(response : Response)
  {
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
}
