"use client"
import { IconButton } from "@medusajs/ui"
import { useSpringCarousel } from 'react-spring-carousel'
import ArrowLeftCircleFill from "@modules/common/icons/arrow-fill-left"
import ArrowRightCircleFill from "@modules/common/icons/arrow-fill-right"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export type HomeBanner = {
  id: string;
  url: string;
  handle: string;
}

type HomeBannerProps = {
  items: JSX.Element[]
  itemProps: HomeBanner[]
  autoSlide: boolean  | undefined
  autoSlideInterval: number | undefined
}

const HomeBannerCarousel = ({ items, itemProps, autoSlide, autoSlideInterval, ...props }: HomeBannerProps & React.HTMLProps<HTMLDivElement>) => {
  const [itemsPerSlide, setItemsPerSlide] = useState(1)
  const carouselWrapperParent = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const getItemsPerSlide = (): void => {
      if(!carouselWrapperParent?.current) return;
      const windowWidth = window?.screen?.width;
      const carouselItem = carouselWrapperParent.current.getElementsByClassName("use-spring-carousel-item")?.item(0)
      if(!carouselItem || !windowWidth) return;
      const itemWidth = carouselItem.clientWidth? carouselItem.clientWidth: 1
      const maxItems = Math.floor(windowWidth/itemWidth)
      setItemsPerSlide(maxItems > 0? maxItems: 1);
    };
    getItemsPerSlide()
  }, [items])

    const { 
        carouselFragment, 
        thumbsFragment,
        slideToPrevItem, 
        slideToNextItem,
        slideToItem
      } = useSpringCarousel({
        withThumbs: true, 
        withLoop: true,
        itemsPerSlide:1,
        initialActiveItem:0,
        items: items.map((item, index) => ({
          id: item.props?.id,
          renderItem: item,
          renderThumb: (
            <IconButton key={itemProps[index].id} id={itemProps[index].id}
              onClick={() => slideToItem(itemProps[index].id)} 
              size="xlarge" 
              className="mr-2 rounded-rounded hover:border-2 active:border-2 focus:outline-none focus:border-2" >
              <Image
                src={itemProps[index].url}
                priority={index <= 2 ? true : false}
                className=""
                alt={`Product image ${index + 1}`}
                fill
                style={{
                  objectFit: "cover",
                }}
                />
            </IconButton>
          )
        }))
      }); 

      useEffect(()=>{
        if(!autoSlide || !autoSlideInterval) return
        const timerID = setInterval(slideToNextItem, autoSlideInterval)

        return () =>clearInterval(timerID)
      }, [])

  return (
    <div className="flex items-start relative" ref={carouselWrapperParent}>
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4 overflow-hidden">
        <div>
          <div className="relative">
          {items.length > itemsPerSlide &&<IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 left-0  z-10 border-none rounded-full" onClick={slideToPrevItem}>
              <ArrowLeftCircleFill size={25} />
            </IconButton>}
            {carouselFragment}
            {items.length > itemsPerSlide &&<IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 right-0  z-10 border-none rounded-full" onClick={slideToNextItem}>
              <ArrowRightCircleFill size={25} />
            </IconButton>}
          </div>
        </div>
        {thumbsFragment}
      </div>
    </div>
  )
}

export default HomeBannerCarousel
