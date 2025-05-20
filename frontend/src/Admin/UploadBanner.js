import { useState, useRef, useEffect } from "react";
import { Upload, Image, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { addBanner } from "../redux/notificationSlice";
export default function UploadBanner() {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const { loading, error, message } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setFileName(file.name);
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setFileName(file.name);
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", fileName);

    dispatch(addBanner(formData))
      .then((response) => {
        console.log("Banner added successfully", response);
      })
      .catch((error) => {
        console.error("Error adding banner:", error);
      });
    // Handle the upload here - typically you would send the file to a server
    alert(`File "${fileName}" ready for upload!`);
    // You can implement your upload logic here
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upload Banner
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              } ${previewUrl ? "bg-gray-50" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={previewUrl ? null : triggerFileInput}
            >
              {!previewUrl ? (
                <>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center mb-1">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </p>
                </>
              ) : (
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-h-64 overflow-hidden rounded-lg mb-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-600 truncate max-w-full">
                      {fileName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              {previewUrl && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Upload Banner
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
