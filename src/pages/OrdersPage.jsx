// ✅ FINAL OrdersPage.jsx — merged + return flow + no reload + complaint modal
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import http from "../api/http";
import {
    Accordion, AccordionSummary, AccordionDetails, Stepper, Step, StepLabel,
    StepConnector, Tooltip, IconButton, Divider, CircularProgress, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReplayIcon from "@mui/icons-material/Replay";
import { LocalShipping, CheckCircle, AccessTime } from "@mui/icons-material";
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CancelOrderOtp from "../Common/CancelOrderOtp";
import "./styles/ordersPage.css";
import MobileOrdersPage from "./Mobile/MobileOrdersPage";
import {
    ORDER_STATUS,
    PAYMENT_STATUS,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS
} from "../Constants/constants";

const steps = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.ORDER_PLACED,
    ORDER_STATUS.ORDER_PACKED,
    ORDER_STATUS.IN_TRANSIT,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED,
];

const stepIcons = { 1: 'wallet', 2: 'orderPlaced', 3: 'orderPacked', 4: 'inTransit', 5: 'outForDelivery', 6: 'delivered' };

const QontoConnector = styled(StepConnector)(() => ({
    [`&.${StepConnector.alternativeLabel}`]: { top: 22 },
    [`&.${StepConnector.active} .${StepConnector.line}`]: { borderColor: "#00b894" },
    [`&.${StepConnector.completed} .${StepConnector.line}`]: { borderColor: "#00b894" },
    [`& .${StepConnector.line}`]: { borderColor: "#444", borderTopWidth: 2, borderRadius: 1 }
}));

