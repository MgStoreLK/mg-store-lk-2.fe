import { Text, clx } from "@medusajs/ui"

import { getCategoriesList, getCollectionsList, listCMSContents } from "@lib/data"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FullLogo from "../../../../../public/full_logo"
import TelephoneFill from "@modules/common/icons/telephone-fill-right"
import AddressIcon from "@modules/common/icons/address"
import Email from "@modules/common/icons/email"
import Link from "next/link"

const fetchCollections = async () => {
  const { collections } = await getCollectionsList()
  return collections
}

const fetchCategories = async () => {
  const { product_categories } = await getCategoriesList()
  return product_categories
}

const fetchCMSContents = async (countryCode: string) => {
  return await listCMSContents(countryCode);
}

const companyInfo = [
  {
    icon: (<TelephoneFill className="size-4" />),
    content: (<Text size="base" weight="regular">(+94)-781560399</Text>)
  },
  {
    icon: (<AddressIcon className="size-4" />),
    content: (<Text size="base" weight="regular">33/17/4, Mandhendawele, Matale</Text>)
  },
  {
    icon: (<Email className="size-4" />),
    content: (<Text size="base" weight="regular">
      <Link href="mailto:mgstorepvt@gmail.com">mgstorepvt@gmail.com</Link>
    </Text>)
  }
]

export default async function Footer({ countryCode }: { countryCode: string | undefined }) {
  const productCollections = await fetchCollections().then(
    (collections) => collections
  )
  const productCategories = await fetchCategories().then(
    (categories) => categories
  )
  const cmsContents = countryCode ? await fetchCMSContents(countryCode).then(
    (content) => content
  ) : []

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-row gap-y-6 max-md:flex-col items-start justify-between py-10">
          <div className="flex-1 flex flex-row max-[880px]:flex-col max-[767px]:flex-row max-[600px]:flex-col gap-10 justify-evenly max-[767px]:w-full items-center">
            <div className="flex flex-col items-center">
              <LocalizedClientLink className="w-60" href="/">
                <FullLogo />
              </LocalizedClientLink>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">
                Contact
              </span>
              <ul className="grid grid-cols-1 gap-2">
                {companyInfo.map((t, i) => {
                  return (
                    <li
                      className="gap-2 text-ui-fg-subtle txt-small"
                      key={i}
                    >
                      <div className="flex items-center justify-start gap-x-2 flex-wrap">
                        <span className="flex items-center justify-between gap-x-2">{t.icon} - </span>{t.content}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div
            className="text-small-regular gap-10
          grid grid-cols-4 max-[1224px]:grid-cols-2 max-[767px]:grid-cols-4 max-[500px]:grid-cols-3 max-[400px]:grid-cols-2">
            {cmsContents && cmsContents?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Company
                </span>
                <ul className="grid grid-cols-1 gap-2">
                  {cmsContents?.slice(0, 6).map((c, i) => {
                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={i}
                      >
                        <LocalizedClientLink
                          href={`/content/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Socials</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul className="grid grid-cols-1 gap-2">
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={"hover:text-ui-fg-base"}
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {productCollections && productCollections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul
                  className={"grid grid-cols-1 gap-2"}
                >
                  {productCollections?.slice(0, 6).map((c) => (
                    <li
                      className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                      key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full mb-8 justify-center text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} MG Store LK. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  )
}
