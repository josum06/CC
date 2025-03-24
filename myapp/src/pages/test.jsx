 {/* ID Card Photo */}
 <div className="flex flex-col items-center">
 <label className="text-sm font-medium mb-2">College ID Card *</label>
 <div
   className="relative w-72 h-48 rounded-lg border-2 border-gray-300 hover:shadow-lg transition"
 >
   <input
     type="file"
     accept="image/*"
     className="absolute inset-0 opacity-0 cursor-pointer"
     onChange={(e) => handleFileChange(e, setIdCardPhoto)}
     required
   />
   {idCardPhoto ? (
     <img
       src={idCardPhoto}
       alt="ID Card"
       className="w-full h-full object-cover"
     />
   ) : (
     <div className="flex items-center justify-center h-full text-gray-500">
       <UploadCloud size={40} />
     </div>
   )}
   {idCardPhoto && (
     <button
       onClick={() => removeImage(setIdCardPhoto)}
       className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
       style={{ transform: "translate(50%, -50%)" }}
     >
       <X size={18} />
     </button>
   )}
 </div>
</div>
</div>