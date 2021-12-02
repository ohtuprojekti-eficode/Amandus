import React, { useEffect, useState } from 'react'
import {
  Switch,
} from '@material-ui/core'

export const PluginObject = ({ name, active, parentCallback }: {
  name: string,
  active: boolean,
  parentCallback: (name: string, value: boolean) => void,
}) => {
  
  useEffect(() => {
    setSwitchChecked(active)
  }, [active])
  
  const [switchChecked, setSwitchChecked] = useState(active)
  
  const handleSwitchToggle = () => {
    parentCallback(name, !switchChecked)
    setSwitchChecked(!switchChecked)
  }
  
  return (
    <div>
      <b>{name}</b>
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
