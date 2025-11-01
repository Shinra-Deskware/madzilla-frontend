import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IconButton, Accordion, AccordionSummary, AccordionDetails,
    TextField, Button, Avatar, InputAdornment, Box,
    CircularProgress
} from "@mui/material";
import {
    DeleteOutline as DeleteIcon, Add as AddIcon, Remove as RemoveIcon, LocalShipping as ShippingIcon,
    Call as CallIcon, Chat as ChatIcon, CardGiftcard as GiftIcon,
    ShoppingCart as CartIcon, Home as HomeIcon,
    CheckCircle as CheckIcon, Cancel as CancelIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
//imports
import "./styles/cartPage.css";
import OtpPopup from "../Common/OtpPopup";
import OrderConfirmOtp from "../Common/OrderConfirmOtp";
import http from "../api/http";
import { useUser } from "../context/UserContext";

const PaymentLogos = { Phonepe: 'phonepe', Paytm: 'paytm', Gpay: 'gpay' };
const DeliveryLogos = { Fast: 'rabbit', Normal: 'tortoise' };
const Info = [
    { icon: <ShippingIcon />, bg: "#FCE7F3", title: "Free Shipping", subtitle: "For online payments" },
    { icon: <CallIcon />, bg: "#F3F4F6", title: "Call Us Anytime", subtitle: "+916303666387" },
    { icon: <ChatIcon />, bg: "#DCFCE7", title: "Chat With Us", subtitle: "We offer 24-hour chat support" },
    { icon: <GiftIcon />, bg: "#FEF9C3", title: "Gift Cards", subtitle: "For your loved one, in any amount" },
];

const formatNumber = n => Number(n).toLocaleString('en-IN');

const CartItem = ({ item, onQtyChange, onRemove }) => {
    const key = item.key ?? item.id;
    const count = item.count ?? item.qty ?? 1;
    return (
        <div className="cart-item">
            <div className="left">
                <img src={`/assets/${key}.png`} alt={key} className="item-image" loading="lazy" />
            </div>
            <div className="middle">
                <h4>{item.title ?? item.name ?? "Product"}</h4>
                <div className="price-left">
                    <span className="offer-price">₹{formatNumber(item.price)}</span>
                    {item.originalPrice && <span className="original-price">₹{formatNumber(item.originalPrice)}</span>}
                    {item.discount && <span className="offer-pill">{item.discount}% OFF</span>}
                </div>
                <div className="item-icons"><span>🚚 Free Shipping</span></div>
            </div>
            <div className="right">
                <div className="quantity-box">
                    <IconButton size="small" onClick={() => onQtyChange(key, -1)}><RemoveIcon fontSize="small" /></IconButton>
                    <span>{count}</span>
                    <IconButton size="small" onClick={() => onQtyChange(key, 1)}><AddIcon fontSize="small" /></IconButton>
                </div>
                <button className="cart-action remove" onClick={() => onRemove(key)}>
                    <DeleteIcon fontSize="small" /> Remove
                </button>
            </div>
        </div>
    );
};

export default function CartPage() {
    const { user } = useUser();
    const [products, setProducts] = useState([]);
    const [expanded, setExpanded] = useState("items");
    const [address, setAddress] = useState({
        fullName: "",
        emailId: "",
        phoneNumber: "",
        state: "",
        city: "",
        pincode: "",
        addr1: ""
    });
    const [errors, setErrors] = useState({});
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showCheckout, setShowCheckout] = useState(false);
    const [openOtp, setOpenOtp] = useState(false);
    const [openConfirmOtp, setOpenConfirmOtp] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const navigate = useNavigate();

    const fieldRefs = {
        fullName: useRef(null),
        emailId: useRef(null),
        phoneNumber: useRef(null),
        state: useRef(null),
        city: useRef(null),
        pincode: useRef(null),
        addr1: useRef(null),
    };

    const total = products.reduce((a, i) => a + Number(i.price) * (i.count ?? i.qty ?? 1), 0);
    const shipping = 0;
    const discount = couponCode === "FIRST100" ? -500 : 0;
    const subtotal = total + shipping + discount;

    useEffect(() => {
        if (user) {
            setAddress(prev => ({
                ...prev,
                fullName: user.fullName || "",
                emailId: user.emailId || "",
                phoneNumber: user.phoneNumber || "",
                state: user.address?.state || "",
                city: user.address?.city || "",
                pincode: user.address?.pinCode || "",
                addr1: user.address?.addr1 || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setProducts(localCart);
        if (user?._id && localCart.length) {
            http.post(`/api/users/${user._id}/cart/save`, { cart: localCart }).catch(console.error);
        }
    }, [user]);

    const persist = (next) => {
        setProducts(next);
        localStorage.setItem("cart", JSON.stringify(next));

        // 🧠 Notify sidebar instantly
        const totalItems = next.reduce((sum, item) => sum + (item.count || item.qty || 1), 0);
        const ev = new CustomEvent("cart-updated", { detail: { count: totalItems } });
        window.dispatchEvent(ev);
    };


    const handleQtyChange = (key, delta) => {
        const updated = products
            .map(i => i.key === key ? { ...i, count: Math.max((i.count || 1) + delta, 0) } : i)
            .filter(i => i.count > 0);
        persist(updated);
    };

    const handleRemove = key => persist(products.filter(i => i.key !== key));

    const handleCheckout = async () => {
        if (!products.length) return alert("Your cart is empty.");
        if (user?._id) {
            await http.post(`/api/users/${user._id}/cart/save`, { cart: products }).catch(console.error);
            setShowCheckout(true);
        } else setOpenOtp(true);
    };

    const validateField = (name, value) => {
        let error = "";
        if (name === "fullName" && !value) error = "Full Name is required";
        if (name === "emailId" && !/^\S+@\S+\.\S+$/.test(value)) error = "Enter a valid email";
        if (name === "phoneNumber" && !/^[6-9]\d{9}$/.test(value)) error = "Enter valid 10-digit phone number";
        if (name === "state" && !value) error = "State is required";
        if (name === "city" && !/^[a-zA-Z\s]{3,}$/.test(value)) error = "Enter valid city";
        if (name === "pincode" && !/^[1-9][0-9]{5}$/.test(value)) error = "Enter valid 6-digit pincode";
        if (name === "addr1" && value.length < 10) error = "Address must be at least 10 characters";
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === "";
    };

    const isAddressValid = () => {
        let valid = true;
        for (const key of Object.keys(fieldRefs)) {
            const fieldValid = validateField(key, address[key]);
            if (!fieldValid && valid) {
                fieldRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" });
                fieldRefs[key].current?.focus();
                valid = false;
            }
        }
        return valid;
    };

    const handleChange = (name, value) => {
        setAddress(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const getAdornmentIcon = (field) => {
        if (!address[field]) return null;
        return errors[field]
            ? <CancelIcon color="error" fontSize="small" />
            : <CheckIcon color="success" fontSize="small" />;
    };

    const startPayment = async () => {
        try {
            setIsPlacingOrder(true);
            const { data } = await http.post("/api/payment/order", {
                phoneNumber: user.phoneNumber,
                items: products,
                total,
                shipping,
                address,
            });
            openRazorpay(data);
        } catch (err) {
            console.error("Order create error:", err);
            alert("Failed to create order");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const openRazorpay = (razorData, orderId) => {
        const options = {
            key: razorData.key,
            amount: razorData.amount,
            currency: razorData.currency,
            order_id: razorData.order_id,
            name: "Shinra Deskware",
            description: "Payment for SHINRA",
            handler: async (response) => {
                try {
                    // 🟢 Verify payment and update the existing order
                    await http.post("/api/payment/verify", {
                        ...response,
                        orderId,
                        phoneNumber: user.phoneNumber,
                    });
                    await http.post(`/api/orders/${orderId}/confirm`);
                    localStorage.removeItem("cart");
                    setProducts([]);
                    const ev = new CustomEvent("cart-updated", { detail: { count: 0 } });
                    window.dispatchEvent(ev);
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2000);
                } catch (err) {
                    localStorage.removeItem("cart");
                    setProducts([]);
                    const ev = new CustomEvent("cart-updated", { detail: { count: 0 } });
                    window.dispatchEvent(ev);
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2500); // redirect later
                }
            },
            modal: {
                ondismiss: () => {
                    localStorage.removeItem("cart");
                    setProducts([]);
                    const ev = new CustomEvent("cart-updated", { detail: { count: 0 } });
                    window.dispatchEvent(ev);
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2500); // redirect later
                },
            },
            theme: { color: "#7A5CF4" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const canPlaceOrder = () => {
        return (
            !paymentMethod || !deliveryMethod || isPlacingOrder || !address.addr1 || !address.city || !address.pincode || !address.phoneNumber || !address.state || !(/^\S+@\S+\.\S+$/.test(address.emailId))
        )
    }
    return (
        <div className="dashboard-cart-content">
            {orderConfirmed ? (
                <div className="order-confirm-screen">
                    <div className="confirm-box">
                        <CheckIcon className="confirm-icon" />
                        <h2>Your Order is Confirmed!</h2>
                        <p>Redirecting you to your orders page...</p>
                    </div>
                </div>
            ) : (
                <div className="dashboard-cart-content">
                    <OtpPopup open={openOtp} onClose={() => setOpenOtp(false)} onVerified={() => setShowCheckout(true)} />
                    <OrderConfirmOtp open={openConfirmOtp} onClose={() => setOpenConfirmOtp(false)} userPhone={user?.phoneNumber} onVerified={startPayment} />

                    {!showCheckout && (
                        <div className="cart-container">
                            <div className="cart-products">
                                {!products.length && (
                                    <div className="empty-cart-container">
                                        <p className="empty-cart-text">🛒 Your cart is empty.</p>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate("/dashboard/products")}
                                            sx={{ mt: 2, px: 4, py: 1, borderRadius: "20px", textTransform: "none", fontSize: "1rem" }}
                                        >
                                            Continue Shopping
                                        </Button>
                                    </div>
                                )}
                                {products.map(item => (
                                    <CartItem key={item.key ?? item.id} item={item} onQtyChange={handleQtyChange} onRemove={handleRemove} />
                                ))}
                            </div>

                            {/* ORDER SUMMARY STEP 1 */}
                            {!!products.length && (
                                <div className="order-summary sticky-summary">
                                    <h3>Order Summary</h3>
                                    <div className="coupon-row">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="coupon"
                                        />
                                        <button className="apply-btn">Apply</button>
                                    </div>
                                    <div className="summary-details">
                                        <div className="row"><span>Items ({products.length})</span><span>₹ {formatNumber(total)}</span></div>
                                        <div className="row"><span><strong>Shipping</strong></span><span>{formatNumber(shipping)}</span></div>
                                        <div className="row"><span><strong>Coupon %</strong></span><span>{formatNumber(discount)}</span></div>
                                        <hr />
                                        <div className="row subtotal"><span>Sub Total</span><span>₹ {formatNumber(subtotal)}</span></div>
                                    </div>
                                    <button className="checkout-btn" onClick={handleCheckout}>Check Out</button>
                                </div>
                            )}
                        </div>
                    )}

                    {showCheckout && (
                        <div className="checkout-two-col">
                            <div className="checkout-left">
                                {/* Accordion Steps */}
                                <Accordion expanded={expanded === "items"} onChange={(_, e) => setExpanded(e ? "items" : false)}>
                                    <AccordionSummary expandIcon={expanded === "items" ? <SaveIcon /> : <EditIcon />} onClick={() => setExpanded(expanded === "items" ? false : "items")}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <CartIcon sx={{ mr: 1 }} /><h4>1. Items</h4>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <AnimatePresence>
                                            {expanded === "items" && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                                    {products.map(i => (
                                                        <div key={i.key ?? i.id} className="mini-item-card">
                                                            <img src={`/assets/${i.key}.png`} alt={i.key} className="mini-thumb" loading="lazy" />
                                                            <div className="mini-item-info">
                                                                <h5>{i.title ?? i.name}</h5>
                                                                <div className="price-left">
                                                                    <span className="offer-price">₹{formatNumber(i.price)}</span>
                                                                    {i.originalPrice && <span className="original-price">₹{formatNumber(i.originalPrice)}</span>}
                                                                    {i.discount && <span className="offer-pill">{i.discount}% OFF</span>}
                                                                </div>
                                                            </div>
                                                            <div className="mini-item-qty">x{i.count ?? i.qty ?? 1}</div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </AccordionDetails>
                                </Accordion>

                                {/* ADDRESS */}
                                <Accordion expanded={expanded === "address"}>
                                    <AccordionSummary
                                        expandIcon={
                                            expanded === "address"
                                                ? <SaveIcon sx={{ color: Object.values(errors).some(e => e) ? "inherit" : "green" }} />
                                                : <EditIcon />
                                        }
                                        onClick={() => {
                                            if (expanded === "address") {
                                                const valid = isAddressValid();
                                                if (valid) setExpanded("payment"); // ✅ only close if valid
                                            } else {
                                                setExpanded("address"); // open manually
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <HomeIcon sx={{ mr: 1 }} />
                                            <h4>2. Delivery Address</h4>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                                    gap: 2
                                                }}
                                            >
                                                {["fullName", "emailId", "phoneNumber", "state", "city", "pincode", "addr1"].map((field) => {
                                                    const label = {
                                                        fullName: "Full Name",
                                                        emailId: "Email",
                                                        phoneNumber: "Phone Number",
                                                        state: "State",
                                                        city: "City",
                                                        pincode: "Pincode",
                                                        addr1: "Address Line 1"
                                                    }[field];
                                                    const isSelect = field === "state";
                                                    return (
                                                        <TextField
                                                            key={field}
                                                            fullWidth
                                                            margin="normal"
                                                            label={label}
                                                            inputRef={fieldRefs[field]}
                                                            value={address[field]}
                                                            disabled={field === "phoneNumber"}
                                                            onChange={(e) => handleChange(field, e.target.value)}
                                                            select={isSelect}
                                                            SelectProps={isSelect ? { native: true } : undefined}
                                                            InputLabelProps={isSelect ? { shrink: true } : undefined}
                                                            error={!!errors[field]}
                                                            helperText={errors[field]}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        {getAdornmentIcon(field)}
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        >
                                                            {isSelect && (
                                                                <>
                                                                    <option value="">Select State</option>
                                                                    {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"].map(s => (
                                                                        <option key={s} value={s}>{s}</option>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </TextField>
                                                    );
                                                })}
                                            </Box>
                                        </motion.div>
                                    </AccordionDetails>
                                </Accordion>

                                {/* PAYMENT */}
                                <Accordion expanded={expanded === "payment"} disabled={Object.values(errors).some(e => e)} onChange={(_, e) => setExpanded(e ? "payment" : false)}>
                                    <AccordionSummary expandIcon={expanded === "payment" ? <SaveIcon /> : <EditIcon />} onClick={() => setExpanded(expanded === "payment" ? false : "payment")}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ShippingIcon sx={{ mr: 1 }} /><h4>3. Payment & Delivery</h4>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                            <h4>Delivery Method</h4>
                                            <div className="delivery-methods">
                                                {Object.keys(DeliveryLogos).map(opt => (
                                                    <motion.button key={opt} whileHover={{ scale: 1.05 }} className={deliveryMethod === opt ? "active" : ""} onClick={() => setDeliveryMethod(opt)}>
                                                        <img src={`/assets/${DeliveryLogos[opt]}.png`} alt={opt} className="pay-icon" loading="lazy" />{opt}
                                                    </motion.button>
                                                ))}
                                            </div>
                                            <h4>Payment Method</h4>
                                            <div className="payment-methods">
                                                {Object.keys(PaymentLogos).map(opt => (
                                                    <motion.button key={opt} whileHover={{ scale: 1.05 }} className={paymentMethod === opt ? "active" : ""} onClick={() => setPaymentMethod(opt)}>
                                                        <img src={`/assets/${PaymentLogos[opt]}.png`} alt={opt} className="pay-icon" loading="lazy" />{opt}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            {/* ORDER SUMMARY STEP 2 */}
                            {!!products.length && (
                                <div className="checkout-summary sticky-summary">
                                    <h3>Order Summary</h3>
                                    <div className="coupon-row">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="coupon"
                                        />
                                        <button className="apply-btn">Apply</button>
                                    </div>
                                    {address.fullName && (
                                        <div className="address-preview">
                                            {address.fullName && <div className="address-preview-row">
                                                <span className="address-preview-label">👤 Name:</span>
                                                <span className="address-preview-value">{address.fullName}</span>
                                            </div>}
                                            <div className="address-preview-row">
                                                <span className="address-preview-label">📞 Phone:</span>
                                                <span className="address-preview-value">{address.phoneNumber}</span>
                                            </div>
                                            {address.emailId && <div className="address-preview-row">
                                                <span className="address-preview-label">✉️ Email:</span>
                                                <span className="address-preview-value">{address.emailId}</span>
                                            </div>}
                                            {address.addr1 && <div className="address-preview-row">
                                                <span className="address-preview-label">🏠 Address:</span>
                                                <span className="address-preview-value">
                                                    {address.addr1}
                                                </span>
                                            </div>}
                                            <hr />
                                        </div>

                                    )}
                                    {paymentMethod && (
                                        <div className="address-preview">
                                            <p><strong>💳 Payment:</strong> {paymentMethod}</p>
                                            <p><strong>📍 Delivery:</strong> {deliveryMethod}</p>
                                            <hr />
                                        </div>
                                    )}
                                    <div className="row"><span><strong>Items ({products.length})</strong></span><span>₹ {formatNumber(total)}</span></div>
                                    <div className="row"><span><strong>Shipping</strong></span><span>{formatNumber(shipping)}</span></div>
                                    <div className="row"><span><strong>Coupon %</strong></span><span>{formatNumber(discount)}</span></div>
                                    <hr />
                                    <div className="row subtotal"><span>Sub Total</span><span>₹ {formatNumber(subtotal)}</span></div>
                                    <button
                                        className={`place-order-btn ${(canPlaceOrder()) ? "disabled" : ""}`}
                                        disabled={canPlaceOrder()}
                                        onClick={startPayment}
                                    >
                                        {isPlacingOrder ? (
                                            <>
                                                <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                                                Processing...
                                            </>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="info-banner-scroll">
                        <div style={{ marginLeft: '1rem', display: 'flex', gap: '1rem', overflow: "scroll", scrollbarWidth: "none" }}>
                            {Info.map((i, idx) => (
                                <div key={idx} className="info-box">
                                    <Avatar className="info-icon" sx={{ backgroundColor: i.bg }}>{i.icon}</Avatar>
                                    <div className="info-text">
                                        <div className="info-title">{i.title}</div>
                                        <div className="info-subtitle">{i.subtitle}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>)}
        </div>
    );
}
