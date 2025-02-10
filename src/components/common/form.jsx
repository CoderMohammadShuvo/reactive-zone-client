"use client"

import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  fetchData, // Function to fetch data
}) {
  const [options, setOptions] = useState({})

  useEffect(() => {
    if (fetchData) {
      fetchData().then((data) => {
        setOptions(data)
      })
    }
  }, [fetchData])

  function renderInputsByComponentType(getControlItem) {
    let element = null
    const value = formData[getControlItem.name] || ""

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        )
        break

      case "select":
        const selectOptions = options[getControlItem.name] || getControlItem.options || []

        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.length > 0 ? (
                selectOptions.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.label}>
                    {optionItem.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No options available</SelectItem>
              )}
            </SelectContent>
          </Select>
        )
        break

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        )
        break

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        )
        break
    }

    return element
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls &&
          formControls.map((controlItem) => (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <Label className="mb-1">{controlItem.label}</Label>
              {renderInputsByComponentType(controlItem)}
            </div>
          ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  )
}

export default CommonForm

