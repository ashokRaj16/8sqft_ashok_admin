import React from 'react'
import Hero from './Hero'
import GrowYourBusiness from './GrowYourBusiness'
import BuilderSpotlight from './BuilderSpotlight'
import WhyChooseUs from './WhyChooseUs'
import OurValue from './OurValue'
import SoldProperty from './SoldProperty'

const OurStory: React.FC = () => {
  return (
    <>
   <div className="lg:space-y-10 space-y-2">
   <Hero />
 <GrowYourBusiness/>
        <BuilderSpotlight/>
       <SoldProperty/>
      <WhyChooseUs/>
       <OurValue/>
   </div>
    </>
  )
}

export default OurStory