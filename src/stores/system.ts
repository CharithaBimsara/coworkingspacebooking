import { defineStore } from 'pinia'

interface ApiError {
  message: string
  timestamp: number
  endpoint?: string
  statusCode?: number
}

export const useSystemStore = defineStore('system', {
  state: () => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastApiError: null as ApiError | null,
    showErrorBanner: false,
    errorQueue: [] as ApiError[],
  }),
  getters: {
    currentError(state) {
      return state.showErrorBanner ? state.lastApiError : null
    },
  },
  actions: {
    setOnlineStatus(isOnline: boolean) {
      this.isOnline = isOnline
      if (isOnline) {
        // Clear the banner when we come back online unless there is a queued API error
        if (this.errorQueue.length > 0) {
          this.lastApiError = this.errorQueue.shift() ?? null
          this.showErrorBanner = !!this.lastApiError
        } else {
          this.lastApiError = null
          this.showErrorBanner = false
        }
      } else {
        this.reportApiError({
          message: 'You appear to be offline. Some features may not work until the connection is restored.',
          timestamp: Date.now(),
        })
      }
    },
    reportApiError(error: ApiError) {
      this.lastApiError = error
      this.showErrorBanner = true
    },
    clearErrorBanner() {
      if (this.errorQueue.length > 0) {
        this.lastApiError = this.errorQueue.shift() ?? null
        this.showErrorBanner = !!this.lastApiError
      } else {
        this.lastApiError = null
        this.showErrorBanner = false
      }
    },
    enqueueError(error: ApiError) {
      this.errorQueue.push(error)
      if (!this.showErrorBanner) {
        this.reportApiError(this.errorQueue.shift()!)
      }
    },
  },
})
