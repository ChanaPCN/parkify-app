"use client";
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import BackButton from "../components/BackButton";
import FileUpload from "../../config/fileUploadPro";
import { useRouter } from 'next/navigation';

export default function EditLessor() {
  const router = useRouter();
  const [lessorDetails, setLessorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const fileUploadRef = useRef(null); // Ref for FileUpload component

  const fieldLabels = {
    lessor_firstname: "First Name",
    lessor_lastname: "Last Name",
    lessor_phone_number: "Phone Number",
    lessor_line_url: "LINE URL",
  };

  useEffect(() => {
    const fetchLessorDetails = async () => {
      const lessorId = "9"; 
      try {
        const response = await fetch(`../api/fetchLessor?lessorId=${lessorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Error fetching data");
        setLessorDetails(data.lessorDetails || {});
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching lessor details");
      } finally {
        setLoading(false);
      }
    };
    fetchLessorDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const lessorId = "9";
  
    // Check if all fields have values in `lessorDetails`
    if (
      !lessorDetails.lessor_firstname &&
      !lessorDetails.lessor_lastname &&
      !lessorDetails.lessor_phone_number &&
      !lessorDetails.lessor_line_url
    ) {
      toast.error("Please fill in all fields");
      return;
    }
  
    try {
      let newImagePath = lessorDetails.lessor_image;
      const file = fileUploadRef.current?.files?.[0];
  
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("storageBucket", "lessor_image");
        formData.append("lessorId", lessorId);
  
        const uploadResponse = await fetch(`../api/uploadLessorPic`, {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("File upload failed:", errorText);
          throw new Error(errorText || "File upload failed");
        }
  
        const uploadResult = await uploadResponse.json();
        if (uploadResult && uploadResult.publicUrl) {
          newImagePath = uploadResult.publicUrl;
        }
      }
  
      const payload = {
        lessor_id: lessorId,
        lessor_image: newImagePath || lessorDetails.lessor_image,
        lessor_firstname: lessorDetails.lessor_firstname,
        lessor_lastname: lessorDetails.lessor_lastname,
        lessor_phone_number: lessorDetails.lessor_phone_number,
        lessor_line_url: lessorDetails.lessor_line_url,
      };
  
      const updateResponse = await fetch(`../api/fetchLessor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error("Update failed:", errorText);
        throw new Error(errorText || "Update failed");
      }
  
      toast.success("Lessor details updated successfully!");
    } catch (error) {
      toast.error("Error saving data");
      console.error("Save error:", error);
    }
  };
  
  
  

  const handleDelete = async () => {
    const lessorId = "9"; 
    try {
      const response = await fetch(`../api/fetchLessor?lessorId=${lessorId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed");

      toast.success("Account deleted successfully!");

      setTimeout(() => {
        router.push('/welcomelessor');
      }, 1000);
    } catch (error) {
      toast.error("Error deleting account");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = () => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this account?</p>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete();
              }}
              className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <BackButton targetPage="/setting"/>
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-5 py-4">
          Profile Setting
        </h1>
        <div className="flex flex-col items-center mt-20 ">
          <img
            src={lessorDetails.lessor_image || "profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-5"
          />

          {Object.keys(fieldLabels).map((field) => (
            <div
              key={field}
              className="flex items-center justify-between mb-4 w-full max-w-sm bg-gray-100 p-4 rounded-lg shadow-lg"
            >
              <label className="text-sm text-gray-400 w-1/3">
                {fieldLabels[field]}
              </label>
              <input
                type="text"
                name={field}
                value={lessorDetails[field] || ""}
                onChange={handleChange}
                className="text-gray-800 text-right w-2/3 focus:outline-none bg-transparent"
              />
              <FaEdit className="ml-2 text-gray-400" />
            </div>
          ))}

          <FileUpload
            ref={fileUploadRef}
            storageBucket="lessor_image"
            oldImagePath={lessorDetails.lessor_image}
          />

          <div className="flex justify-between w-full max-w-sm mt-5 space-x-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 mb-10"
            >
              SAVE
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 mb-10"
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
