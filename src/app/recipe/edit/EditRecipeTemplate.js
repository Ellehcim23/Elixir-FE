'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import setAuthToken from '@/app/utils/setAuthToken';
import handleLogout from '@/app/utils/handleLogout';
import axios from 'axios';


export default function EditRecipeTemplate() {
  const paramStyle = {
    color: 'green'
  }

  const ingredientStyle = {
    color: 'blue'
  }

  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const [recipeLoading, setRecipeLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [recipeRedirect, setRecipeRedirect] = useState(false);

  const [query, setQuery] = useState('');
  const [selectedParams, setSelectedParams] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(true);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredients, setIngredients] = useState('');

  // Add parts for recipe
  const [name, setName] = useState('');
  const [measures, setMeasures] = useState(['','','','','','']);
  const [instructions, setInstructions] = useState('');
  const [alcoholic, setAlcoholic] = useState('True');
  const [image, setImage] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [glassType, setGlassType] = useState('');
  const [category, setCategory] = useState('');

  const updateIngredientOptions = useCallback((newQuery) => {
    if(newQuery) {
      if(ingredientsLoading) {
          return setIngredientsList(['Loading...']);
      }
      const results = ingredients.filter(ingredient => {
        if (newQuery === '') return true;

        let isAlreadySelected = false;
        selectedParams.forEach(param => {
          if (ingredient._id === param._id) isAlreadySelected = true;
        });
        if (isAlreadySelected) return false;
        
        return ingredient.name.toLowerCase().includes(newQuery.toLowerCase());
      });

      setIngredientsList(results);
    }
  }, [ingredients, selectedParams, ingredientsLoading]);

  if (typeof window !== 'undefined') {
    const expirationTime = new Date(localStorage.getItem('expiration') * 1000);
    let currentTime = Date.now();

    // make a condition that compares exp and current time
    if (currentTime >= expirationTime) {
      handleLogout();
      alert('Session has ended. Please login to continue.');
      router.push('/users/login');
    }
  }

  const addParam = (ingredient) => {
    if(selectedParams.length >= 6) return alert('You can only have 6 ingredients in a recipe.');

    if(Array.isArray(ingredient)) {
      setSelectedParams(ingredient);
    } else {
      let newParams = [...selectedParams];
      newParams.push(ingredient);
      setSelectedParams(newParams);
    }
    updateIngredientOptions();
  };

  const removeParam = (ingredient) => {
    let newParams = [...selectedParams];
    newParams = newParams.filter(param => {
        return param._id !== ingredient._id;
    });
    setSelectedParams(newParams);
    updateIngredientOptions();
  };

  useEffect(() => {
      setAuthToken(localStorage.getItem('jwtToken'));
      if (localStorage.getItem('jwtToken')) {
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/email/${localStorage.getItem('email')}`)
              .then((response) => {
                  let userData = jwtDecode(localStorage.getItem('jwtToken'));
                  if (userData.email === localStorage.getItem('email')) {
                      setData(response.data.users[0]);
                      setLoading(false);
                  } else {
                      router.push('/users/login');
                  }
              })
              .catch((error) => {
                  console.log(error);
                  router.push('/users/login');
              });
      } else {
          router.push('/users/login');
      }
  }, [router]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/ingredients`)
    .then((res) => res.json())
    .then((result) => {
        setIngredients(result.ingredients);
        setIngredientsLoading(false);
    });
  }, []);

  useEffect(() => {
    if(localStorage.getItem('recipeId')) {
      let recipeId = JSON.parse(localStorage.getItem('recipeId'));
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${recipeId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data.recipe);
        setName(data.recipe.name);
        setMeasures(data.recipe.measures);
        setInstructions(data.recipe.instructions);
        setAlcoholic(data.recipe.alcoholic);
        setImage(data.recipe.image);
        setGlassType(data.recipe.glassType);
        setCategory(data.recipe.category);
        setRecipeLoading(false);
        addParam(data.recipe.ingredients);
        // data.recipe.ingredients.forEach(ingredient => {
        //   addParam(ingredient);
        // });
      })
    }
  }, []);

  useEffect(() => {
    updateIngredientOptions(query);
  }, [selectedParams, query, updateIngredientOptions]);
    
  const handleIngredients = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    updateIngredientOptions(newQuery);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleMeasures1 = (e) => {
    let oldMeasures = [...measures];
    oldMeasures[0] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleMeasures2 = (e) => { 
    let oldMeasures = [...measures];
    oldMeasures[1] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleMeasures3 = (e) => {
    let oldMeasures = [...measures];
    oldMeasures[2] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleMeasures4 = (e) => {
    let oldMeasures = [...measures];
    oldMeasures[3] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleMeasures5 = (e) => {
    let oldMeasures = [...measures];
    oldMeasures[4] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleMeasures6 = (e) => {
    let oldMeasures = [...measures];
    oldMeasures[5] = e.target.value;
    setMeasures(oldMeasures);
  };

  const handleInstructions = (e) => {
    setInstructions(e.target.value);
  };

  const handleAlcoholic = (e) => {
    setAlcoholic(e.target.value);
  };

	const handleImage = (e) => {
    setImage(e.target.value)
  };

	const handleGlassType = (e) => {
    setGlassType(e.target.value)
  };

	const handleCategory = (e) => {
    setCategory(e.target.value)
  };

	const handleSubmit = (e) => {
		e.preventDefault();

    let ingredients = [];
    selectedParams.forEach(param => {
      ingredients.push(param._id);
    });

    const updateRecipe = {
        createdBy: recipe.createdBy[0]._id,
        name,
        ingredients,
        measures, 
        instructions, 
        alcoholic,
        image,
        glassType,
        category 
    }

    axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${recipe._id}`, updateRecipe)
    .then(response => {
      setRecipeRedirect(response.data.recipe._id);
    })
    .catch(error => {
      console.log('===> Error in creation', error)
      router.push('/recipe/new')
    });
	};

	if (recipeRedirect) {
    localStorage.setItem('recipeId', JSON.stringify(recipeRedirect));
    router.push(`/recipe`);
  }

    const handleDelete = (e) => {
      e.preventDefault();

      axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${recipe._id}`)
      .then(response => {
          if (response) {
            localStorage.removeItem('recipeId');
            router.push('/');
          }
      })
      .catch(error => {
        console.log('===> Error in delete', error);
        router.push('/profile')
      });
    }

	if (isLoading || recipeLoading) return <p>Loading...</p>
	
  return (

    <div className="container box p-6 has-background-light">
      <h1 className="subtitle has-text-centered">Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Recipe Name</label>
          <div className="control">
            <input className="input" name="name" value={name} onChange={handleName} type="text" placeholder="Recipe Name" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="instructions">Instructions</label>
          <div className="control">
            <textarea className="textarea" name='instructions' value={instructions} onChange={handleInstructions} placeholder="Instructions" />
          </div>
        </div>
  
        <div className="field">
          <label htmlFor="image">Image</label>
          <div className="control">
            <input className="input" type="text" name='image' value={image} onChange={handleImage}placeholder="Image URL" />
          </div>
        </div>
  
        <div className="field">
          <label htmlFor="alcoholic">Alcoholic</label>
          <div className="control">
            <div className="select">
              <select name='alcholic' value={alcoholic} onChange={handleAlcoholic}>
                <option>True</option>
                <option>False</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="glassType">Glass Type</label>
          <div className="control">
            <input className="input" type="text" name='glassType' value={glassType} onChange={handleGlassType} placeholder="Glass Type" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <div className="control">
            <input className="input" type="text" name='category' value={category} onChange={handleCategory} placeholder="Recipe Category" />
          </div>
        </div>
  
        <div className="field">
          <label htmlFor="ingredients">Ingredients (max 6)</label>
          <div className="control">
          <input className="input" type="search" name='ingredients' onChange={handleIngredients} placeholder="Search and Add Ingredients" />
          </div>
        </div>

        <ul style={paramStyle}>
            {(selectedParams === '' ? '' : selectedParams.map(param => {
                return <li key={param._id}>{param.name} <a onClick={() => {
                    removeParam(param);
                    updateIngredientOptions();
                }}>X</a></li>
            }))}
        </ul>
        <ul style={ingredientStyle}>
            {(query === '' ? '' : ingredientsList.map(ingredient => {
                return (ingredient === 'Loading...') ? <li key='loading'>Ingredients Loading...</li> : <li key={ingredient._id} onClick={() => {
                    addParam(ingredient);
                    updateIngredientOptions();
                }}>{ingredient.name}</li>
            }))}
        </ul>

        <div className="field">
          <label htmlFor="measures1">Measure 1</label>
          <div className="control">
            <input className="input" name='measures1' value={measures[0]} onChange={handleMeasures1} placeholder="Ingredient 1 Measure" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="measures2">Measure 2</label>
          <div className="control">
            <input className="input" name='measures2' value={measures[1]} onChange={handleMeasures2} placeholder="Ingredient 2 Measure" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="measures3">Measure 3</label>
          <div className="control">
            <input className="input" name='measures3' value={measures[2]} onChange={handleMeasures3} placeholder="Ingredient 3 Measure" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="measures4">Measure 4</label>
          <div className="control">
            <input className="input" name='measures4' value={measures[3]} onChange={handleMeasures4} placeholder="Ingredient 4 Measure" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="measures5">Measure 5</label>
          <div className="control">
            <input className="input" name='measures5' value={measures[4]} onChange={handleMeasures5} placeholder="Ingredient 5 Measure" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="measures6">Measure 6</label>
          <div className="control">
            <input className="input" name='measures6' value={measures[5]} onChange={handleMeasures6} placeholder="Ingredient 6 Measure" />
          </div>
        </div>
  
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-success" type='submit'>Update Recipe</button>
          </div>
          <div className="control">
            <button className="button is-danger" type='delete' onClick={handleDelete}>Delete</button>
          </div>
          <div className="control">
            <button className="button is-link is-light" type='cancel' onClick={() => {setRecipeRedirect(recipe._id)}}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}