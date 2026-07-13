import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaHistory, FaSignOutAlt, FaSave, FaChartBar, FaPlus, FaTimes, FaCheckCircle, FaBoxOpen, FaTruck, FaEnvelope, FaMapMarkerAlt, FaPhone, FaChevronRight, FaDollarSign, FaChartLine, FaArrowDown, FaLock, FaGlobe, FaEdit, FaTrash, FaShoppingBag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Alert from "../Components/Alert";
import { useFirebase, isAdminUser } from "../hooks/useFirebaseContext";
import { useStore } from "../hooks/useStore";
import { supabase } from "../src/constant/supabase.config";
import { Product, shoesCatalog } from "../src/constant/products";
import { SkeletonCard, SkeletonTableRow, SkeletonKPI } from "../Components/SkeletonLoader";

interface Transaction {
  id: string;
  email: string;
  date: string;
  product: string;
  amount: number;
  cogs: number;
  freight: number;
  status: string;
}

interface ActivityLog {
  id: string;
  email: string;
  type: string;
  timestamp: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useFirebase();
  const { catalog, addCatalogProduct, deleteCatalogProduct, updateCatalogProduct, profile, updateProfile } = useStore();

  const isAdmin = isAdminUser(user?.email);

  const [activeTab, setActiveTab] = useState<"info" | "orders" | "admin">("info");
  const [adminSubTab, setAdminSubTab] = useState<"overview" | "products" | "transactions">("overview");

