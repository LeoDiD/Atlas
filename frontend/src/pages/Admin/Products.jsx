import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  MoreVertical,
  Coffee,
  PlusCircle,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import SidebarDB from "./components/SidebarDB";
import NotificationBell from "./components/NotificationBell";

const BACKEND_URL = "http://localhost:5000";

// Base64 placeholder image (1x1 gray pixel)
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ------- helpers ------- */
function CategoryBadge({ category }) {
  const map = {
    Coffee: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "Cold Brew": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Frappe: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    Pastry: "bg-pink-50 text-pink-700 ring-1 ring-pink-200",
    Tea: "bg-green-50 text-green-700 ring-1 ring-green-200",
    Default: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  };
  const cls = map[category] || map.Default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      <Package className="w-3.5 h-3.5" />
      {category || "Uncategorized"}
    </span>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Coffee",
    image: null,
  });
  const [togglingAvailability, setTogglingAvailability] = useState(null);

  /* ------------------- Load Products ------------------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/menu");
        if (mounted) setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  /* ------------------- Search Filter ------------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [products, q]);

  const formatPeso = (n) =>
    `₱${Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ------------------- Add/Edit Product Handler ------------------- */
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      if (editingProduct) {
        // Update existing product
        await axios.patch(`http://localhost:5000/api/menu/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        // Add new product
        await axios.post("http://localhost:5000/api/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }

      setShowModal(false);
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Coffee",
        image: null,
      });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product. Please try again.");
    }
  };

  /* ------------------- Delete Product Handler ------------------- */
  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/menu/${productId}`);
      toast.success(`${productName} deleted successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  /* ------------------- Edit Product Handler ------------------- */
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      image: null, // Don't set the file, only update if user selects new one
    });
    setShowModal(true);
  };

  /* ------------------- Toggle Availability Handler ------------------- */
  const handleToggleAvailability = async (productId, currentAvailability) => {
    setTogglingAvailability(productId);
    try {
      await axios.patch(`http://localhost:5000/api/menu/${productId}`, {
        available: !currentAvailability,
      });
      toast.success(
        !currentAvailability
          ? "Product marked as available"
          : "Product marked as unavailable"
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to toggle availability:", err);
      toast.error("Failed to update availability. Please try again.");
    } finally {
      setTogglingAvailability(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E2E1E6]">
      <SidebarDB />

      <main className="flex-1 p-6 ml-20 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#6B4226]/10 flex items-center justify-center">
              <Coffee className="h-5 w-5 text-[#6B4226]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Menu Inventory
              </h1>
              <p className="text-xs text-gray-500">
                Manage your coffee and beverage menu items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name or category…"
                className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4226]/30"
              />
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: "",
                  description: "",
                  price: "",
                  category: "Coffee",
                  image: null,
                });
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-[#6B4226] text-white text-sm hover:bg-[#55331f]"
            >
              <PlusCircle className="h-4 w-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Scrollable Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left font-medium px-4 py-3">#</th>
                  <th className="text-left font-medium px-4 py-3">Image</th>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Category</th>
                  <th className="text-left font-medium px-4 py-3">Description</th>
                  <th className="text-left font-medium px-4 py-3">Price</th>
                  <th className="text-center font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3 pr-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-16 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, index) => (
                    <tr key={p._id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <img
                          src={p.image ? `${BACKEND_URL}${p.image}` : PLACEHOLDER_IMAGE}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-4">
                        <CategoryBadge category={p.category} />
                      </td>
                      <td className="px-4 py-4 text-gray-600 truncate max-w-xs">
                        {p.description}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {formatPeso(p.price)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(p._id, p.available)}
                          disabled={togglingAvailability === p._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            p.available
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {togglingAvailability === p._id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : p.available ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                          {p.available ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-4 py-4 pr-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditProduct(p)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600">
              <span>Total products: {filtered.length}</span>
              <span>
                Inventory value:{" "}
                <strong>
                  {formatPeso(
                    filtered.reduce(
                      (sum, p) => sum + Number(p.price || 0),
                      0
                    )
                  )}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-lg p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-[#6B4226] mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4226]/30"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4226]/30"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4226]/30"
                      placeholder="₱"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4226]/30"
                    >
                      <option value="Coffee">Coffee</option>
                      <option value="Cold Brew">Cold Brew</option>
                      <option value="Frappe">Frappe</option>
                      <option value="Pastry">Pastry</option>
                      <option value="Tea">Tea</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {editingProduct && "(Leave empty to keep current)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editingProduct}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.files[0] })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4226]/30"
                  />
                  {editingProduct && editingProduct.image && (
                    <div className="mt-2">
                      <img 
                        src={editingProduct.image ? `${BACKEND_URL}${editingProduct.image}` : PLACEHOLDER_IMAGE} 
                        alt="Current" 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Current image</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                        setNewProduct({
                          name: "",
                          description: "",
                          price: "",
                          category: "Coffee",
                          image: null,
                        });
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#6B4226] text-white px-4 py-2 rounded-lg hover:bg-[#55331f] text-sm"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
