// CartPage.jsx (updated)
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
import "./styles/cartPage.css";
import OtpPopup from "../Common/OtpPopup";
import http from "../api/http";
import { useUser } from "../context/UserContext";
import { State, City } from "country-state-city";

const PaymentLogos = { Phonepe: 'phonepe', Paytm: 'paytm', Gpay: 'gpay' };
const DeliveryLogos = { Fast: 'rabbit', Normal: 'tortoise' };
const Info = [
    { icon: '/assets/outForDelivery.gif', bg: "#FCE7F3", title: "Free Shipping", subtitle: "For online payments" },
    { icon: '/assets/onlineSupport.gif', bg: "#F3F4F6", title: "Call Us Anytime", subtitle: "+91 93464 07877" },
    { icon: '/assets/whatsapp.gif', bg: "#DCFCE7", title: "Chat With Us", subtitle: "We offer 24-hour chat support" },
    { icon: '/assets/corrugatedBox.gif', bg: "#FEF9C3", title: "Bulk Orders", subtitle: "Save upto 30% on bulk orders" },
];

const formatNumber = n => Number(n).toLocaleString('en-IN');

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RX = /^[a-zA-Z][a-zA-Z\s'.-]{2,49}$/;
const CITY_RX = /^[A-Za-z][A-Za-z\s.-]{2,}$/;
const PIN_RX = /^[1-9][0-9]{5}$/;
const PHONE_RX = /^[6-9]\d{9}$/;

const addressRequiredKeys = ["fullName", "emailId", "phoneNumber", "state", "city", "pinCode", "addr1"];

function validateValue(name, value) {
    const val = String(value ?? "").trim();
    switch (name) {
        case "fullName":
            if (!val) return "Full Name is required";
            if (!NAME_RX.test(val)) return "Enter a valid name (min 3 chars)";
            return "";
        case "emailId":
            if (!val) return "Email missing in profile";
            if (!EMAIL_RX.test(val)) return "Invalid email in profile";
            return "";
        case "phoneNumber":
            if (!PHONE_RX.test(val)) return "Enter valid 10-digit Indian mobile, You'll receive order updates";
            return "";
        case "state":
            if (!val) return "State is required";
            return "";
        case "city":
            if (!CITY_RX.test(val)) return "Enter valid city";
            return "";
        case "pinCode":
            if (!PIN_RX.test(val)) return "Enter valid 6-digit pinCode";
            return "";
        case "addr1":
            if (val.length < 10) return "Address must be at least 10 characters";
            return "";
        default:
            return "";
    }
}

function allAddressValid(address, currentErrors = {}) {
    const fieldErrors = addressRequiredKeys.map(k => validateValue(k, address[k]));
    const anyNewErrors = fieldErrors.some(msg => !!msg);
    const anyExisting = Object.values(currentErrors).some(Boolean);
    return { ok: !anyNewErrors && !anyExisting, fieldErrorsByKey: Object.fromEntries(addressRequiredKeys.map((k, i) => [k, fieldErrors[i]])) };
}

const CartItem = ({ item, onQtyChange, onRemove }) => {
    const key = item.key ?? item.id;
    const count = item.count ?? item.qty ?? 1;

    return (
        <>
            {/* 🖥️ Desktop View */}
            <div className="cart-item cart-item-desktop">
                <div className="left">
                    <img
                        src={`/assets/${key}.png`}
                        alt={key}
                        className="item-image"
                        loading="lazy"
                    />
                </div>
                <div className="middle">
                    <h4>{item.title ?? item.name ?? "Product"}</h4>
                    <div className="price-left">
                        <span className="offer-price">₹{formatNumber(item.price)}</span>
                        {item.originalPrice && (
                            <span className="original-price">
                                ₹{formatNumber(item.originalPrice)}
                            </span>
                        )}
                        {item.discount && (
                            <span className="offer-pill">{item.discount}% OFF</span>
                        )}
                    </div>
                    <div className="item-icons">
                        <span>🚚 Free Shipping</span>
                    </div>
                </div>
                <div className="right">
                    <div className="quantity-box">
                        <IconButton size="small" onClick={() => onQtyChange(key, -1)}>
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        <span>{count}</span>
                        <IconButton size="small" onClick={() => onQtyChange(key, 1)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <button className="cart-action remove" onClick={() => onRemove(key)}>
                        <DeleteIcon fontSize="small" /> Remove
                    </button>
                </div>
            </div>

            {/* 📱 Mobile View */}
            <div className="cart-item-mobile">
                <div className="mobile-top-row">
                    <img
                        src={`/assets/${key}.png`}
                        alt={key}
                        className="mobile-image"
                        loading="lazy"
                    />
                    <div className="mobile-controls">
                        <div className="quantity-box">
                            <IconButton size="small" onClick={() => onQtyChange(key, -1)}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <span>{count}</span>
                            <IconButton size="small" onClick={() => onQtyChange(key, 1)}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </div>
                        <button className="cart-action remove" onClick={() => onRemove(key)}>
                            <DeleteIcon fontSize="small" /> Remove
                        </button>
                    </div>
                </div>

                <div className="mobile-bottom">
                    <h4 className="item-name">{item.title ?? item.name ?? "Product"}</h4>
                    <div className="price-left">
                        <span className="offer-price">₹{formatNumber(item.price)}</span>
                        {item.originalPrice && (
                            <span className="original-price">
                                ₹{formatNumber(item.originalPrice)}
                            </span>
                        )}
                        {item.discount && (
                            <span className="offer-pill">{item.discount}% OFF</span>
                        )}
                    </div>
                    <div className="item-icons">
                        <span>🚚 Free Shipping</span>
                    </div>
                </div>
            </div>
        </>
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
        pinCode: "",
        addr1: ""
    });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showCheckout, setShowCheckout] = useState(false);
    const [openOtp, setOpenOtp] = useState(false);
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
        pinCode: useRef(null),
        addr1: useRef(null),
    };

    const total = products.reduce((a, i) => a + Number(i.price) * (i.count ?? i.qty ?? 1), 0);
    const shipping = 0;
    const discount = couponCode === "FIRST100" ? -500 : 0;
    const subtotal = total + shipping + discount;

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"));
        if (user) {
            setAddress(prev => ({
                ...prev,
                fullName: user.fullName || "",
                emailId: user.emailId || "",
                phoneNumber: user.phoneNumber || "",
                state: user.address?.state || "",
                city: user.address?.city || "",
                pinCode: user.address?.pinCode || "",
                addr1: user.address?.addr1 || ""
            }));
            if (user.address?.state) {
                const st = State.getStatesOfCountry("IN").find(s => s.name === user.address.state);
                if (st) setCities(City.getCitiesOfState("IN", st.isoCode));
            }
        }
    }, [user]);

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setProducts(localCart);
        if (user?._id && localCart.length) {
            // <-- changed: session-based cart save endpoint (no userId in URL)
            http.post(`/api/users/cart/save`, { cart: localCart }).catch(console.error);
        }
    }, [user]);

    const persist = (next) => {
        setProducts(next);
        localStorage.setItem("cart", JSON.stringify(next));
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
            // session-based save
            await http.post(`/api/users/cart/save`, { cart: products }).catch(console.error);
            setShowCheckout(true);
        } else {
            setOpenOtp(true);
        }
    };

    const validateField = (name, value) => {
        const msg = validateValue(name, value);
        setErrors(prev => (prev[name] === msg ? prev : { ...prev, [name]: msg }));
        return msg === "";
    };

    const isAddressValid = () => {
        let firstInvalidKey = null;
        const nextErrors = {};
        for (const key of addressRequiredKeys) {
            const msg = validateValue(key, address[key]);
            nextErrors[key] = msg;
            if (!firstInvalidKey && msg) firstInvalidKey = key;
        }
        setErrors(nextErrors);
        if (firstInvalidKey) {
            fieldRefs[firstInvalidKey].current?.scrollIntoView({ behavior: "smooth", block: "center" });
            fieldRefs[firstInvalidKey].current?.focus();
            return false;
        }
        return true;
    };

    const handleChange = (name, value) => {
        if (name === "state") {
            const st = states.find(s => s.name === value);
            setCities(st ? City.getCitiesOfState("IN", st.isoCode) : []);
            setAddress(prev => ({ ...prev, city: "" }));
        }
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
            if (!user?._id) {
                // ensure session: should not happen (OTP flow sets session), but guard
                alert("Please login or verify OTP before placing the order.");
                setOpenOtp(true);
                return;
            }
            setIsPlacingOrder(true);
            // <-- removed emailId from payload: server uses session
            const { data } = await http.post("/api/payment/neworder", {
                items: products,
                total,
                shipping,
                address,
            });
            openRazorpay(data, data.orderId);
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
            order_id: razorData.razorpay_order_id,
            name: "Shinra Deskware",
            description: "Payment for SHINRA",
            handler: async (response) => {
                try {
                    // <-- removed emailId: server identifies user via session cookie
                    await http.post("/api/payment/verify", {
                        ...response,
                        orderId,
                    });
                    await http.post(`/api/payment/${orderId}/confirm`);
                    localStorage.removeItem("cart");
                    setProducts([]);
                    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: 0 } }));
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2000);
                } catch (err) {
                    console.error("Payment complete handler error:", err);
                    localStorage.removeItem("cart");
                    setProducts([]);
                    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: 0 } }));
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2500);
                }
            },
            modal: {
                ondismiss: () => {
                    // keep UX same (clean cart on dismiss as original)
                    localStorage.removeItem("cart");
                    setProducts([]);
                    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: 0 } }));
                    setOrderConfirmed(true);
                    setTimeout(() => navigate("/dashboard/orders"), 2500);
                },
            },
            theme: { color: "#7A5CF4" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const { ok: addressAllOk } = allAddressValid(address, errors);
    const hasAddressErrors = !addressAllOk;

    const canPlaceOrder = () => {
        return (
            !paymentMethod ||
            !deliveryMethod ||
            hasAddressErrors ||
            isPlacingOrder
        );
    };

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

                                <Accordion
                                    expanded={expanded === "address"}
                                    sx={{
                                        border: hasAddressErrors ? "1px solid #ef5350" : "1px solid transparent",
                                        borderRadius: 2
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            expanded === "address"
                                                ? <SaveIcon sx={{ color: hasAddressErrors ? "inherit" : "green" }} />
                                                : <EditIcon />
                                        }
                                        onClick={() => {
                                            if (expanded === "address") {
                                                const valid = isAddressValid();
                                                if (valid) setExpanded("payment");
                                            } else {
                                                setExpanded("address");
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
                                                {["fullName", "emailId", "phoneNumber", "state", "city", "pinCode", "addr1"].map((field) => {
                                                    const label = {
                                                        fullName: "Full Name",
                                                        emailId: "Email",
                                                        phoneNumber: "Phone Number",
                                                        state: "State",
                                                        city: "City",
                                                        pinCode: "PinCode",
                                                        addr1: "Address Line 1"
                                                    }[field];
                                                    const isSelect = field === "state" || field === "city";
                                                    return (
                                                        <TextField
                                                            key={field}
                                                            fullWidth
                                                            margin="normal"
                                                            label={label}
                                                            inputRef={fieldRefs[field]}
                                                            value={address[field]}
                                                            disabled={field === "emailId"}
                                                            onChange={(e) => handleChange(field, e.target.value)}
                                                            select={isSelect}
                                                            SelectProps={isSelect ? { native: true } : undefined}
                                                            InputLabelProps={isSelect ? { shrink: true } : undefined}
                                                            error={!!errors[field]}
                                                            helperText={errors[field] || " "}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        {getAdornmentIcon(field)}
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        >
                                                            {isSelect && field === "state" && (
                                                                <>
                                                                    <option value="">Select State</option>
                                                                    {states.map(s => (
                                                                        <option key={s.isoCode} value={s.name}>{s.name}</option>
                                                                    ))}
                                                                </>
                                                            )}
                                                            {isSelect && field === "city" && (
                                                                <>
                                                                    <option value="">Select City</option>
                                                                    {cities.map(c => (
                                                                        <option key={c.name} value={c.name}>{c.name}</option>
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

                                <Accordion expanded={expanded === "payment"} disabled={!addressAllOk} onChange={(_, e) => setExpanded(e ? "payment" : false)}>
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
                                            {address.fullName && <div className="address-preview-row"><span className="address-preview-label">👤 Name:</span><span className="address-preview-value">{address.fullName}</span></div>}
                                            <div className="address-preview-row"><span className="address-preview-label">📞 Phone:</span><span className="address-preview-value">{address.phoneNumber}</span></div>
                                            {address.emailId && <div className="address-preview-row"><span className="address-preview-label">✉️ Email:</span><span className="address-preview-value">{address.emailId}</span></div>}
                                            {address.addr1 && <div className="address-preview-row"><span className="address-preview-label">🏠 Address:</span><span className="address-preview-value">{address.addr1}</span></div>}
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
                                    <Avatar className="info-icon" sx={{ backgroundColor: i.bg }}>
                                        <img
                                            src={i.icon}
                                            alt={i.title}
                                            style={{ width: "70%", height: "70%", objectFit: "contain" }}
                                        />
                                    </Avatar>
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
