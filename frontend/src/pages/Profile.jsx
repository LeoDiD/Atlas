import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Share2,
  MoreHorizontal,
  BadgeCheck,
  UserRound,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joinedDate: "",
    role: "",
    avatar: "",
    verified: false,
  });
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userData = {
      name: currentUser.name || "Guest User",
      email: currentUser.email || "guest@example.com",
      phone: currentUser.phone || "Not provided",
      address: currentUser.address || "Yerevan, Armenia",
      joinedDate: currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "April 2023",
      role: currentUser.role || "UX/UI Designer, 4+ years of experience",
      avatar:
        currentUser.avatar ||
        "", // leave empty to fallback to initial
      verified: Boolean(currentUser.verified), // set true in localStorage if needed
    };
    setUserInfo(userData);
    setEditedInfo(userData);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo({ ...userInfo });
  };
  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = {
      ...currentUser,
      name: editedInfo.name,
      phone: editedInfo.phone,
      address: editedInfo.address,
      role: editedInfo.role,
      avatar: editedInfo.avatar,
      verified: editedInfo.verified,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubscribe = () => navigate("/membership");

  const handle =
    userInfo.name?.trim() !== ""
      ? `@${userInfo.name.toLowerCase().replace(/\s+/g, ".")}`
      : "@username";

  return (
    <div className="min-h-screen bg-[#E2E1E6]">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-xl mx-auto">
            {/* Profile Card (hero) */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
              {/* Banner */}
              <div
                className="h-28 w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #9EA7FF 0%, #B3E5FC 100%)",
                }}
              />

              {/* Action icons */}
              <div className="absolute right-3 top-3 flex items-center gap-1">
                <button
                  className="p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white border border-gray-200"
                  title="Share"
                >
                  <Share2 className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  className="p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white border border-gray-200"
                  title="More"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              {/* Avatar (overlapping) */}
              <div className="flex flex-col items-center -mt-10 pb-6 px-6">
                <div className="h-20 w-20 rounded-full ring-4 ring-white bg-gray-100 overflow-hidden flex items-center justify-center">
                  {userInfo.avatar ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={userInfo.avatar}
                      alt="Profile photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-gray-600">
                      {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                {/* Handle */}
                <div className="mt-2 text-xs text-gray-500">{handle}</div>

                {/* Name + Verified */}
                <div className="mt-1 flex items-center gap-1">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {userInfo.name}
                  </h1>
                  {userInfo.verified && (
                    <BadgeCheck className="h-5 w-5 text-indigo-500" />
                  )}
                </div>

                {/* Role line */}
                <p className="mt-1 text-sm text-gray-600 text-center">
                  {userInfo.role}
                </p>

                {/* Meta: location + joined */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {userInfo.address}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {userInfo.joinedDate}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleSubscribe}
                    className="px-4 py-2 rounded-xl bg-fuchsia-500 text-white text-sm font-medium hover:brightness-95 active:brightness-90"
                  >
                    Subscribe
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-xl border text-sm font-medium text-gray-700 border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Edit profile
                  </button>
                </div>

                {/* Tiny utilities row */}
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {userInfo.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 hover:text-rose-600"
                    title="Logout"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold">Edit profile</h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Field
                    label="Full Name"
                    value={editedInfo.name}
                    onChange={(v) => setEditedInfo({ ...editedInfo, name: v })}
                  />
                  <Field
                    label="Role / Headline"
                    value={editedInfo.role}
                    onChange={(v) => setEditedInfo({ ...editedInfo, role: v })}
                  />
                  <Field
                    label="Phone"
                    value={editedInfo.phone}
                    onChange={(v) => setEditedInfo({ ...editedInfo, phone: v })}
                  />
                  <Field
                    label="Location"
                    value={editedInfo.address}
                    onChange={(v) =>
                      setEditedInfo({ ...editedInfo, address: v })
                    }
                  />
                  <Field
                    label="Avatar URL"
                    value={editedInfo.avatar}
                    onChange={(v) =>
                      setEditedInfo({ ...editedInfo, avatar: v })
                    }
                    placeholder="https://…"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      id="verified"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={editedInfo.verified}
                      onChange={(e) =>
                        setEditedInfo({
                          ...editedInfo,
                          verified: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="verified" className="text-sm text-gray-700">
                      Show verified badge
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl border text-sm border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4 inline-block mr-1" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/** Small input field component */
function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-600">{label}</span>
      <input
        type="text"
        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
