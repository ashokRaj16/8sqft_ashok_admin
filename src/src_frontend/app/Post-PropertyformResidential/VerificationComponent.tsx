

// import Dropdown from "../Dropdown/Dropdown";

const VerificationComponent =()=>{
 return(
 <>

 <div id="main" className="p-7 flex justify-evenly font-sans">
 <div id="first" className="rounded-none border-b-[3px] h-8 text-opacity-100 text-gray bottom-2">

 <select className="">
 <option className=" text-black bg-opacity-30 hover:bg-primary-light">Select type</option>
 <option>Main image</option>
 <option>Cabin </option>
 <option>Office</option>
 <option>Shop</option>
 <option>Lobby</option>
 <option>Lift</option>
 <option>Building Outer View</option>
 <option>Parking</option>
 <option>Other</option>

 </select>
 <div >
 {/* <img alt="image"/> */}
 </div>
 </div>
 <div id="second">
 
 {/* <img alt="camera image"/> */}
 {/* <h1 className="font-semibold text-xl p-1">Add photos to get better response</h1>
 <h4 className="text-gray-dark text-base p-2">maximum you can upload 25 photos</h4>
 <h5 className="text-xs p-1">90% tenants contact on properties with photos</h5>
 <button className="bg-primary text-base text-secondary-50 m-4 p-2 rounded-sm" >Add photos</button> */}
 
 <div className="w-full max-w-sm mx-auto p-6 border border-gray-300 rounded-lg text-center shadow-md">
 <div className="mb-6">
 <div className="text-4xl text-gray-500">
📷
 </div>
 </div>
 <h3 className="text-lg font-semibold text-gray-800 mb-2">
 Add photos to get better response
 </h3>
 <p className="text-m text-base " style={{color: '#B6B6B6'}}>
 maximum you can upload 25 photos
 </p>
 <p className="text-xs p-1 text-gray-600 mb-6">
 90% tenants contact on properties with photos.
 </p>
 <button 
 className="px-6 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400 hover:opacity-90"
 style={{ backgroundColor: '#FC6600' }}
 >
 Add Photos
 </button>
 </div>
 </div>
 
 </div>
 <div className=" flex flex-column gap-8 justify-center p-3">
 {/* <Postproperty_images/>
 <Postproperty_images/>
 <Postproperty_images/>
 <Postproperty_images/>
 <Postproperty_images/> */}

 </div>
 
 
 
 </>
 )
}

export default VerificationComponent;