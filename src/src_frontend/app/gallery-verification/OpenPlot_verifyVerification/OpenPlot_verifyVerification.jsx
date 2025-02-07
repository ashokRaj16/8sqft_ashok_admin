// import Dropdown from "../Dropdown/Dropdown";
// import Postproperty_images from "../postproperty_image_gallery/postproperty_images";
import OpenPlot_ImageVerification from "../OpenPlot_ImageVerification/OpenPlot_ImageVerification"

const OpenPlot_verifyVerification =()=>{
  
    return(
        <>
        <hr/>
        {/* <h2 className="text-left mt-4 font-medium pl-[36px]">Verify your property</h2>
       <div id="main" className="p-7 flex justify-evenly font-sans">
       


        
        <div id="second" className="w-10/12 flex justify-center">
       

  <div style={{backgroundColor:"#F8F8F8;"}} className="   w-4/5 p-6 border border-gray-300 rounded-lg text-center shadow-md">
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

<h2 className="text-left mt-4 font-medium pl-[36px]">Verify your property</h2>

<div id="main" className="p-7 c font-sans">
  <div id="second" className="w-full sm:w-10/12 flex justify-center">
    <div style={{ backgroundColor: "#F8F8F8" }} className="w-full sm:w-4/5 p-6 border border-gray-300 rounded-lg text-center shadow-md">
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

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <select
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90 text-sm w-full sm:w-auto"
        >
          <option selected disabled className="text-black bg-opacity-30" value="">
            Select type
          </option>
          <option>Light Bill</option>
          <option>Property Tax</option>
          <option>Water Bill</option>
          <option>Property Agreement</option>
          <option>Power of Attorney</option>
          <option>Lift</option>
          <option>Building Outer View</option>
          
        </select>

        <button
          className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90 w-full sm:w-auto mt-4 sm:mt-0"
          style={{ backgroundColor: '#FC6600' }}
        >
          Upload Photos
        </button>
      </div>
    </div>
  </div>
</div>




       
       <div className=" flex flex-column gap-8 justify-center p-3">
       < OpenPlot_ImageVerification/>


       </div>
       
<div className="flex flex-row gap-4 justify-center items-center p-6">
  <button
    type="button"
    className="min-w-[100px] py-1 px-4 bg-black text-white rounded-full text-sm"
  >
    BACK
     </button>



<button style={{ backgroundColor: '#FC6600' }}
 className=" min-w-[100px] py-1 px-4 bg-primary text-white rounded-full text-sm ">
  SAVE & NEXT
  </button>
</div>
                  
   
        </>
    )
}

export default OpenPlot_verifyVerification;