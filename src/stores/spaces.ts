import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SpaceDto } from '../dto/response'
import { SpaceType } from '../types/enums'

export const useSpacesStore = defineStore('spaces', () => {
  // State
  const featuredSpaces = ref<SpaceDto[]>([])
  const searchResults = ref<SpaceDto[]>([])
  const currentSpace = ref<SpaceDto | null>(null)
  const favorites = ref<number[]>([])
  const isLoading = ref(false)
  const searchFilters = ref({
    location: '',
    spaceType: null as SpaceType | null,
    capacity: null as number | null,
    priceMin: null as number | null,
    priceMax: null as number | null,
    rating: null as number | null
  })

  // Actions
  const setFeaturedSpaces = (spaces: SpaceDto[]) => {
    featuredSpaces.value = spaces
  }

  const setSearchResults = (spaces: SpaceDto[]) => {
    searchResults.value = spaces
  }

  const setCurrentSpace = (space: SpaceDto | null) => {
    currentSpace.value = space
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const updateSearchFilters = (filters: Partial<typeof searchFilters.value>) => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  const clearSearchFilters = () => {
    searchFilters.value = {
      location: '',
      spaceType: null,
      capacity: null,
      priceMin: null,
      priceMax: null,
      rating: null
    }
  }

  const addToFavorites = (spaceId: number) => {
    if (!favorites.value.includes(spaceId)) {
      favorites.value.push(spaceId)
      saveFavoritesToStorage()
    }
  }

  const removeFromFavorites = (spaceId: number) => {
    const index = favorites.value.indexOf(spaceId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavoritesToStorage()
    }
  }

  const toggleFavorite = (spaceId: number) => {
    if (favorites.value.includes(spaceId)) {
      removeFromFavorites(spaceId)
    } else {
      addToFavorites(spaceId)
    }
  }

  const isFavorite = (spaceId: number): boolean => {
    return favorites.value.includes(spaceId)
  }

  const saveFavoritesToStorage = () => {
    localStorage.setItem('space_favorites', JSON.stringify(favorites.value))
  }

  const loadFavoritesFromStorage = () => {
    try {
      const storedFavorites = localStorage.getItem('space_favorites')
      if (storedFavorites) {
        favorites.value = JSON.parse(storedFavorites)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      favorites.value = []
    }
  }

  const clearFavorites = () => {
    favorites.value = []
    localStorage.removeItem('space_favorites')
  }

  const getSpaceById = (spaceId: number): SpaceDto | null => {
    // Check in featured spaces first
    let space = featuredSpaces.value.find(s => s.id === spaceId)
    if (space) return space

    // Check in search results
    space = searchResults.value.find(s => s.id === spaceId)
    if (space) return space

    // Return current space if it matches
    if (currentSpace.value && currentSpace.value.id === spaceId) {
      return currentSpace.value
    }

    return null
  }

  return {
    // State
    featuredSpaces,
    searchResults,
    currentSpace,
    favorites,
    isLoading,
    searchFilters,
    
    // Actions
    setFeaturedSpaces,
    setSearchResults,
    setCurrentSpace,
    setLoading,
    updateSearchFilters,
    clearSearchFilters,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavoritesFromStorage,
    clearFavorites,
    getSpaceById
  }
})