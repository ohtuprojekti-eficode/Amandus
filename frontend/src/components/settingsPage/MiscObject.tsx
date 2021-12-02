import React, { useEffect, useState } from 'react'
import {
  Switch,
  TextField,
} from '@material-ui/core'

export const MiscObject = ({ name, value, min, max, parentCallback, unit, active }: {
  name: string,
  value: number,
  min?: number,
  max?: number
  unit?: string,
  active?: boolean
  parentCallback: (
    name: string,
    value: number | boolean,
    min?: number,
    max?: number
  ) => void,
}) => {

  useEffect(() => {
    setFieldValue(value)
    setSwitchChecked(active)
  }, [value, active])

  const [fieldValue, setFieldValue] = useState(value)

  const [switchChecked, setSwitchChecked] = useState(active)

  const handleFieldValueChange = (incomingValue: string) => {
    parentCallback(name, parseInt(incomingValue), min, max)
    setFieldValue(parseInt(incomingValue))
  }

  const handleSwitchToggle = () => {
    parentCallback(name, !switchChecked)
    setSwitchChecked(!switchChecked)
  }

  const rangeInformation = (): string => {
    if (min && max) return `range: ${min} - ${max}`

    if (min) return `min: ${min}`

    if (max) return `max: ${max}`

    return ''
  }


  return (
    <div>
      <b>{name}</b>
      <TextField
        id={name + "-toggle"}
        name={name + "-toggle"}
        value={fieldValue}
        helperText={rangeInformation()}
        type="number"
        color="primary"
        onChange={({ target }) => handleFieldValueChange(target.value)}
        inputProps={{ 'aria-label': 'primary checkbox', min: min, max: max }}
        disabled={!switchChecked}
      />
      {unit}
      <Switch
        id={name + "-toggle"}
        name={name + "-toggle"}
        checked={switchChecked}
        onChange={handleSwitchToggle}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </div>
  )
}
