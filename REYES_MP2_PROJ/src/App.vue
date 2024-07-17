<template>
    <div class="pokemon-container">
      <h1>Who's That Pokemon?</h1>
      <br>
      <input class="pokemon-search-input" type="text" v-model="searchQuery" placeholder="Search for your Pokemon">
      <div class="pokemon-grid">
        <div v-for="(pokemon, index) in filteredPokemon" :key="pokemon.id" class="pokemon-card">
          <img :src="pokemon.imageUrl" :alt="pokemon.name" class="pokemon-image">
          <div class="pokemon-details">
            <strong>{{ pokemon.name }}</strong>
          </div>
          <div class="pokemon-number">{{ index + 1 }}</div>
          <div class="btn">
            <button @click="showPokemonDetails(pokemon)" class="details-button">Details</button>
            <button @click="deletePokemon(pokemon)" class="delete-button">Delete</button>
          </div>
        </div>
        <div @click="fetchNewPokemon" class="pokemon-card add-pokemon-card">
          +
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'; //onMounted for setUp() to fetch data
  import Swal from 'sweetalert2';
  
  export default {
    name: 'App',
    setup() {
      const pokemonData = ref([]);
      const searchQuery = ref('');
      const selectedPokemon = ref(null);
  
      const fetchPokemon = async () => { // asynchronous, executes other task if it is delayed
        try {
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // API Link, currently naka set ng 151, which will show 151 pokemons
          const data = await response.json();
  
          pokemonData.value = await Promise.all(data.results.map(async (pokemon, index) => { //resolve and reject 
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`); 
            const pokemonDetails = await response.json();
  
            return {
              id: index + 1, 
              name: pokemon.name,
              types: pokemonDetails.types.map(type => type.type.name),
              abilities: pokemonDetails.abilities.map(ability => ability.ability.name),
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`, 
              spriteUrl: pokemonDetails.sprites.front_default 
            };
          }));
        } catch (error) {
          console.error('Error fetching Pokémon:', error);
        }
      };
  
      const filteredPokemon = computed(() => {
        return pokemonData.value.filter(pokemon =>  
          pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
  
      const showPokemonDetails = async (pokemon) => {
        selectedPokemon.value = pokemon;
  
        await Swal.fire({
          title: pokemon.name,
          html: `
            <img src="${pokemon.spriteUrl}" alt="${pokemon.name}" class="pokemon-sprite">
            <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
          `
        });
      };
  
      const deletePokemon = (pokemon) => {
        const index = pokemonData.value.findIndex(p => p.id === pokemon.id); //find the exact pokemon to delete
        if (index !== -1) {
          pokemonData.value.splice(index, 1);
          Swal.fire({ //objects contained in the delete modal
            title: 'Deleted!',
            text: `${pokemon.name} has been deleted.`,
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
          });
        }
      };
  
      const fetchNewPokemon = async () => {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.value.length + 1}`);
          const pokemonDetails = await response.json();
  
          const newPokemon = {
            id: pokemonData.value.length + 1,
            name: pokemonDetails.name,
            types: pokemonDetails.types.map(type => type.type.name),
            abilities: pokemonDetails.abilities.map(ability => ability.ability.name),
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.value.length + 1}.png`,
            spriteUrl: pokemonDetails.sprites.front_default
          };
  
          pokemonData.value.push(newPokemon);
  
          Swal.fire({
            title: 'Added!',
            text: 'New Pokémon added.',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error('Error fetching new Pokémon:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to fetch new Pokémon.',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
          });
        }
      };
  
      onMounted(fetchPokemon);
  
      return {
        searchQuery,
        filteredPokemon,
        selectedPokemon,
        showPokemonDetails,
        deletePokemon,
        fetchNewPokemon
      };
      
    }
  }
  </script>
  
  <style>
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .delete-button:hover {
    background-color: #ff3333;
  }
  
  .details-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 5px;
    transition: background-color 0.3s ease;
  }
  
  .details-button:hover {
    background-color: #2980b9;
  }
  
  .pokemon-container {
    width: 200%;
    margin: 20px auto; 
    padding: 20px;
    text-align: center;
  }
  
  .pokemon-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pokemon-card {
    width: 150px;
    margin: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
  }
  
  .pokemon-image {
    width: 100%;
    border-radius: 5px;
  }
  
  .pokemon-details {
    margin-top: 5px;
  }
  
  .pokemon-number {
    position: absolute; 
    top: 5px; 
    right: 5px; 
    background-color: rgba(0, 0, 0, 0.5); 
    color: #fff; 
    border-radius: 3px;
    padding: 3px 5px; 
  }
  
  .pokemon-sprite {
    width: 100px; 
    height: auto; 
    display: block; 
    margin: 0 auto; 
  }
  
  .add-pokemon-card {
    width: 150px;
    height: 150px;
    background-color: #f0f0f0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    cursor: pointer;
  }
  
  .add-pokemon-card:hover {
    background-color: #e0e0e0;
  }

  .pokemon-search-input {
  width: 250px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.pokemon-search-input:focus {
  border-color: #3498db;
}
  </style>
  