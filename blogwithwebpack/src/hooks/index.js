import { useState } from 'react'

export const useField = (type, data = '') => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')

  }

  // the data-cy is returned in order to use the testing library in an easy way
  return [{
    type,
    'data-cy': data,
    value,
    onChange,
  }, reset]
}