  // 3D Perspective Card Tilt references
  const memberCardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!memberCardRef.current) return;
    const rect = memberCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Smooth tilt (max 10 degrees)
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 10;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    memberCardRef.current.style.setProperty("--shine-x", `${x}px`);
    memberCardRef.current.style.setProperty("--shine-y", `${y}px`);
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Automatically switch tab if router state requests it (e.g. from /admin or checkout redirect)
  useEffect(() => {
    if (location.state && (location.state as any).tab) {
      const targetTab = (location.state as any).tab;
      if (targetTab === "admin" && isAdmin) {
        setActiveTab("admin");
      } else if (targetTab === "orders") {
        setActiveTab("orders");
      }
    }
  }, [location.state, isAdmin]);

  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Order Tracker Modal States
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrder, setTrackerOrder] = useState<Transaction | null>(null);
  const [trackerStep, setTrackerStep] = useState(1);

  // Edit Transaction Modal States
  const [isEditTxOpen, setIsEditTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTxEmail, setEditTxEmail] = useState("");
  const [editTxProduct, setEditTxProduct] = useState("");
  const [editTxAmount, setEditTxAmount] = useState("");
  const [editTxStatus, setEditTxStatus] = useState("Pending");

  // Add Product Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Running");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImage, setNewProdImage] = useState("/images/image_17.png");
  const [newProdDescription, setNewProdDescription] = useState("");

  // Edit Product Modal States
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdTitle, setEditProdTitle] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("Running");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdDescription, setEditProdDescription] = useState("");

  const handleOpenTracker = (order: Transaction) => {
    setTrackerOrder(order);
    setIsTrackerOpen(true);

    if (order.status === "Processing") {
      setTrackerStep(1);

      // Simulate tracking stages (Placed -> Packed -> Shipped)
      const t1 = setTimeout(() => setTrackerStep(2), 2000);
      const t2 = setTimeout(() => setTrackerStep(3), 4000);

      (window as any)._trackerTimeouts = [t1, t2];
    } else {
      setTrackerStep(3); // Already Completed or Shipped
    }
  };

  const handleCloseTracker = async () => {
    setIsTrackerOpen(false);

    if ((window as any)._trackerTimeouts) {
      (window as any)._trackerTimeouts.forEach(clearTimeout);
      (window as any)._trackerTimeouts = null;
    }

    // If order was in Processing and user waited until step 3, mark as Completed
    if (trackerOrder && trackerOrder.status === "Processing" && trackerStep === 3) {
      try {
        const { error } = await supabase
          .from("transactions")
          .update({ status: "Completed" })
          .eq("id", trackerOrder.id);

        if (error) {
          console.error("Failed to complete transaction in tracker:", error);
        } else {
          await refreshUserOrders();
          await refreshAdminTransactions();
        }
      } catch (err) {
        console.error("Error closing transaction:", err);
      }
    }

    setTrackerOrder(null);
  };

  // ── Transaction Manager Actions ───────────────────────────────────
  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setEditTxEmail(tx.email);
    setEditTxProduct(tx.product);
    setEditTxAmount(tx.amount.toString());
    setEditTxStatus(tx.status);
    setIsEditTxOpen(true);
  };

  const handleCloseEditTx = () => {
    setIsEditTxOpen(false);
    setEditingTx(null);
  };

  const handleSaveEditTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    const amountNum = parseFloat(editTxAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAlertMessage("Please enter a valid positive amount.");
      setShowAlert(true);
      return;
    }

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          email: editTxEmail,
          product: editTxProduct,
          amount: amountNum,
          status: editTxStatus
        })
        .eq("id", editingTx.id);

      if (error) throw error;

      setAlertMessage(`Transaction ${editingTx.id} updated successfully!`);
      setShowAlert(true);
      setIsEditTxOpen(false);
      setEditingTx(null);
      await refreshAdminTransactions();
      await refreshUserOrders();
    } catch (err) {
      console.error("Failed to update transaction:", err);
      setAlertMessage("Failed to save transaction modifications.");
      setShowAlert(true);
    }
  };

  const handleDeleteTx = async (txId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete transaction ${txId}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", txId);

      if (error) throw error;

      setAlertMessage(`Transaction ${txId} successfully deleted.`);
      setShowAlert(true);
      await refreshAdminTransactions();
      await refreshUserOrders();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setAlertMessage("Failed to delete the selected transaction.");
      setShowAlert(true);
    }
  };


  // ── Product Manager Actions ───────────────────────────────────────
  const handleOpenAddProduct = () => {
    setNewProdTitle("");
    setNewProdCategory("Running");
    setNewProdPrice("");
    setNewProdImage("/images/image_17.png");
    setNewProdDescription("");
    setIsAddProductOpen(true);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle.trim() || !newProdPrice.trim()) {
      setAlertMessage("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setAlertMessage("Please enter a valid price amount.");
      setShowAlert(true);
      return;
    }

    // Auto-generate ID larger than any current catalog ID
    const nextId = catalog.length > 0 ? Math.max(...catalog.map((item) => item.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      title: newProdTitle,
      category: newProdCategory as any,
      color: "3 COLORS AVAILABLE",
      price: `$${priceNum.toFixed(2)}`,
      rating: 4.5,
      reviews: 1,
      image: newProdImage,
      images: [newProdImage, "/images/image_20.png", "/images/image_18.png"],
      colors: [
        { name: "Varsity Gold", hex: "#EAB308" },
        { name: "Obsidian Black", hex: "#111111" }
      ],
      sizes: [7, 8, 9, 10, 11, 12],
      description: newProdDescription || "Premium high-performance athletic footwear designed to support daily activities and sprints.",
      features: [
        "Plush ankle cushioning provides daily security.",
        "Energy returning foam cores absorb road impacts.",
        "Heavy traction rubber tread grips surfaces securely."
      ]
    };

    addCatalogProduct(newProduct);
    setAlertMessage(`Product "${newProdTitle}" added to store catalog!`);
    setShowAlert(true);
    setIsAddProductOpen(false);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdTitle(prod.title);
    setEditProdCategory(prod.category);
    setEditProdPrice(prod.price.replace("$", ""));
    setEditProdDescription(prod.description);
    setIsEditProductOpen(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdTitle.trim() || !editProdPrice.trim()) {
      setAlertMessage("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }

    const priceNum = parseFloat(editProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setAlertMessage("Please enter a valid price.");
      setShowAlert(true);
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      title: editProdTitle,
      category: editProdCategory as any,
      price: `$${priceNum.toFixed(2)}`,
      description: editProdDescription
    };

    updateCatalogProduct(updatedProduct);
    setAlertMessage(`Product "${editProdTitle}" successfully updated!`);
    setShowAlert(true);
    setIsEditProductOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (prodId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    deleteCatalogProduct(prodId);
    setAlertMessage(`Product "${title}" deleted from catalog.`);
    setShowAlert(true);
  };

  // Admin Dashboard Transactions State — starts empty; real data from Supabase
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userOrders, setUserOrders] = useState<Transaction[]>([]);

  // Loading & error states for data fetching
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Pagination state for admin transactions
  const TX_PAGE_SIZE = 20;
  const [txPage, setTxPage] = useState(0);
  const [hasMoreTx, setHasMoreTx] = useState(true);
  const [isLoadingMoreTx, setIsLoadingMoreTx] = useState(false);

  // Activity log collapsible state
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  // ── Reusable Data Fetchers ──────────────────────────────────────────
  const TX_COLUMNS = "id, email, date, product, amount, cogs, freight, status";

  const mapTx = (tx: any): Transaction => ({
    id: tx.id,
    email: tx.email,
    date: tx.date,
    product: tx.product,
    amount: tx.amount,
    cogs: tx.cogs,
    freight: tx.freight,
    status: tx.status,
  });

  const refreshUserOrders = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(TX_COLUMNS)
        .eq("uid", user.uid)
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) {
        setUserOrders(data.map(mapTx));
      }
    } catch (err) {
      console.error("Failed to refresh user orders:", err);
    }
  };

  const refreshAdminTransactions = async () => {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(TX_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!error && data) {
        setTransactions(data.map(mapTx));
      }
    } catch (err) {
      console.error("Failed to refresh admin transactions:", err);
    }
  };

  // Load current user's personal order history from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchUserOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("id, email, date, product, amount, cogs, freight, status")
          .eq("uid", user.uid)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          setOrdersError("Failed to load your orders. Please try again.");
          console.error("Failed to load user orders from Supabase:", error);
        } else if (data) {
          setUserOrders(data.map((tx: any) => ({
            id: tx.id,
            email: tx.email,
            date: tx.date,
            product: tx.product,
            amount: tx.amount,
            cogs: tx.cogs,
            freight: tx.freight,
            status: tx.status
          })));
        }
      } catch (err) {
        setOrdersError("Network error loading orders. Check your connection.");
        console.error("Failed to load user orders from Supabase:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  // Load real-time transactions and user activities from Supabase if user is Admin
  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      setIsLoadingAdmin(true);
      setAdminError(null);
      try {
        const { data: txData, error: txError, count } = await supabase
          .from("transactions")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(0, TX_PAGE_SIZE - 1);

        if (txError) {
          setAdminError("Failed to load transactions. Please try again.");
          console.error("Failed to load transactions from Supabase:", txError);
        } else if (txData) {
          setTransactions(txData.map((tx: any) => ({
            id: tx.id,
            email: tx.email,
            date: tx.date,
            product: tx.product,
            amount: tx.amount,
            cogs: tx.cogs,
            freight: tx.freight,
            status: tx.status
          })));
          setTxPage(1);
          setHasMoreTx(count ? count > TX_PAGE_SIZE : false);
        }

        const { data: actData, error: actError } = await supabase
          .from("activity_logs")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(50);

        if (actError) {
          console.error("Failed to load activity logs from Supabase:", actError);
        } else if (actData) {
          setActivities(actData.map((act: any) => ({
            id: act.id,
            email: act.email,
            type: act.type,
            timestamp: act.timestamp
          })));
        }
      } catch (err) {
        setAdminError("Network error loading dashboard. Check your connection.");
        console.error("Failed to load admin auditing logs from Supabase:", err);
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    loadData();

    const channel = supabase
      .channel("admin-transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const tx = payload.new as any;
            setTransactions((prev) => [{
              id: tx.id,
              email: tx.email,
              date: tx.date,
              product: tx.product,
              amount: tx.amount,
              cogs: tx.cogs,
              freight: tx.freight,
              status: tx.status
            }, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const tx = payload.new as any;
            setTransactions((prev) =>
              prev.map((t) => t.id === tx.id ? {
                id: tx.id,
                email: tx.email,
                date: tx.date,
                product: tx.product,
                amount: tx.amount,
                cogs: tx.cogs,
                freight: tx.freight,
                status: tx.status
              } : t)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleLoadMoreTx = async () => {
    if (!hasMoreTx || isLoadingMoreTx) return;
    setIsLoadingMoreTx(true);
    try {
      const from = txPage * TX_PAGE_SIZE;
      const to = from + TX_PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Failed to load more transactions:", error);
      } else if (data) {
        setTransactions((prev) => [
          ...prev,
          ...data.map((tx: any) => ({
            id: tx.id,
            email: tx.email,
            date: tx.date,
            product: tx.product,
            amount: tx.amount,
            cogs: tx.cogs,
            freight: tx.freight,
            status: tx.status
          }))
        ]);
        setTxPage((p) => p + 1);
        setHasMoreTx(count ? from + TX_PAGE_SIZE < count : false);
      }
    } catch (err) {
      console.error("Failed to load more transactions:", err);
    } finally {
      setIsLoadingMoreTx(false);
    }
  };

  useEffect(() => {
    setUsername(profile.username);
    setFullName(profile.fullName);
    setPhone(profile.phone);
    setAddress(profile.address);
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!username.trim()) {
      setAlertMessage("Username is required.");
      setShowAlert(true);
      return;
    }
    if (!fullName.trim()) {
      setAlertMessage("Full Name is required.");
      setShowAlert(true);
      return;
    }
    if (phone.trim() && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(phone.trim())) {
      setAlertMessage("Please enter a valid phone number.");
      setShowAlert(true);
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.uid,
          email: user.email,
          username,
          full_name: fullName,
          phone,
          address,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      updateProfile({ username, fullName, phone, address });
      setAlertMessage("Profile details updated successfully!");
      setShowAlert(true);
    } catch (err: any) {
      console.error(err);
      setAlertMessage("Failed to update profile. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSimulateSale = async () => {
    const randomShoe = shoesCatalog[Math.floor(Math.random() * shoesCatalog.length)];
    const priceStr = randomShoe.price.replace("$", "");
    const priceNum = parseFloat(priceStr);
    const simulatedCogs = parseFloat((priceNum * 0.55).toFixed(2));

    const randomEmails = ["alex@gmail.com", "youssef@hotmail.com", "mariam@nike.com", "runner2026@yahoo.com", "sneakerhead@outlook.com"];
    const randomEmail = randomEmails[Math.floor(Math.random() * randomEmails.length)];

    const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      id: txId,
      email: randomEmail,
      date: new Date().toISOString().split("T")[0],
      product: randomShoe.title,
      amount: priceNum,
      cogs: simulatedCogs,
      freight: 15.00,
      status: Math.random() > 0.1 ? "Completed" : "Pending"
    };

    try {
      const { error } = await supabase
        .from("transactions")
        .insert([
          {
            id: txId,
            email: randomEmail,
            uid: null,
            date: newTx.date,
            product: newTx.product,
            amount: newTx.amount,
            cogs: newTx.cogs,
            freight: newTx.freight,
            status: newTx.status,
            created_at: new Date().toISOString()
          }
        ]);
      if (error) {
        console.error("Failed to save transaction to database:", error);
      }
    } catch (err) {
      console.error("Failed to save transaction error:", err);
    }

    setTransactions((prev) => [newTx, ...prev]);
    setAlertMessage(`Transaction added: ${randomShoe.title} ($${priceNum})`);
    setShowAlert(true);
  };

  const totalCashIn = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCogs = transactions.reduce((sum, tx) => sum + tx.cogs, 0);
  const totalFreight = transactions.reduce((sum, tx) => sum + tx.freight, 0);
  const totalExpenses = totalCogs + totalFreight;
  const netProfit = totalCashIn - totalExpenses;

  const completedOrders = transactions.filter((tx) => tx.status === "Completed").length;
  const processingOrders = transactions.filter((tx) => tx.status === "Processing").length;
  const pendingOrders = transactions.filter((tx) => tx.status === "Pending").length;
  const totalOrders = transactions.length;
  const avgOrderValue = totalOrders > 0 ? totalCashIn / totalOrders : 0;
  const profitMargin = totalCashIn > 0 ? (netProfit / totalCashIn) * 100 : 0;

  const displayName = fullName || username || user?.email?.split("@")[0] || "Authorized Guest";
  const firstName = displayName.trim().split(/\s+/)[0];
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
  const userOrderCount = userOrders.length;

  const profileFields = [
    { label: "Username", filled: !!username.trim() },
    { label: "Full Name", filled: !!fullName.trim() },
    { label: "Phone", filled: !!phone.trim() },
    { label: "Address", filled: !!address.trim() },
  ];
  const filledCount = profileFields.filter((f) => f.filled).length + 1;
  const completionPct = Math.round((filledCount / (profileFields.length + 1)) * 100);

  const TAB_LABELS: Record<string, string> = {
    info: "Profile Settings",
    orders: "Order History",
    admin: "Store Management",
  };

  const statusAccent = (status: string) =>
    status === "Completed" ? "bg-emerald-500" : status === "Processing" ? "bg-amber-400" : "bg-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 font-sans flex flex-col justify-between text-white relative overflow-hidden">
      {/* Immersive Dashboard Grid & Backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,#103c35_0%,transparent_50%)] pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_90%,#041210_0%,transparent_60%)] pointer-events-none" />

      <div>
        <Header />

        {/* Workspace Canvas */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          
          {/* User Pass Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/5 text-white px-6 md:px-10 py-7 mb-8 shadow-2xl backdrop-blur-md"
          >
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black shrink-0 ${
                    isAdmin
                      ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/10"
                      : "bg-zinc-800 border border-white/10 text-yellow-400"
                  }`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-extrabold mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isAdmin ? "Store Administrator Access" : "Registered Store Member"}
                  </p>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">{firstName}</span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <span
                  onClick={() => navigate("/")}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  Store
                </span>
                <FaChevronRight size={8} className="text-zinc-700" />
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab("info")}>
                  Account
                </span>
                <FaChevronRight size={8} className="text-zinc-700" />
                <span className="text-yellow-400">{TAB_LABELS[activeTab]}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28 self-start">
              
              {/* Interactive 3D Perspective Member Card */}
              <div style={{ perspective: 1000 }} className="w-full relative group">
                <motion.div
                  ref={memberCardRef}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  animate={{ rotateX, rotateY }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="relative overflow-hidden rounded-[20px] p-6 text-white shadow-2xl aspect-[1.58/1] flex flex-col justify-between border border-white/5 select-none"
                  style={{
                    transformStyle: "preserve-3d",
                    background: isAdmin
                      ? "radial-gradient(circle 140px at var(--shine-x, 0px) var(--shine-y, 0px), rgba(250,204,21,0.18) 0%, transparent 100%), linear-gradient(135deg, #1c1917 0%, #020202 100%)"
                      : "radial-gradient(circle 140px at var(--shine-x, 0px) var(--shine-y, 0px), rgba(255,255,255,0.06) 0%, transparent 100%), linear-gradient(135deg, #18181b 0%, #030303 100%)"
                  }}
                >
                  <div className="absolute inset-[1px] rounded-[19px] bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-start relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black italic text-base tracking-tighter text-white">NIKE</span>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        isAdmin ? "bg-yellow-400 text-black" : "bg-white/10 text-zinc-300 border border-white/5"
                      }`}>
                        {isAdmin ? "ADMIN" : "MEMBER"}
                      </span>
                    </div>
                    <span className="text-[8px] font-black tracking-widest text-zinc-500 uppercase">
                      {isAdmin ? "Visa Infinite" : "Visa Signature"}
                    </span>
                  </div>

                  {/* EMV chip & waves */}
                  <div className="flex items-center justify-between relative z-10" style={{ transform: "translateZ(40px)" }}>
                    {/* Metallic EMV Chip */}
                    <div className={`w-10 h-7.5 rounded relative overflow-hidden shadow-inner flex flex-col justify-between p-1.5 border ${
                      isAdmin 
                        ? "bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-600 border-yellow-300/40"
                        : "bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border-zinc-500/40"
                    }`}>
                      <div className="w-full h-[1px] bg-black/10 absolute top-1/3 left-0" />
                      <div className="w-full h-[1px] bg-black/10 absolute top-2/3 left-0" />
                      <div className="w-[1px] h-full bg-black/10 absolute left-1/3 top-0" />
                      <div className="w-[1px] h-full bg-black/10 absolute left-2/3 top-0" />
                      <div className="w-2.5 h-3 bg-white/30 rounded-sm mx-auto" />
                    </div>

                    {/* Wireless Waves */}
                    <div className="flex gap-0.5 items-center rotate-90 text-zinc-600 opacity-60">
                      <div className="w-[2px] h-2 bg-white rounded-full" />
                      <div className="w-[2px] h-3 border-r-2 border-white rounded-full" />
                      <div className="w-[2px] h-4 border-r-2 border-white rounded-full" />
                    </div>
                  </div>

                  {/* Embossed Card Number */}
                  <div 
                    className="relative z-10 font-mono text-base font-semibold tracking-[0.16em] text-zinc-300 text-center my-1 select-all"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    4111 2026 {isAdmin ? "8888" : "9999"} {user?.uid.substring(0, 4).toUpperCase() || "8492"}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="space-y-0.5">
                      <p className="text-[6px] text-zinc-600 uppercase tracking-widest">Cardholder</p>
                      <p className={`text-[10px] font-bold font-mono tracking-wide uppercase truncate max-w-[130px] ${
                        isAdmin ? "text-yellow-400" : "text-zinc-200"
                      }`}>
                        {displayName}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="space-y-0.5 text-right">
                        <p className="text-[6px] text-zinc-600 uppercase tracking-widest">Expires</p>
                        <p className="text-[9px] font-bold font-mono tracking-wide text-zinc-300">
                          {isAdmin ? "12 / 30" : "06 / 31"}
                        </p>
                      </div>
                      <span className="font-black text-base italic tracking-tight text-white/95 pl-2">
                        VISA
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Console */}
              <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                    Verification Center
                  </p>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-zinc-400">Settings Completeness</span>
                    <span className="font-black text-yellow-400">{completionPct}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                    />
                  </div>
                  {completionPct < 100 && (
                    <button
                      onClick={() => setActiveTab("info")}
                      className="text-[11px] font-bold text-yellow-400 hover:text-yellow-300 transition-colors mt-2.5 cursor-pointer block"
                    >
                      Verify remaining fields →
                    </button>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-400 font-semibold">
                      <FaEnvelope className="text-zinc-600" size={12} /> Verification
                    </span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-400 font-semibold">
                      <FaHistory className="text-zinc-600" size={12} /> Purchases Count
                    </span>
                    <span className="font-black text-white">{userOrderCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-400 font-semibold">
                      <FaGlobe className="text-zinc-600" size={12} /> Region
                    </span>
                    <span className="font-black text-white">Global</span>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab("admin")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs text-yellow-400 bg-yellow-400/5 border border-yellow-400/25 hover:bg-yellow-400 hover:text-black transition-all cursor-pointer focus:outline-none"
                  >
                    <FaChartBar size={13} /> Open Store Admin
                  </button>
                )}
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs text-red-400 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:text-red-300 transition-all cursor-pointer focus:outline-none"
              >
                <FaSignOutAlt size={13} /> Sign Out
              </button>
            </div>

            {/* Main Tabs Panel */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5 min-h-[440px]">
                
                {/* Tabs Header */}
                <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-white/5">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                      activeTab === "info"
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                        : "bg-zinc-900/80 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <FaUser size={12} /> Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                      activeTab === "orders"
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                        : "bg-zinc-900/80 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <FaHistory size={12} /> Order History
                    {userOrderCount > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        activeTab === "orders" ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {userOrderCount}
                      </span>
                    )}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === "admin"
                          ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                          : "bg-zinc-900/80 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <FaChartBar size={12} /> Store Management
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "info" && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-white">
                          Profile Settings
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          Manage your core delivery addresses and verified contact coordinates.
                        </p>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Username */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                              Username
                            </label>
                            <div className="relative">
                              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
                              <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors"
                                placeholder="e.g. nike_runner"
                              />
                            </div>
                          </div>

                          {/* Email (Readonly) */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
                              Email Coordinates
                              <span className="text-[9px] font-bold normal-case text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Verified</span>
                            </label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
                              <input
                                type="email"
                                disabled
                                value={user?.email || ""}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-zinc-500 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Full Name */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                              Full Name
                            </label>
                            <div className="relative">
                              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors"
                                placeholder="e.g. Ahmed Hamdy"
                              />
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                              Phone Number
                            </label>
                            <div className="relative">
                              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors"
                                placeholder="e.g. +1 555-0199"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
                            <FaMapMarkerAlt className="text-zinc-600" size={12} /> Core Shipping Address
                          </label>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors resize-none"
                            placeholder="e.g. 123 Main St, New York, NY 10001"
                          />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-yellow-400 text-black font-extrabold px-8 py-3.5 rounded-full hover:bg-yellow-300 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            <FaSave /> {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "orders" && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-2xl font-black text-white">
                          Order History
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          View and track your previous purchases.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {isLoadingOrders ? (
                          <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                          </>
                        ) : ordersError ? (
                          <div className="text-center py-12 bg-red-950/20 rounded-2xl border border-red-900/30">
                            <p className="text-red-400 font-medium text-xs">{ordersError}</p>
                            <button
                              onClick={() => window.location.reload()}
                              className="mt-3 text-xs font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                            >
                              Retry
                            </button>
                          </div>
                        ) : userOrders.length === 0 ? (
                          <div className="text-center py-14 bg-zinc-950/40 rounded-2xl border border-dashed border-white/10">
                            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto mb-3">
                              <FaBoxOpen size={18} />
                            </div>
                            <p className="text-zinc-400 font-bold text-sm">No orders yet</p>
                            <p className="text-zinc-600 text-xs mt-1">Your purchases will show up here once you place an order.</p>
                            <button
                              onClick={() => navigate("/")}
                              className="mt-4 text-xs font-extrabold text-black bg-yellow-400 px-6 py-3 rounded-full hover:bg-yellow-300 transition-all cursor-pointer"
                            >
                              Start Shopping
                            </button>
                          </div>
                        ) : (
                          userOrders.map((order) => (
                            <div
                              key={order.id}
                              className="relative overflow-hidden border border-white/5 rounded-2xl py-5 pl-6 pr-6 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40"
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusAccent(order.status)}`} />
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono font-extrabold text-white text-sm">{order.id}</span>
                                  <span className="text-xs text-zinc-500">{order.date}</span>
                                </div>
                                <p className="text-xs text-zinc-400 font-medium">{order.product}</p>
                                
                                {/* Shipment courier visual progress bar on the card */}
                                {order.status === "Processing" && (
                                  <div className="w-44 space-y-1 mt-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500 tracking-wider">
                                      <span>In transit</span>
                                      <span>Stage 2/3</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: "66%" }} />
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-2 items-center mt-2.5">
                                  <span className="text-xs font-semibold text-zinc-500">Total Charged:</span>
                                  <span className="text-sm font-extrabold text-yellow-400">${order.amount.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                  order.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : order.status === "Processing"
                                      ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                }`}>
                                  {order.status}
                                </span>
                                <button
                                  onClick={() => handleOpenTracker(order)}
                                  className="text-xs font-bold text-zinc-300 hover:text-white border border-white/10 rounded-full px-4 py-2 hover:bg-zinc-800 transition-all cursor-pointer focus:outline-none"
                                >
                                  {order.status === "Processing" ? "Track & Complete" : "Track Order"}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {isAdmin && activeTab === "admin" && (
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Admin Sub-Tabs Navigation */}
                      <div className="flex border-b border-white/5 pb-2 gap-6 text-xs font-bold text-zinc-400">
                        <button
                          onClick={() => setAdminSubTab("overview")}
                          className={`pb-2 transition-colors focus:outline-none cursor-pointer ${
                            adminSubTab === "overview" ? "text-yellow-400 border-b-2 border-yellow-400" : "hover:text-white"
                          }`}
                        >
                          Overview Console
                        </button>
                        <button
                          onClick={() => setAdminSubTab("products")}
                          className={`pb-2 transition-colors focus:outline-none cursor-pointer ${
                            adminSubTab === "products" ? "text-yellow-400 border-b-2 border-yellow-400" : "hover:text-white"
                          }`}
                        >
                          Product Catalog Manager ({catalog.length})
                        </button>
                        <button
                          onClick={() => setAdminSubTab("transactions")}
                          className={`pb-2 transition-colors focus:outline-none cursor-pointer ${
                            adminSubTab === "transactions" ? "text-yellow-400 border-b-2 border-yellow-400" : "hover:text-white"
                          }`}
                        >
                          Transaction Ledger ({transactions.length})
                        </button>
                      </div>

                      {/* Sub-Tab 1: Overview Console */}
                      {adminSubTab === "overview" && (
                        <div className="space-y-8">
                          {/* Overview Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="text-xl font-black text-white">Metrics Overview</h3>
                              <p className="text-zinc-500 text-xs">Visual analytics of recent sales operations.</p>
                            </div>
                            <button
                              onClick={handleSimulateSale}
                              className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none"
                            >
                              <FaPlus /> Record New Sale
                            </button>
                          </div>

                          {/* KPI Cards */}
                          {isLoadingAdmin ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SkeletonKPI />
                              <SkeletonKPI />
                              <SkeletonKPI />
                            </div>
                          ) : adminError ? (
                            <div className="bg-red-950/20 rounded-2xl p-6 border border-red-900/30 text-center">
                              <p className="text-red-400 font-bold">{adminError}</p>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Revenue */}
                                <div className="relative overflow-hidden bg-zinc-900/40 rounded-3xl p-6 pl-7 border border-white/5 shadow-2xl transition-all hover:border-emerald-500/30">
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Gross Revenue</p>
                                    <span className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                      <FaDollarSign size={14} />
                                    </span>
                                  </div>
                                  <h4 className="text-3xl font-black text-white tracking-tight">${totalCashIn.toFixed(2)}</h4>
                                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden mt-4">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                                  </div>
                                  <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-wider">{totalOrders} Orders generated</p>
                                </div>

                                {/* Expenses */}
                                <div className="relative overflow-hidden bg-zinc-900/40 rounded-3xl p-6 pl-7 border border-white/5 shadow-2xl transition-all hover:border-rose-500/30">
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Total Expenses</p>
                                    <span className="w-9 h-9 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 border border-rose-500/20">
                                      <FaArrowDown size={14} />
                                    </span>
                                  </div>
                                  <h4 className="text-3xl font-black text-white tracking-tight">${totalExpenses.toFixed(2)}</h4>
                                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden mt-4">
                                    <div 
                                      className="h-full bg-rose-500 rounded-full" 
                                      style={{ width: `${totalCashIn > 0 ? (totalExpenses / totalCashIn) * 100 : 0}%` }} 
                                    />
                                  </div>
                                  <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-wider">
                                    {totalCashIn > 0 ? ((totalExpenses / totalCashIn) * 100).toFixed(0) : 0}% of Gross Cash flow
                                  </p>
                                </div>

                                {/* Net Profit */}
                                <div className="relative overflow-hidden bg-zinc-900/40 rounded-3xl p-6 pl-7 border border-white/5 shadow-2xl transition-all hover:border-yellow-500/30">
                                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${netProfit >= 0 ? "bg-yellow-400" : "bg-rose-500"}`} />
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Net Yield Margin</p>
                                    <span className="w-9 h-9 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                                      <FaChartLine size={14} />
                                    </span>
                                  </div>
                                  <h4 className={`text-3xl font-black tracking-tight ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    ${netProfit.toFixed(2)}
                                  </h4>
                                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden mt-4">
                                    <div 
                                      className={`h-full ${netProfit >= 0 ? "bg-emerald-500" : "bg-rose-500"} rounded-full`}
                                      style={{ width: `${Math.min(100, Math.max(0, profitMargin))}%` }} 
                                    />
                                  </div>
                                  <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-wider">{profitMargin.toFixed(1)}% margin yield</p>
                                </div>
                              </div>

                              {/* Fulfillment Distribution Chart */}
                              <div className="bg-zinc-900/30 rounded-3xl p-6 border border-white/5 shadow-2xl space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fulfillment Distribution</h4>
                                  <span className="text-[10px] font-extrabold text-yellow-400">{totalOrders} Active Orders</span>
                                </div>

                                <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden flex">
                                  <div 
                                    className="h-full bg-emerald-500 hover:opacity-90 transition-opacity cursor-pointer" 
                                    style={{ width: `${totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0}%` }}
                                  />
                                  <div 
                                    className="h-full bg-amber-400 hover:opacity-90 transition-opacity cursor-pointer animate-pulse" 
                                    style={{ width: `${totalOrders > 0 ? (processingOrders / totalOrders) * 100 : 0}%` }}
                                  />
                                  <div 
                                    className="h-full bg-zinc-700 hover:opacity-90 transition-opacity cursor-pointer" 
                                    style={{ width: `${totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}%` }}
                                  />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                                  <div className="bg-zinc-950/40 rounded-2xl p-4 border border-white/5">
                                    <p className="text-2xl font-black text-white">{totalOrders}</p>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Total Orders</p>
                                  </div>
                                  <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                    <p className="text-2xl font-black text-emerald-400">{completedOrders}</p>
                                    <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-wider mt-1">Completed</p>
                                  </div>
                                  <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10">
                                    <p className="text-2xl font-black text-amber-400">{processingOrders}</p>
                                    <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-wider mt-1">Processing</p>
                                  </div>
                                  <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5">
                                    <p className="text-2xl font-black text-zinc-400">{pendingOrders}</p>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Pending</p>
                                  </div>
                                </div>
                              </div>

                              {/* Quick Stats Ribbon */}
                              <div className="flex flex-wrap gap-8 bg-zinc-950/40 rounded-3xl p-6 border border-white/5 mt-6">
                                <div>
                                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Average Order Value</p>
                                  <p className="text-xl font-black text-white mt-1">${avgOrderValue.toFixed(2)}</p>
                                </div>
                                <div className="border-l border-white/5 pl-8">
                                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Fulfillment Rate</p>
                                  <p className="text-xl font-black text-white mt-1">
                                    {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(0) : 0}%
                                  </p>
                                </div>
                                <div className="border-l border-white/5 pl-8">
                                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Pending Fulfillment</p>
                                  <p className="text-xl font-black text-white mt-1">{processingOrders + pendingOrders} tasks</p>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Audit Logs */}
                          <div className="border-t border-white/5 pt-6">
                            <button
                              onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
                              className="flex items-center justify-between w-full text-left cursor-pointer group focus:outline-none"
                            >
                              <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase group-hover:text-zinc-400 transition-colors flex items-center gap-2">
                                <FaLock size={10} className="text-zinc-600" /> Administrative Logs ({activities.length})
                              </h4>
                              <span className={`text-zinc-500 text-xs font-bold transition-transform duration-200 ${isActivityLogOpen ? "rotate-180" : ""}`}>
                                ▼
                              </span>
                            </button>

                            <AnimatePresence>
                              {isActivityLogOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="overflow-x-auto rounded-2xl border border-white/5 mt-4">
                                    <table className="w-full text-left border-collapse bg-zinc-900/10">
                                      <thead>
                                        <tr className="bg-zinc-950 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase">
                                          <th className="p-4">User</th>
                                          <th className="p-4">Event</th>
                                          <th className="p-4 text-right">Time</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-sm divide-y divide-white/5">
                                        {activities.length === 0 ? (
                                          <tr>
                                            <td colSpan={3} className="p-8 text-center text-zinc-500 font-medium">
                                              No activity logs yet.
                                            </td>
                                          </tr>
                                        ) : (
                                          activities.map((act) => (
                                            <tr key={act.id} className="hover:bg-zinc-900/30 transition-colors">
                                              <td className="p-4 text-zinc-400 text-xs">{act.email}</td>
                                              <td className="p-4">
                                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                                                  act.type === "Sign Up"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : act.type === "Sign In"
                                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                }`}>
                                                  {act.type}
                                                </span>
                                              </td>
                                              <td className="p-4 text-right text-zinc-500 text-xs font-mono">
                                                {new Date(act.timestamp).toLocaleString()}
                                              </td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 2: Product Catalog Manager */}
                      {adminSubTab === "products" && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-black text-white">Catalog Manager</h3>
                              <p className="text-zinc-500 text-xs">Add, edit, or delete items inside the store catalog.</p>
                            </div>
                            <button
                              onClick={handleOpenAddProduct}
                              className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <FaPlus /> Add Product
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {catalog.map((prod) => (
                              <div
                                key={prod.id}
                                className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-white/10 transition-colors"
                              >
                                <div className="flex gap-3.5 items-center min-w-0">
                                  <div className="w-14 h-14 bg-zinc-950 rounded-xl p-1 shrink-0 flex items-center justify-center border border-white/5">
                                    <img
                                      src={prod.image}
                                      alt={prod.title}
                                      className="w-full h-full object-contain"
                                      draggable={false}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate">{prod.title}</h4>
                                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{prod.category}</p>
                                    <p className="text-xs font-extrabold text-yellow-400 mt-1">{prod.price}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <FaEdit size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                    className="p-2 bg-red-950/20 text-red-400 hover:text-red-300 rounded-lg border border-red-900/30 hover:bg-red-950/40 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 3: Transaction Ledger */}
                      {adminSubTab === "transactions" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-black text-white">Transaction Ledger</h3>
                            <p className="text-zinc-500 text-xs mt-1">Directly edit checkout coordinates or delete transaction database logs.</p>
                          </div>

                          <div className="overflow-x-auto rounded-2xl border border-white/5">
                            <table className="w-full text-left border-collapse bg-zinc-900/20">
                              <thead>
                                <tr className="bg-zinc-950 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase">
                                  <th className="p-4">Order ID</th>
                                  <th className="p-4">Customer</th>
                                  <th className="p-4">Item Details</th>
                                  <th className="p-4 text-right">Amount</th>
                                  <th className="p-4 text-center">Fulfillment</th>
                                  <th className="p-4 text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs divide-y divide-white/5">
                                {isLoadingAdmin ? (
                                  <>
                                    <SkeletonTableRow />
                                    <SkeletonTableRow />
                                    <SkeletonTableRow />
                                  </>
                                ) : transactions.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500 font-medium">
                                      No transactions yet.
                                    </td>
                                  </tr>
                                ) : transactions.map((tx) => (
                                  <tr key={tx.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-4 font-mono font-bold text-white text-xs">{tx.id}</td>
                                    <td className="p-4 text-zinc-400 text-xs truncate max-w-[140px]">{tx.email}</td>
                                    <td className="p-4 font-semibold text-zinc-300 text-xs truncate max-w-[160px]">{tx.product}</td>
                                    <td className="p-4 text-right font-extrabold text-emerald-400">${tx.amount.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                                        tx.status === "Completed"
                                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                          : tx.status === "Processing"
                                            ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                      }`}>
                                        {tx.status}
                                      </span>
                                    </td>
                                    <td className="p-4 text-center">
                                      <div className="flex gap-2 justify-center">
                                        <button
                                          onClick={() => handleOpenEditTx(tx)}
                                          className="p-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                                          title="Modify details"
                                        >
                                          <FaEdit size={10} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTx(tx.id)}
                                          className="p-1.5 bg-red-950/20 text-red-400 hover:text-red-300 rounded border border-red-900/35 hover:bg-red-950/40 transition-colors cursor-pointer"
                                          title="Delete transaction log"
                                        >
                                          <FaTrash size={10} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination: Load More */}
                          {!isLoadingAdmin && hasMoreTx && (
                            <div className="flex justify-center mt-4">
                              <button
                                onClick={handleLoadMoreTx}
                                disabled={isLoadingMoreTx}
                                className="px-6 py-2.5 bg-zinc-900 border border-white/5 text-zinc-300 font-bold text-xs rounded-full hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                              >
                                {isLoadingMoreTx ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                  </>
                                ) : (
                                  "Load More"
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-left relative"
            >
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
              >
                <FaTimes size={18} />
              </button>

              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <FaShoppingBag className="text-yellow-400" /> Add Product to Catalog
              </h3>

              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProdTitle}
                      onChange={(e) => setNewProdTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      placeholder="e.g. Nike Air Max Pegasus"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      placeholder="e.g. 149.99"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Running">Running</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>

                  {/* Image */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Visual Model Template</label>
                    <select
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="/images/image_17.png">Dunk High (Green)</option>
                      <option value="/images/AIR+JORDAN+4+RETRO.avif">Jordan 4 (Crimson)</option>
                      <option value="/images/NIKE+REACTX+WILDHORSE+10.avif">Wildhorse (Volt Trail)</option>
                      <option value="/images/VAPOR+17+ELITE+FG+T.avif">Vapor Cleats (Volt)</option>
                      <option value="/images/image_20.png">Air Force 1 (Classic)</option>
                      <option value="/images/image_12.png">Air Max 90 (OG)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={newProdDescription}
                    onChange={(e) => setNewProdDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 resize-none"
                    placeholder="Provide a detailed description of the materials, cushioning, and performance design..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditProductOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-left relative"
            >
              <button
                onClick={() => setIsEditProductOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
              >
                <FaTimes size={18} />
              </button>

              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <FaEdit className="text-yellow-400" /> Edit Product Details
              </h3>

              <form onSubmit={handleEditProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editProdTitle}
                      onChange={(e) => setEditProdTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                    <select
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Running">Running</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={editProdDescription}
                    onChange={(e) => setEditProdDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditProductOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {isEditTxOpen && editingTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-left relative"
            >
              <button
                onClick={handleCloseEditTx}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
              >
                <FaTimes size={18} />
              </button>

              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <FaEdit className="text-yellow-400" /> Edit Transaction {editingTx.id}
              </h3>

              <form onSubmit={handleSaveEditTx} className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={editTxEmail}
                    onChange={(e) => setEditTxEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Product details */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Product Description</label>
                  <input
                    type="text"
                    required
                    value={editTxProduct}
                    onChange={(e) => setEditTxProduct(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editTxAmount}
                    onChange={(e) => setEditTxAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fulfillment Status</label>
                  <select
                    value={editTxStatus}
                    onChange={(e) => setEditTxStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleCloseEditTx}
                    className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Tracker Modal */}
      <AnimatePresence>
        {isTrackerOpen && trackerOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseTracker}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close tracker"
              >
                <FaTimes size={18} />
              </button>

              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/5">
                <FaCheckCircle size={40} className="animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-white mb-1">Order {trackerOrder.id}</h3>
              <p className="text-zinc-500 text-xs mb-2 font-mono">{trackerOrder.date}</p>
              <p className="text-zinc-400 text-sm mb-8 font-medium">{trackerOrder.product}</p>

              {/* Progress Steps */}
              <div className="relative flex justify-between items-center max-w-xs mx-auto mb-10">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 z-0" />
                <motion.div
                  className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0"
                  initial={{ width: "0%" }}
                  animate={{
                    width: trackerStep === 1 ? "0%" : trackerStep === 2 ? "50%" : "100%",
                  }}
                  transition={{ duration: 0.8 }}
                />

                {/* Step 1 - Placed */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    trackerStep >= 1 ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-500 border border-white/10"
                  }`}>1</div>
                  <span className="text-[10px] font-extrabold text-zinc-400 mt-2 uppercase tracking-wider">Placed</span>
                </div>

                {/* Step 2 - Packed */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    trackerStep >= 2 ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-500 border border-white/10"
                  }`}>
                    {trackerStep === 2 ? <FaBoxOpen className="animate-spin text-[10px]" /> : "2"}
                  </div>
                  <span className="text-[10px] font-extrabold text-zinc-400 mt-2 uppercase tracking-wider">Packed</span>
                </div>

                {/* Step 3 - Shipped */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    trackerStep >= 3 ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-500 border border-white/10"
                  }`}>
                    {trackerStep === 3 ? <FaTruck className="animate-bounce text-[10px]" /> : "3"}
                  </div>
                  <span className="text-[10px] font-extrabold text-zinc-400 mt-2 uppercase tracking-wider">Shipped</span>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 mb-6 text-zinc-300">
                {trackerStep === 1 && (
                  <p className="text-sm font-medium animate-pulse text-zinc-400">Warehouse is verifying order package...</p>
                )}
                {trackerStep === 2 && (
                  <p className="text-sm font-medium text-zinc-400">Item packaged. Awaiting courier pickup...</p>
                )}
                {trackerStep === 3 && (
                  <p className="text-sm font-bold text-emerald-400">Out for delivery! Your package is arriving today.</p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleCloseTracker}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3.5 rounded-full font-extrabold transition-all shadow-md cursor-pointer uppercase text-xs tracking-wider"
              >
                {trackerOrder.status === "Processing" && trackerStep === 3
                  ? "Complete & Close Order"
                  : trackerOrder.status === "Completed"
                  ? "Close Tracker"
                  : "Continue"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Component */}
      <Alert
        message={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default Profile;