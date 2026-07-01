import { reactive } from 'vue'

const state = reactive({
  request: null,
  result: null,
})

export function useAnalysisStore() {
  function setAnalysis(request, result) {
    state.request = request
    state.result = result
  }

  return {
    state,
    setAnalysis,
  }
}
