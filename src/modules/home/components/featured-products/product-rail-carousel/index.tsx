"use client"
import { Region } from "@medusajs/medusa"
import { IconButton } from "@medusajs/ui"
import { useSpringCarousel } from 'react-spring-carousel'
import ArrowLeftCircleFill from "@modules/common/icons/arrow-fill-left"
import ArrowRightCircleFill from "@modules/common/icons/arrow-fill-right"
import { useEffect, useRef, useState } from "react"

type ImageGalleryProps = {
  items: JSX.Element[]
  region: Region
}

const ProductRailCarousel = ({ items, region, ...props }: ImageGalleryProps & React.HTMLProps<HTMLDivElement>) => {
  const [itemsPerSlide, setItemsPerSlide] = useState(1)
  const carouselWrapperParent = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const getItemsPerSlide = (): void => {
      if(!carouselWrapperParent.current) return
      const windowWidth = window?.screen?.width;
      const carouselItem = carouselWrapperParent.current.getElementsByClassName("use-spring-carousel-item")?.item(0)
      if(!carouselItem || !windowWidth) return;
      const itemWidth = carouselItem.clientWidth? carouselItem.clientWidth: 1
      const maxItems = Math.floor(windowWidth/itemWidth)
      setItemsPerSlide(maxItems > 0? maxItems: 1);
    };
    getItemsPerSlide()
  }, [items, window?.screen?.width])

    const { 
        carouselFragment, 
        slideToPrevItem, 
        slideToNextItem
      } = useSpringCarousel({
        enableFreeScrollDrag:true,
        slideType:'fluid',
        items: items.map((item, index) => ({
          id: item.props?.id,
          renderItem: item
        }))
      }); 
  
  return (
    <div className="flex items-start relative" ref={carouselWrapperParent}>
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4 overflow-hidden">
        <div>
          <div className="relative">
            {items.length > itemsPerSlide &&<IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 left-0  z-10 border-none rounded-full" onClick={slideToPrevItem}>
              <ArrowLeftCircleFill size={25} />
            </IconButton>}
            <div className="mx-auto">
              {carouselFragment}
            </div>
            {items.length > itemsPerSlide &&<IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 right-0  z-10 border-none rounded-full" onClick={slideToNextItem}>
              <ArrowRightCircleFill size={25} />
            </IconButton>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductRailCarousel
