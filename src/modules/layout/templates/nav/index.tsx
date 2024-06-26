import { Suspense } from "react"
import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import React from "react"
import FullLogo from "../../../../../public/full_logo"
import CategoryMenu from "@modules/layout/components/category-menu"
import { CategoryWrapper } from "@lib/context/CategoryWrapper"
import LogoNew from "../../../../../public/logo-new"

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)

  return (
    <div className="sticky inset-x-0 top-0 z-50 group">
      <header className="relative h-16 mx-auto duration-200 bg-white border-b border-ui-border-base">
        <nav className="flex items-center justify-between w-full h-full content-container txt-xsmall-plus text-ui-fg-subtle text-small-regular">
          <div className="flex items-center flex-1 h-full basis-0 gap-x-5">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
            <div className="h-full">
              <CategoryWrapper>
                <CategoryMenu />
              </CategoryWrapper>
            </div>
          </div>

          <LocalizedClientLink
            href="/"
            className="flex-1 flex justify-center items-center p-6 w-48">
            <FullLogo className="visible max-[500px]:invisible w-full"/>
            <LogoNew className="invisible max-[500px]:visible w-full"/>
          </LocalizedClientLink>

          <div className="flex items-center justify-end flex-1 h-full gap-x-6 basis-0">
            <div className="items-center hidden h-full small:flex gap-x-6">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:text-ui-fg-base"
                  href="/cart"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}