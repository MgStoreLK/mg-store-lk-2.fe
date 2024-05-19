"use client"

import { Popover, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { IconButton, Text, clx } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCategoryMenu } from "@lib/context/CategoryWrapper"
import ChevronDown from "@modules/common/icons/chevron-down"
import Spinner from "@modules/common/icons/spinner"


const CategoryMenu = () => {
  const { categories,
    setParentCategory,
    getParentCategory,
    toParentCategory,
    getCurrentHandle,
    isLoading,
    isSuccess,
    setPage,
    getPage
      } = useCategoryMenu()

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if(e?.currentTarget?.scrollHeight !== e.currentTarget?.offsetHeight + e.currentTarget?.scrollTop) return;
    setPage(getPage()+1)
  }    

  const hasParent = () => getParentCategory()? true:false


  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base">
                  Categories
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <Popover.Panel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6">
                    <div 
                      className={
                        clx("flex items-start",
                          {"justify-between":hasParent(),"justify-end":!hasParent()})}
                      id="xmark">
                      {hasParent() && 
                        <IconButton 
                          variant="primary" 
                          className="rotate-90" 
                          onClick={()=> toParentCategory()}>
                          <ChevronDown />
                        </IconButton>}
                      <button onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col my-5 gap-6 items-start justify-start overflow-y-auto" onScroll={handleScroll}>
                      {isSuccess && categories.map(({handle, name, id, category_children}) => {
                        return (
                          <li key={id} className="">
                            <LocalizedClientLink
                              href={`/${getCurrentHandle()+"/"+handle}`}
                              className="text-2xl leading-10 hover:text-ui-fg-disabled"
                              onClick={close}
                            >
                              {name}
                            </LocalizedClientLink>
                            {
                              category_children && category_children.length > 0 &&
                              <IconButton 
                                variant="transparent" 
                                className="my-0 py-0 ml-5 place-content-end -rotate-90"
                                onClick={()=>setParentCategory(id)}>
                                <ChevronDown />
                              </IconButton>
                            }
                          </li>
                        )
                      })}
                      {isLoading && <Spinner/>}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <Text className="flex justify-between txt-compact-small">
                        © {new Date().getFullYear()} MG Store LK. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default CategoryMenu
