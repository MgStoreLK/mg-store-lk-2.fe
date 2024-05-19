import { ProductOption } from "@medusajs/medusa"
// import { clx } from "@medusajs/ui"
import React, { useEffect, useState } from "react"

import { onlyUnique } from "@lib/util/only-unique"
import NativeSelect from "@modules/common/components/native-select"

type OptionSelectProps = {
  option: ProductOption
  current: string
  updateOption: (option: Record<string, string>) => void
  title: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
}) => {
  const [value, setValue] = useState<string|null>("-")

  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique)
  
  useEffect(()=>{
    if(!value) return;
    updateOption({ [option.id]: value })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">{title}</span>
      <NativeSelect
            required
            onChange={(e) => setValue(e.target.value)}>
            <option label={`Select ${title}`} value={"-"} hidden />
            {filteredOptions.map((v, i) => {
              return (
                <option key={i} value={v}>
                  {v}
                </option>
              )
            })}
        </NativeSelect>
      {/* <div className="flex flex-wrap justify-center max-lg:justify-start gap-2">
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption({ [option.id]: v })}
              key={v}
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 truncate hover:overflow-visible",
                {
                  "border-ui-border-interactive": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
            >
              {v}
            </button>
          )
        })}
      </div> */}
    </div>
  )
}

export default OptionSelect
