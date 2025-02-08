// import Postproperty_images from "../postproperty_image_gallery/postproperty_images";
import  OpenPlot_ImageVerification from "../OpenPlot_ImageVerification/OpenPlot_ImageVerification"
const OpenPlaot_VideoVerification =()=>{
    return(
        <>
  {/* <h2 className="text-left mt-4 font-medium pl-[36px]">Upload Video</h2>
  <br/>
       

        <div id="second" className="w-10/12 ml-8">
       
     <div className="w-full  p-6 border border-gray-300 rounded-lg text-center shadow-md ml-10">
      <div className="mb-6">
        <div className="text-4xl text-gray-500">
          📷
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Add video to get better response
      </h3>
      <p className="text-m text-base " style={{color: '#B6B6B6'}}>
        maximum you can upload 3 Video
      </p>
      <p className="text-xs p-1 text-gray-600 mb-6">
        90% tenants contact on properties with photos.
      </p>
      <button 
        className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90"
        style={{ backgroundColor: '#FC6600' }}
      >
        Add Video
      </button>
    </div>
        </div> */}

<h2 className="text-left mt-4 font-medium pl-[36px]">Upload Video</h2>
<br />

<div id="second" className=" ml-8 flex justify-center">
  <div className="w-full sm:w-4/5 p-6 border border-gray-300 rounded-lg text-center shadow-md mx-auto ">
    <div className="mb-6">
      <div className="text-4xl text-gray-500">
        📷
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Add video to get better response
    </h3>
    <p className="text-m text-base" style={{ color: '#B6B6B6' }}>
      Maximum you can upload 3 Videos
    </p>
    <p className="text-xs p-1 text-gray-600 mb-6">
      90% tenants contact on properties with photos.
    </p>
    <div className="flex items-center gap-4 justify-center">
      <button 
        className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90 w-full sm:w-auto"
        style={{ backgroundColor: '#FC6600' }}
      >
        Add Video
      </button>
    </div>
  </div>
</div>

       
       




       



       {/* <h2 className="text-xs text-gray float-left">Photos uploaded by you (3)</h2> */}
       <br/>
       {/* <div className=" flex flex-column gap-8 justify-center p-3">
       <OpenPlot_ImageVerification/>
       <OpenPlot_ImageVerification/>
       <OpenPlot_ImageVerification/>


       </div> */}
       
       <div className="flex  justify-center p-3 pb-8 overflow-x-auto sm:overflow-x-hidden">
  <div className="flex-none w-full sm:w-1/3 md:w-1/4 lg:w-1/4">
    <OpenPlot_ImageVerification />
  </div>
  <div className="flex-none w-full sm:w-1/3 md:w-1/4 lg:w-1/4">
    <OpenPlot_ImageVerification />
  </div>
  <div className="flex-none w-full sm:w-1/3 md:w-1/4 lg:w-1/4">
    <OpenPlot_ImageVerification />
  </div>
</div>



   





                  
   
        </>
    )
}

export default OpenPlaot_VideoVerification;