"use client"
import { getCategoriesListByParent, getCategoryByID } from "@lib/data"
import React, { createContext, useContext, useEffect, useState } from "react"
import { ProductCategoryWithChildren } from "types/global"

interface CategoryMenuContext {
  categories: ProductCategoryWithChildren[]
  setParentCategory: (categoryID: string) => void
  getParentCategory: () => ProductCategoryWithChildren | null | undefined
  getCount: () => number
  getPage: () => number
  setPage: (pageNo: number) => void
  getItemsPerPage: () => number
  setItemsPerPage: (num: number) => void
  getCurrentHandle: () => string
  toParentCategory: () => void
  isLoading: boolean
  isSuccess: boolean
}

const CategoryMenuContext = createContext<CategoryMenuContext | null>(null)

interface CategoryWrapperProps {
  children?: React.ReactNode
}

type CategoryCache = {
  maxPage: number
  parentCategory: ProductCategoryWithChildren | null | undefined
  product_categories: ProductCategoryWithChildren[]
  count: number
}

export const CategoryWrapper = ({ children }: CategoryWrapperProps) => {
  const [pageNo, setPageNo] = useState<number>(1)
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [count, setCount] = useState<number | null | undefined>()
  const [parentID, setParentID] = useState<string | null | undefined>()
  const [parent, setParent] = useState<
    ProductCategoryWithChildren | null | undefined
  >()
  const [categories, setCategories] = useState<
    ProductCategoryWithChildren[] | null | undefined
  >()
  const [handles, setHandles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [categoryCache, setCategoryCache] = useState<CategoryCache[]>([])

  const getPage = () => (pageNo > 0 ? pageNo : 1)
  const setPage = (pageNo: number) => {
    if (pageNo < 0) return
    const skip = pageLimit * (pageNo - 1)
    if (getCount() <= skip) return
    setPageNo(pageNo)
  }

  const getItemsPerPage = () => pageLimit
  const setItemsPerPage = (num: number) => setPageLimit(num)

  const getCount = () => (count ? count : 0)

  const findCategoryCache = (categoryID: string | null | undefined) => {
    return categoryCache.find((e) =>
      categoryID
        ? e.parentCategory?.id === categoryID
        : e.parentCategory === null
    )
  }

  const updateCategoryCache = (
    parentCategoryID: string | null | undefined,
    product_categories: ProductCategoryWithChildren[],
    maxPage: number,
    count: number
  ) => {
    const cache = findCategoryCache(parentCategoryID)
    let newCache: CategoryCache = {
      product_categories: [],
      maxPage,
      parentCategory: parent ? parent : null,
      count,
    }
    if (cache) {
      newCache.product_categories = [
        ...cache.product_categories,
        ...product_categories,
      ]
    } else {
      newCache.product_categories = product_categories
    }
    setCategoryCache([
      ...categoryCache.filter((e) =>
        parentCategoryID
          ? e.parentCategory?.id !== parentCategoryID
          : e.parentCategory !== null
      ),
      newCache,
    ])
    return newCache
  }

  const fetchCategories = async (skip: number, take: number) => {
    const cache = findCategoryCache(parentID)
    if (cache && cache.maxPage * pageLimit >= skip + take) {
      return {
        product_categories: cache.product_categories,
        count: cache.count,
      }
    }
    const cats = await getCategoriesListByParent(skip, take, parentID)
    const newCache = updateCategoryCache(
      parentID,
      cats ? cats.product_categories : [],
      pageNo,
      cats ? cats.count : 0
    )
    return newCache
  }

  const fetchCategoryByID = async (categoryID: string) => {
    const cache = categoryCache.find((e) => e.parentCategory?.id === categoryID)
    if (cache && cache.parentCategory) {
      return {
        product_category: cache.parentCategory,
      }
    }
    const cat = await getCategoryByID(categoryID)
    if (cache && cat?.product_category) {
      cache.parentCategory = cat.product_category
    }
    return cat
  }

  const getParentCategory = () => (parent ? parent : undefined)
  const setParentCategory = async (categoryID: string | null | undefined) => {
    setIsLoading(true)
    setIsSuccess(false)
    if (categoryID) {
      const cat = await fetchCategoryByID(categoryID)
      if (cat?.product_category?.handle) {
        setPageNo(1)
        setHandles([...handles, cat?.product_category?.handle])
        setParentID(categoryID)
        setParent(cat.product_category)
      }
    } else {
      setPageNo(1)
      setParentID(null)
      setParent(null)
      setHandles([])
    }
    setIsLoading(false)
    setIsSuccess(true)
  }

  const getCurrentHandle = () => ["categories", ...handles].join("/")
  const toParentCategory = () => {
    if (handles.length > 0) {
      const parent = handles.length > 1 ? handles[handles.length - 2] : null
      setHandles(handles.splice(0, handles.length - 1))
      setParentCategory(parent)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setIsSuccess(false)
    const skip = pageLimit * (pageNo - 1)
    const take = pageLimit
    fetchCategories(skip, take).then((cats) => {
      setCategories(cats ? cats.product_categories : [])
      setCount(cats && cats.count ? cats.count : 0)
    })
    setIsLoading(false)
    setIsSuccess(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentID])

  useEffect(() => {
    const count = getCount()
    if (count <= 0) return
    setIsLoading(true)
    setIsSuccess(false)
    const skip = pageLimit * (pageNo - 1)
    const take = pageLimit
    if (count > skip) {
      fetchCategories(skip, take).then((cats) => {
        const pCats = cats.product_categories ? cats.product_categories : []
        setCategories(pCats)
        setCount(cats && cats.count ? cats.count : 0)
      })
    }
    setIsLoading(false)
    setIsSuccess(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo])

  return (
    <CategoryMenuContext.Provider
      value={{
        categories: Array.isArray(categories) ? categories : [],
        setParentCategory,
        getParentCategory,
        getCount,
        getPage,
        setPage,
        getItemsPerPage,
        setItemsPerPage,
        getCurrentHandle,
        toParentCategory,
        isLoading,
        isSuccess,
      }}
    >
      {children}
    </CategoryMenuContext.Provider>
  )
}

export const useCategoryMenu = () => {
  const context = useContext(CategoryMenuContext)
  if (context === null) {
    throw new Error("useCategoryMenu must be used within a CategoryWrapper")
  }
  return context
}
