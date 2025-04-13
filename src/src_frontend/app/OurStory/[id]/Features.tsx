import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import PaneGallery from './Test';

export default function Features() {
 
 
  
  const [openSection, setOpenSection] = useState(0);

    return (
        <div className='text-white bg-[#564736]'>
            <div className='text-center'>
                <h1 className='text-4xl'>Where Vibrance Meets Comfort</h1>
                <p className='text-lg'>Step into homes crafted with thoughtful layouts, expansive designs, and balconies that open to breathtaking views. Adorned with exquisite furnishings, life at Yashraj Nakshatra promises an experience as dazzling as the stars themselves.</p>
            </div>
            <PaneGallery/>
          
        </div>
    )
}
