// import Dropdown from "../Dropdown/Dropdown";
// import Postproperty_images from "../postproperty_image_gallery/postproperty_images";
import OpenPlot_ImageVerification from "../OpenPlot_ImageVerification/OpenPlot_ImageVerification"
const OpenPlot_gallery_verification = () => {
  return (
    <>
      {/* <h2 className="text-left   mt-[20px] font-medium pl-[36px]">Upload Photos <span style={{ color: "#A4A4A4;" }}>(by selecting category)</span></h2>



      <div id="main" className="p-7   flex justify-center  font-sans">
       
        <div id="second" className="w-10/12 flex justify-center">


          <div style={{ backgroundColor: '#F8F8F8' }} className="   w-4/5 p-6 border border-gray-300 rounded-lg text-center shadow-md">
            <div className="mb-6">
              <div className="text-4xl text-gray-500">
                📷
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Add photos to get better response
            </h3>

            <p className="text-xs p-1 text-gray-600 mb-6">
              90% tenants contact on properties with photos.
            </p>




          

            <div className="flex items-center gap-4 justify-center">
             
              <select
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90 text-sm"

              >
                <option selected disabled className="text-black bg-opacity-30" value="">
                  Select type
                </option>
                <option>Main Image</option>
                <option>Cabin</option>
                <option>Office</option>
                <option>Shop</option>
                <option>Lobby</option>
                <option>Lift</option>
                <option>Building Outer View</option>
                <option>Parking</option>
                <option>Other</option>
              </select>


              <button
                className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90"
                style={{ backgroundColor: '#FC6600' }}
              >
                Upload Photos
              </button>
            </div>




          </div>
        </div>

      </div> */}
   <h2 className="text-left mt-[20px] font-medium pl-[36px]">Upload Photos <span style={{ color: "#A4A4A4;" }}>(by selecting category)</span></h2>

<div id="main" className="p-7 flex justify-center font-sans">
  <div id="second" className="w-10/12 flex justify-center">
    <div style={{ backgroundColor: '#F8F8F8' }} className="w-full sm:w-4/5 p-6 border border-gray-300 rounded-lg text-center shadow-md">
      <div className="mb-6">
        <div className="text-4xl text-gray-500">
          📷
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Add photos to get better response
      </h3>

      <p className="text-xs p-1 text-gray-600 mb-6">
        90% tenants contact on properties with photos.
      </p>

      <div className="flex items-center gap-4 justify-center">
        <select
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90 text-sm w-full sm:w-auto"
        >
          <option selected disabled className="text-black bg-opacity-30" value="">
            Select type
          </option>
          <option>Main Image</option>
          <option>Kitchen</option>
          <option>Office</option>
          <option>Bedroom</option>
          <option>Dining Hall</option>
          <option>Drawing Room</option>
          <option>Main Hall</option>
          <option>Bathroom</option>
          <option>Lobby</option>
          <option>Study</option>
          <option>Balcony</option>
          <option>Floor Plan</option>
          <option>Utilities</option>
          <option>Outside View</option>
          <option>Other</option>
        </select>

        <button
          className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90"
          style={{ backgroundColor: '#FC6600' }}
        >
          Upload Photos
        </button>
      </div>
    </div>
  </div>
</div>







      {/* <div className=" flex flex-column   gap-8 justify-center p-3 pb-8">
        <OpenPlot_ImageVerification />
        <OpenPlot_ImageVerification />
        <OpenPlot_ImageVerification />
        <OpenPlot_ImageVerification />
        <OpenPlot_ImageVerification />

      </div> */}
      {/* <div className="flex flex-wrap gap-8 justify-center p-3 pb-8">
  <div className="w-full sm:w-1/2 lg:w-auto flex justify-center">
    <OpenPlot_ImageVerification />
  </div>
  <div className="w-full sm:w-1/2 lg:w-auto flex justify-center">
    <OpenPlot_ImageVerification />
  </div>
  <div className="w-full sm:w-1/2 lg:w-auto flex justify-center">
    <OpenPlot_ImageVerification />
  </div>
  <div className="w-full sm:w-1/2 lg:w-auto flex justify-center">
    <OpenPlot_ImageVerification />
  </div>
  <div className="w-full sm:w-1/2 lg:w-auto flex justify-center">
    <OpenPlot_ImageVerification />
  </div>
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
  <div className="flex-none w-full sm:w-1/3 md:w-1/4 lg:w-1/4">
    <OpenPlot_ImageVerification />
  </div>
  <div className="flex-none w-full sm:w-1/3 md:w-1/4 lg:w-1/4">
    <OpenPlot_ImageVerification />
  </div>
</div>





      <hr />


    </>
  )
}

export default OpenPlot_gallery_verification;