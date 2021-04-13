export const getQueryParams = () => {
  return window.location.search
    .substr(1)
    .split('&')
    .reduce((accumulator, singleQueryParam) => {
      const [key, value] = singleQueryParam.split('=')
      accumulator[key] = decodeURIComponent(value)
      return accumulator
    }, {})
}