const CustomStepIcon = ({ icon }) => (
    <div style={{ background: "#fff", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={`/assets/${stepIcons[Number(icon)]}.gif`} style={{ width: 20, height: 20 }} />
    </div>
);

const formatStatus = (status, pay) => {
    if (status === ORDER_STATUS.CANCELLED) return <CancelIcon className="icon cancelled" />;

    // Return flow icons
    if (status === ORDER_STATUS.RETURN_REQUESTED) return <ReplayIcon className="icon refund" />;
    if (status === ORDER_STATUS.RETURN_ACCEPTED) return <ReplayIcon className="icon refund" />;
    if (status === ORDER_STATUS.RETURN_RECEIVED) return <ReplayIcon className="icon refund" />;
    if (status === ORDER_STATUS.RETURN_REJECTED) return <CancelIcon className="icon cancelled" />;
    if (status === ORDER_STATUS.RETURNED) return <CheckCircle className="icon delivered" />;

    // Refund flow icons
    if (pay === PAYMENT_STATUS.REFUND_REQUESTED) return <ReplayIcon className="icon refund" />;
    if (pay === PAYMENT_STATUS.REFUND_INITIATED) return <ReplayIcon className="icon refund" />;
    if (pay === PAYMENT_STATUS.REFUND_DONE) return <CheckCircle className="icon delivered" />;

    // Delivery flow
    if (status === ORDER_STATUS.DELIVERED) return <CheckCircle className="icon delivered" />;
    if (status === ORDER_STATUS.OUT_FOR_DELIVERY) return <LocalShipping className="icon out" />;
    return <AccessTime className="icon processing" />;
};

export default function OrdersPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:768px)");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const [complaintOpen, setComplaintOpen] = useState(false);
    const [complaintOrder, setComplaintOrder] = useState(null);
    const [complaintText, setComplaintText] = useState("");
    const [complaintTitle, setComplaintTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [complaintType, setComplaintType] = useState("COMPLAINT");
    const [successPopup, setSuccessPopup] = useState(false);
    const [createdComplaintId, setCreatedComplaintId] = useState("");
    const [cancelOtpOpen, setCancelOtpOpen] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    // ✅ Fetch orders
    const fetchOrders = async () => {
        if (!user?.emailId) return setLoading(false);
        try {
            const res = await http.get(`/api/users/email/${user.emailId}/orders`);
            const list = res.data.orders || [];
            setOrders(list);
            if (list.length) setExpanded(list[0].orderId);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [user]);

    // ✅ Return Request triggers modal
    const requestReturn = () => {
        setComplaintType("RETURN");
        setComplaintOrder(orders.find(o => o.orderId === expanded));
        setComplaintTitle("Return Request");
        setComplaintOpen(true);
    };

    // ✅ Razorpay
    const openRazorpay = (o) => {
        const r = new window.Razorpay({
            key: o.key,
            amount: o.amount,
            currency: o.currency,
            order_id: o.razorpay_order_id || o.order_id,
            name: "Shinra Deskware",
            handler: (res) => verifyPayment(res, o) // ✅ pass order object
        });
        r.open();
    };


    const startPayment = async (o) => {
        if (o.razorpay_order_id && o.paymentStatus === "PENDING")
            return openRazorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order_id: o.razorpay_order_id,
                amount: (o.total + o.shipping) * 100,
                currency: "INR",
                orderId: o.orderId // ✅ ADD THIS
            });

        const { data } = await http.post("/api/payment/order", {
            emailId: user.emailId,
            items: o.items,
            total: o.total,
            shipping: o.shipping,
            address: o.address,
            orderId: o.orderId
        });
        openRazorpay(data);
    };

    const verifyPayment = async (res, o) => {
        try {
            await http.post("/api/payment/verify", {
                ...res,                  // razorpay ids + signature
                orderId: o.orderId,      // ✅ send correct orderId
                emailId: user.emailId,   // ✅ user email
            });
            await fetchOrders();       // refresh UI
            localStorage.removeItem("cart");
        } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
        }
    };

    // ✅ Cancel
    const selectedOrder = orders.find(o => o.orderId === expanded);
    const cancelOrder = async () => {
        if (!selectedOrder || selectedOrder.currentStep >= 3) return;
        await http.post(`/api/users/email/${user.emailId}/orders/${selectedOrder.orderId}/cancel`);
        await fetchOrders();
    };

    // ✅ Invoice
    const downloadInvoice = async (order) => {
        try {
            setInvoiceLoading(true);
            const response = await http.post(`/api/invoice/generate`,
                {
                    number: order.orderId,
                    companyName: "S H I N R A",
                    companyDescription: "LUXURY DESKWARE",
                    companyEmail: "support@shinra-deskware.com",
                    companyPhone: "+91 6303666387",
                    companyAddress: "Plot 226, HMT Colony, Miyapur, HYD.",
                    customerName: order.address.fullName,
                    customerEmail: order.address.emailId || "N/A",
                    customerPhone: order.address.phoneNumber,
                    customerAddress: order.address.addr1,
                    items: order.items.map(i => {
                        const q = Number(i.count ?? i.qty ?? 1);
                        const p = Number(i.price);
                        return { name: i.title, qty: q, price: p, total: q * p };
                    }),
                    subtotal: order.items.reduce((a, b) => a + (Number(b.count ?? b.qty ?? 1) * Number(b.price)), 0),
                    total: order.items.reduce((a, b) => a + (Number(b.count ?? b.qty ?? 1) * Number(b.price)), 0),
                    orderInfo: {
                        orderStatus: order.status,
                        orderId: order.orderId,
                        trackingId: order.trackingId,
                        paymentMethod: order.paymentMethod,
                        paymentStatus: order.paymentStatus,
                        createdAt: order.createdAt
                    },
                    terms: ["This invoice is valid.", "Thank you for shopping."]
                },
                { responseType: "blob" }
            );
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `invoice-${order.orderId}.pdf`; a.click();
            URL.revokeObjectURL(url);
        } finally {
            setInvoiceLoading(false);
        }
    };

    // ✅ If refund done after return → show RETURNED
    const effectiveStatus = (o) => {
        if (o.status === ORDER_STATUS.RETURN_RECEIVED && o.paymentStatus === PAYMENT_STATUS.REFUND_DONE)
            return ORDER_STATUS.RETURNED;
        return o.status;
    };

    // ✅ Loading
    if (loading)
        return <div className="loading-container"><CircularProgress sx={{ color: "#00b86e" }} /><p>Loading...</p></div>;

    // ✅ No orders
    if (!user || !orders.length)
        return (
            <div className="no-orders">
                <p>No orders yet.</p>
                <Button variant="contained" sx={{ background: "#00b86e" }} onClick={() => navigate("/dashboard/products")}>Shop</Button>
            </div>
        );

    // ✅ Mobile
    if (isMobile)
        return <MobileOrdersPage page={{
            user, orders, startPayment, cancelOrder, cancelOtpOpen, setCancelOtpOpen,
            complaintOpen, setComplaintOpen, complaintOrder, setComplaintOrder,
            complaintText, setComplaintText, complaintTitle, setComplaintTitle,
            priority, setPriority, selectedOrder, expanded, setExpanded,
            requestReturn, complaintType, setComplaintType, fetchOrders, downloadInvoice, invoiceLoading
        }} />;

    // ✅ Desktop
    return (
        <>
            <div className="checkout-container">
                <div className="orders-accordion-section">
                    <h2>Orders</h2>

                    <div className="orders-list">
                        {orders.map((o) => {
                            const shownStatus = effectiveStatus(o);
                            return (
                                <Accordion key={o.orderId} expanded={expanded === o.orderId} onChange={() => setExpanded(o.orderId)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}>
                                        <div className="order-card">
                                            <div className="order-left">
                                                <div className="order-images">
                                                    {o.items.map((i, x) => <img key={x} src={`/assets/${i.key}.png`} />)}
                                                </div>
                                            </div>
                                            <div className="overflow-orders">
                                                <div className="order-info">
                                                    <p><strong>Order</strong><br />{o.orderId}</p>
                                                    <p><strong>Track</strong><br />{o.trackingId}</p>
                                                    <p><strong>Date</strong><br />{new Date(o.createdAt).toLocaleDateString()}</p>
                                                    <p><strong>Total</strong><br />₹{o.total.toLocaleString()}</p>
                                                    <p><strong>Status</strong><br />
                                                        <span className={`status ${shownStatus.toLowerCase()}`}>
                                                            {formatStatus(shownStatus, o.paymentStatus)}{shownStatus}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>

                                    <AccordionDetails>

                                        {/* ✅ Return Flow Messages */}
                                        {shownStatus === ORDER_STATUS.RETURN_REQUESTED && <div className="cancelled-box">Return Requested — Awaiting approval</div>}
                                        {shownStatus === ORDER_STATUS.RETURN_ACCEPTED && <div className="cancelled-box">Return Accepted — Send item back</div>}
                                        {shownStatus === ORDER_STATUS.RETURN_RECEIVED && <div className="cancelled-box">Item Received — Refund in progress</div>}
                                        {shownStatus === ORDER_STATUS.RETURN_REJECTED && <div className="cancelled-box">Return Rejected ❌</div>}
                                        {shownStatus === ORDER_STATUS.RETURNED && <div className="cancelled-box">Refund Completed — Returned ✅</div>}

                                        {/* ✅ Cancelled / Refund */}
                                        {o.status === ORDER_STATUS.CANCELLED && (
                                            <>
                                                {o.paymentStatus === PAYMENT_STATUS.REFUND_REQUESTED && <div className="cancelled-box">Refund Requested — Awaiting approval</div>}
                                                {o.paymentStatus === PAYMENT_STATUS.REFUND_INITIATED && <div className="cancelled-box">Refund Initiated</div>}
                                                {o.paymentStatus === PAYMENT_STATUS.REFUND_DONE && <div className="cancelled-box">Refund Completed ✅</div>}
                                                {![
                                                    PAYMENT_STATUS.REFUND_REQUESTED,
                                                    PAYMENT_STATUS.REFUND_INITIATED,
                                                    PAYMENT_STATUS.REFUND_DONE
                                                ].includes(o.paymentStatus) && <div className="cancelled-box">Order Cancelled ❌</div>}
                                            </>
                                        )}

                                        {/* ✅ Normal Stepper */}
                                        {![
                                            ORDER_STATUS.CANCELLED,
                                            ORDER_STATUS.RETURN_REQUESTED,
                                            ORDER_STATUS.RETURN_ACCEPTED,
                                            ORDER_STATUS.RETURN_RECEIVED,
                                            ORDER_STATUS.RETURN_REJECTED,
                                            ORDER_STATUS.RETURNED
                                        ].includes(shownStatus) && (
                                                <div className="stepper-container">
                                                    <Stepper
                                                        activeStep={o.status === ORDER_STATUS.CANCELLED ? -1 :
                                                            o.paymentStatus === PAYMENT_STATUS.PAID ? (o.currentStep || 1) : 0}
                                                        alternativeLabel
                                                        connector={<QontoConnector />}
                                                    >
                                                        {steps.map((txt, idx) => {
                                                            const s = o.statusHistory?.find(a => a.label === txt);
                                                            return (
                                                                <Step key={txt}>
                                                                    <StepLabel StepIconComponent={CustomStepIcon}>
                                                                        <div className="step-label">
                                                                            {ORDER_STATUS_LABELS[txt] || txt}
                                                                            {idx === 0 && (
                                                                                <div className={`payment-status-badge ${o.paymentStatus.toLowerCase()}`}>
                                                                                    {PAYMENT_STATUS_LABELS[o.paymentStatus] || o.paymentStatus}
                                                                                </div>
                                                                            )}
                                                                            {s && <div className="step-date">{new Date(s.date).toLocaleDateString()}</div>}
                                                                        </div>
                                                                    </StepLabel>
                                                                </Step>
                                                            );
                                                        })}
                                                    </Stepper>
                                                </div>
                                            )}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                </div>

                {/* ✅ Summary Panel */}
                <div className="summary-section">
                    <h2>Order Summary</h2>
                    {selectedOrder && (
                        <div className="summary-card">
                            <div className="summary-actions">

                                {selectedOrder.paymentStatus === PAYMENT_STATUS.PAID && (
                                    <Tooltip title="Invoice">
                                        <div
                                            className="action-item"
                                            onClick={() => !invoiceLoading && downloadInvoice(selectedOrder)}
                                            style={{ opacity: invoiceLoading ? 0.5 : 1, pointerEvents: invoiceLoading ? "none" : "auto" }}
                                        >
                                            {invoiceLoading ? (
                                                <CircularProgress size={20} sx={{ color: "#00b86e" }} />
                                            ) : (
                                                <>
                                                    <PictureAsPdfIcon /><span>Invoice</span>
                                                </>
                                            )}
                                        </div>
                                    </Tooltip>
                                )}

                                <Tooltip title="Complaint">
                                    <div className="action-item" onClick={() => {
                                        setComplaintType("COMPLAINT");
                                        setComplaintOrder(selectedOrder);
                                        setComplaintOpen(true);
                                        setComplaintTitle("");
                                    }}>
                                        <ReportProblemIcon /><span>Complaint</span>
                                    </div>
                                </Tooltip>

                                {selectedOrder.paymentStatus === PAYMENT_STATUS.PENDING && (
                                    <Tooltip title="Pay">
                                        <div className="action-item" onClick={() => startPayment(selectedOrder)}>
                                            <CurrencyRupeeIcon /><span>Pay</span>
                                        </div>
                                    </Tooltip>
                                )}

                                {selectedOrder.currentStep <= 2 &&
                                    ![
                                        PAYMENT_STATUS.REFUND_REQUESTED,
                                        PAYMENT_STATUS.REFUND_INITIATED,
                                        PAYMENT_STATUS.REFUND_DONE
                                    ].includes(selectedOrder.paymentStatus) && (
                                        <Tooltip title="Cancel">
                                            <div className="action-item" onClick={() => setCancelOtpOpen(true)}>
                                                <CancelIcon /><span>Cancel</span>
                                            </div>
                                        </Tooltip>
                                    )}

                                {/* ✅ Return */}
                                {selectedOrder.status === ORDER_STATUS.DELIVERED &&
                                    selectedOrder.paymentStatus === PAYMENT_STATUS.PAID &&
                                    ![
                                        ORDER_STATUS.RETURN_REQUESTED,
                                        ORDER_STATUS.RETURN_ACCEPTED,
                                        ORDER_STATUS.RETURN_RECEIVED,
                                        ORDER_STATUS.RETURN_REJECTED,
                                        ORDER_STATUS.RETURNED
                                    ].includes(selectedOrder.status) && (
                                        <Tooltip title="Return Order">
                                            <div className="action-item" onClick={requestReturn}>
                                                <Rotate90DegreesCcwIcon /><span>Return</span>
                                            </div>
                                        </Tooltip>
                                    )}
                            </div>

                            <div className="summary-row"><span>Date:</span><span>{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                            <div className="summary-row"><span>Address:</span><span>{selectedOrder.address?.addr1}</span></div>
                            <div className="summary-row"><span>Name:</span><span>{selectedOrder.address?.fullName}</span></div>
                            <hr />
                            <div className="summary-row"><span>Payment:</span><span>{selectedOrder.paymentMethod}</span></div>
                            <div className="summary-row"><span>Delivery:</span><span>{selectedOrder.deliveryMethod}</span></div>
                            <hr />
                            <div className="summary-row"><span>Items:</span><span>₹{selectedOrder.total.toLocaleString()}</span></div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Complaint / Return Modal */}
            <Dialog open={complaintOpen} onClose={() => setComplaintOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ style: { backgroundColor: "#1e1e1e", color: "white", borderRadius: 14, padding: "15px 20px" } }}>

                <div style={{ background: "#1c1c1c", padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
                    <strong>Order ID:</strong> {complaintOrder?.orderId}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <DialogTitle style={{ padding: 0, fontWeight: 600 }}>
                        {complaintType === "RETURN" ? "Return Request" : "Raise a Complaint"}
                    </DialogTitle>
                    <IconButton onClick={() => setComplaintOpen(false)} sx={{ color: "#888" }}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <DialogContent>
                    <TextField fullWidth label="Title" value={complaintTitle}
                        onChange={e => setComplaintTitle(e.target.value)}
                        sx={{ mb: 2, "& .MuiInputBase-root": { background: "#1d1d1d", color: "#fff" } }}
                    />
                    <TextField fullWidth multiline minRows={4} placeholder="Describe your issue..."
                        value={complaintText} onChange={e => setComplaintText(e.target.value)}
                        InputProps={{ style: { background: "#2b2b2b", color: "white", borderRadius: 10 } }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setComplaintOpen(false)} sx={{ color: "#bbb" }}>Cancel</Button>
                    <Button variant="contained" sx={{ background: "#00b86e" }}
                        disabled={!complaintText.trim() || !complaintTitle.trim()}
                        onClick={async () => {
                            try {
                                const { data } = await http.post("/api/complaints", {
                                    orderId: complaintOrder.orderId,
                                    emailId: user.emailId,
                                    type: complaintType,
                                    title: complaintTitle.trim(),
                                    message: complaintText.trim()
                                });
                                setComplaintText("");
                                setComplaintTitle("");
                                setComplaintOpen(false);
                                setComplaintType("COMPLAINT");
                                setCreatedComplaintId(data.complaint._id);
                                setSuccessPopup(true);
                                await fetchOrders();
                            } catch {
                                alert("Failed, try again.");
                            }
                        }}
                    >Submit</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={successPopup}
                onClose={() => setSuccessPopup(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        borderRadius: 14,
                        padding: "20px"
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
                    ✅ Request Submitted
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", fontSize: 14 }}>
                    Your {complaintType === "RETURN" ? "return request" : "complaint"} has been created.<br />
                    <b>ID: {createdComplaintId}</b><br /><br />
                    We will get back to you within 24 hours.
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{ background: "#00b86e" }}
                        onClick={() => setSuccessPopup(false)}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ✅ Cancel OTP */}
            <CancelOrderOtp open={cancelOtpOpen} onClose={() => setCancelOtpOpen(false)}
                userEmail={user.emailId} onVerified={cancelOrder} />
        </>
    );
}
