import Cookies from 'js-cookie'

const app = {
  state: {
    size: Cookies.get('size') || 'medium',
    requestLoading: 0,
    coordinate: {
      longitude: '',
      latitude: ''
    }
  },
  mutations: {
    SET_LOADING: (state, status) => {
      // error 的时候直接重置
      if (status === 0) {
        state.requestLoading = 0
        return
      }
      state.requestLoading = status ? ++state.requestLoading : --state.requestLoading
    },
    SET_COORDINATE: (state, newCoordinate) => {
      if (newCoordinate) {
        state.coordinate = newCoordinate
      }
    }
  },
  actions: {
    SetLoading ({
      commit
    }, status) {
      commit('SET_LOADING', status)
    },
    SETCoordinate ({
      commit
    }, newCoordinate) {
      commit('SET_COORDINATE', newCoordinate)
    }
  }
}

export default app
