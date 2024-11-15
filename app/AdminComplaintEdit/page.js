"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import supabase from "../../config/supabaseClient";
import { FaSave, FaTrashAlt, FaPlus, FaPen } from "react-icons/fa";

const CustomerComplaintEdit = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    complain_id: "",
    complain: "",
    detail: "",
    submitter_id: "",
    user_type: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch complaint data
  useEffect(() => {
    const complainId = sessionStorage.getItem("complain_id");
    if (!complainId) {
      toast.error("Complaint ID not found");
      router.push("/CustomerComplaint");
      return;
    }

    const fetchComplaintData = async () => {
      try {
        const { data, error } = await supabase
          .from("complain")
          .select("*")
          .eq("complain_id", complainId)
          .single();

        if (error) {
          console.error("Error fetching complaint data:", error);
          toast.error("Failed to fetch complaint data.");
          router.push("/CustomerComplaint");
        } else {
          setFormData({
            complain_id: data.complain_id,
            complain: data.complain,
            detail: data.detail,
            submitter_id: data.submitter_id,
            user_type: data.user_type,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching complaint data:", error);
        toast.error("An error occurred while fetching data.");
        router.push("/CustomerComplaint");
      }
    };

    fetchComplaintData();
  }, [router]);

  // Handle save click
  const handleSaveClick = async () => {
    try {
      const { error } = await supabase
        .from("complain")
        .update({
          complain: formData.complain,
          detail: formData.detail,
          user_type: formData.user_type,
        })
        .eq("complain_id", formData.complain_id);

      if (error) {
        console.error("Error updating complaint data:", error);
        toast.error("Failed to update complaint information.");
      } else {
        toast.success("Complaint information updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving complaint data:", error);
      toast.error("An error occurred while saving data.");
    }
  };

  // Handle delete click
  const handleDeleteClick = () => {
    const toastId = toast(
      <div>
        <p>Are you sure you want to delete this complaint?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => confirmDelete(true, toastId)}
            className="bg-red-500 text-white px-3 py-1 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  // Confirm delete
  const confirmDelete = async (isConfirmed, toastId) => {
    if (isConfirmed) {
      try {
        const { error } = await supabase
          .from("complain")
          .delete()
          .eq("complain_id", formData.complain_id);

        if (error) {
          console.error("Error deleting complaint:", error);
          toast.error("Failed to delete complaint.");
        } else {
          toast.success("Complaint deleted successfully");
          router.push("/CustomerComplaint");
        }
      } catch (error) {
        console.error("Error deleting complaint:", error);
        toast.error("An error occurred while deleting data.");
      }
    }
    toast.dismiss(toastId);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <Toaster />
      <button
        onClick={() => router.push("/CustomerComplaint")}
        className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex justify-between mb-4 mt-16">
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <FaTrashAlt /> <span>Delete</span>
        </button>
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <FaSave /> <span>Save</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <FaPen />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Complaint Details */}
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Complaint ID</label>
        <input
          type="text"
          name="complain_id"
          value={formData.complain_id}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Complaint</label>
        <input
          type="text"
          name="complain"
          value={formData.complain}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Detail</label>
        <textarea
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Submitter ID</label>
        <input
          type="text"
          name="submitter_id"
          value={formData.submitter_id}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">User Type</label>
        <input
          type="text"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>

      {/* Button to add a new issue */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => router.push("/AdminAddIssue")}
          className="bg-green-500 hover:bg-green-700 text-white font-semibold text-lg px-5 py-2 rounded-lg shadow-md flex items-center space-x-2 transition duration-200 ease-in-out"
        >
          <FaPlus className="text-xl" />
          <span>Add New Issue for Developer</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerComplaintEdit;