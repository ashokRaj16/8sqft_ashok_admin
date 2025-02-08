


const OpenPlot_ImageVerification = () =>{
    return (
        <>
            <div>

  <div className="border border-gray-300 rounded-lg w-40 overflow-hidden shadow-md">

      <div className="w-full h-32">
        <img src="\assets\postproperty\property_img.png" alt="property image" className="w-full h-full object-cover" />
      </div>

    
      <div className="flex justify-center items-center align-middle  px-2 py-1 border-t border-gray-300 bg-white">
        <input 
          type="text"
          value="Balcony"
          readOnly
          className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none "
        />
       <button className="  h-50 float-right"><img className="h-1/4" src="\assets\postproperty\del_btn.png"  height="10px" width="20px" alt="Delete button"/></button>
      </div>

 
 </div>
            </div>
        </>
    )
}

export default OpenPlot_ImageVerification;