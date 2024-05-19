/* eslint-disable react/jsx-no-undef */
import { Product } from "@medusajs/medusa"
import { Metadata } from "next"

import { getCollectionsList, getProductsList } from "@lib/data"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getRegion } from "app/actions"
import { ProductCollectionWithPreviews } from "types/global"
import HomeBannerCarousel, { HomeBanner } from "@modules/home/components/home-banner-carousel"
import { Container } from "@medusajs/ui"
import Image from "next/image"

const dummy_banners = [
  // {
  //   id:'1',
  //   url:'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/retail-store-facebook-shop-cover-design-template-3b90163b24d7f9c789c1be51b5a3951d_screen.jpg?ts=1700638520',
  //   handle:'',
  //   region:'lk'
  // },
  // {
  //   id:'2',
  //   url:'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/sale-banner-design-template-da3c759d6c949d3333a3c73a02f481a7_screen.jpg?ts=1698314654',
  //   handle:'',
  //   region:'lk'
  // },
  // {
  //   id:'3',
  //   url:'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/summer-sale-linkedin-cover-design-template-835a57adf0c44e68f327639ffdbe0d5d_screen.jpg?ts=1626269575',
  //   handle:'',
  //   region:'lk'
  // },
  // {
  //   id:'4',
  //   url:'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/pink-cosmetic-store-facebook-shop-cover-design-template-c0f60562054ad1d1af934b0897bdf3d3_screen.jpg?ts=1707475241',
  //   handle:'',
  //   region:'lk'
  // }
]

export const metadata: Metadata = {
  title: "MG Store LK",
  description:
    "The online store for MG Store LK",
}

const getCollectionsWithProducts = async (
  countryCode: string
): Promise<ProductCollectionWithPreviews[] | null> => {
  const { collections } = await getCollectionsList(0, 3).then(
    (collections) => collections
  )

  if (!collections) {
    return null
  }

  const collectionIds = collections.map((collection) => collection.id)

  await Promise.all(
    collectionIds.map((id) =>
      getProductsList({
        queryParams: { collection_id: [id] },
        countryCode,
      })
    )
  ).then((responses) =>
    responses.forEach(({ response, queryParams }) => {
      let collection

      if (collections) {
        collection = collections.find(
          (collection) => collection.id === queryParams?.collection_id?.[0]
        )
      }

      if (!collection) {
        return
      }

      collection.products = response.products as unknown as Product[]
    })
  )

  return collections as unknown as ProductCollectionWithPreviews[]
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <div className="py-12">
        <ul className="flex flex-col gap-6">
          {dummy_banners && dummy_banners.length > 0 && <li className="content-container flex-1">
            <HomeBannerCarousel
              autoSlide
              autoSlideInterval={5000}
              items={
                dummy_banners.map((product,index) => (
                    <Container key={product.id} className="m-0 shadow-none aspect-[10/3] flex flex-col">
                      <Image
                        src={product.url}
                        priority={index <= 2 ? true : false}
                        className="relative inset-0 rounded-rounded"
                        alt={`Product image ${index + 1}`}
                        fill
                        style={{
                          objectFit: "fill",
                        }}
                      />
                    </Container>
                ))} 
              
              itemProps={dummy_banners.map((item,i)=>{
                return {
                  id:i,
                  url: item.url,
                  handle:''
                } as unknown as HomeBanner
              })}
              />
          </li>}
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
