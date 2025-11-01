import React, { useState } from "react";
import {
    SwipeableDrawer, Stepper, Step, StepLabel, TextField, Tooltip, Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOrderOtp from "../../Common/CancelOrderOtp";
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import "../styles/ordersPage.css";
import {
    ORDER_STATUS,
    PAYMENT_STATUS,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS
} from "../../Constants/constants";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import http from "../../api/http";

const steps = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.ORDER_PLACED,
    ORDER_STATUS.ORDER_PACKED,
    ORDER_STATUS.IN_TRANSIT,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED,
];

const stepIcons = { 1: 'wallet', 2: 'orderPlaced', 3: 'orderPacked', 4: 'inTransit', 5: 'outForDelivery', 6: 'delivered' };

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: "#00b894" },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: "#00b894" },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#444",
        borderTopWidth: 2,
        borderRadius: 1,
    },
}));

const CustomStepIcon = ({ icon }) => (
    <div style={{
        background: "#fff", width: 36, height: 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center"
    }}>
        <img src={`/assets/${stepIcons[Number(icon)]}.gif`} style={{ width: 20, height: 20 }} />
    </div>
);

export default function MobileOrdersPage({ page }) {
    const {
        orders, startPayment, cancelOrder, cancelOtpOpen, setCancelOtpOpen,
        complaintOpen, setComplaintOpen, complaintOrder, setComplaintOrder,
        complaintText, setComplaintText, complaintTitle, setComplaintTitle,
        priority, setPriority, photo, setPhoto, photoPreview, setPhotoPreview,
        fetchOrders, complaintType, setComplaintType, downloadInvoice, invoiceLoading
    } = page;

    const [mobileOrder, setMobileOrder] = useState(null);
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

    // ✅ helper for final status check
    const effectiveStatus = (o) => {
        if (o.status === ORDER_STATUS.RETURN_RECEIVED && o.paymentStatus === PAYMENT_STATUS.REFUND_DONE)
            return ORDER_STATUS.RETURNED;
        return o.status;
    };
    return (
        <>
            <div className="mobile-orders-wrapper">
                <h2>Orders</h2>

                {orders.map(o => (
                    <div key={o.orderId} className={`mobile-order-card ${o.status.replace(/\s+/g, '').toLowerCase()}`}>
                        <div className="mobile-top">
                            <span className="mobile-order-id">{o.orderId}</span>
                            <button className="mobile-summary-btn"
                                onClick={() => { setMobileOrder(o); setMobileSummaryOpen(true); }}>
                                View
                            </button>
                        </div>

                        <div className="mobile-meta">
                            {new Date(o.createdAt).toLocaleDateString("en-IN")}
                            <span className="price-tag">₹{o.total.toLocaleString()}</span>
                        </div>

                        <div className="mobile-thumb-row">
                            {o.items.slice(0, 3).map((i, idx) => (
                                <img key={idx} src={`/assets/${i.key}.png`} />
                            ))}
                        </div>

                        <div className="mobile-status-row">
                            <div className={`mobile-status-dot ${effectiveStatus(o).replace(/\s+/g, '').toLowerCase()}`} />
                            {ORDER_STATUS_LABELS[effectiveStatus(o)] || effectiveStatus(o)}
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ ORDER SUMMARY DRAWER */}
            <SwipeableDrawer
                anchor="bottom"
                open={mobileSummaryOpen}
                onClose={() => setMobileSummaryOpen(false)}
                className="mobile-swipeable-drawer"
            >
                <div className="drawer-content">
                    <h3>Order Summary</h3>

                    {mobileOrder && (
                        <>
                            <div className="summary-card">
                                <div className="summary-actions">
                                    {mobileOrder.paymentStatus === "PAID" &&
                                        <Tooltip title="Invoice">
                                            <div
                                                className="action-item"
                                                onClick={() => !invoiceLoading && downloadInvoice(mobileOrder)}
                                                style={{ opacity: invoiceLoading ? 0.4 : 1 }}
                                            >
                                                {invoiceLoading ? (
                                                    <div className="spinner-small"></div>
                                                ) : (
                                                    <>
                                                        <PictureAsPdfIcon /><span>Invoice</span>
                                                    </>
                                                )}
                                            </div>
                                        </Tooltip>
                                    }

                                    <Tooltip title="Complaint">
                                        <div className="action-item"
                                            onClick={() => {
                                                setComplaintType("COMPLAINT");
                                                setComplaintOrder(mobileOrder);
                                                setComplaintOpen(true);
                                                setComplaintTitle("");
                                            }}>
                                            <ReportProblemIcon /><span>Complaint</span>
                                        </div>
                                    </Tooltip>

                                    {mobileOrder.paymentStatus === "PENDING" &&
                                        <Tooltip title="Pay">
                                            <div className="action-item" onClick={() => { startPayment(mobileOrder); setMobileSummaryOpen(false) }}>
                                                <CurrencyRupeeIcon /><span>Pay</span>
                                            </div>
                                        </Tooltip>
                                    }

                                    {/* ✅ Cancel Only if eligible */}
                                    {mobileOrder.currentStep <= 2 &&
                                        mobileOrder.status !== ORDER_STATUS.CANCELLED &&
                                        mobileOrder.paymentStatus !== PAYMENT_STATUS.REFUND_DONE && (
                                            <Tooltip title="Cancel Order">
                                                <div className="action-item" onClick={() => setCancelOtpOpen(true)}>
                                                    <CancelIcon /><span>Cancel</span>
                                                </div>
                                            </Tooltip>
                                        )}

                                    {/* ✅ Return Button */}
                                    {mobileOrder.status === ORDER_STATUS.DELIVERED &&
                                        mobileOrder.paymentStatus === PAYMENT_STATUS.PAID &&
                                        ![
                                            ORDER_STATUS.RETURN_REQUESTED,
                                            ORDER_STATUS.RETURN_ACCEPTED,
                                            ORDER_STATUS.RETURN_RECEIVED,
                                            ORDER_STATUS.RETURNED
                                        ].includes(mobileOrder.status) && (
                                            <Tooltip title="Return Order">
                                                <div className="action-item" onClick={() => {
                                                    setComplaintType("RETURN");
                                                    setComplaintOrder(mobileOrder);
                                                    setComplaintTitle("Return Request");
                                                    setComplaintOpen(true);
                                                }}>
                                                    <Rotate90DegreesCcwIcon /><span>Return</span>
                                                </div>
                                            </Tooltip>
                                        )}
                                </div>

                                {/* Order Info */}
                                <div className="summary-row"><span>📅 Date:</span><span>{new Date(mobileOrder.createdAt).toLocaleString()}</span></div>
                                <div className="summary-row"><span>👤 Name:</span><span>{mobileOrder.address?.fullName}</span></div>
                                <div className="summary-row address-block">
                                    <span>🏠 Address:</span>
                                    <span>
                                        {mobileOrder.address?.addr1}<br />
                                        {mobileOrder.address?.city}, {mobileOrder.address?.state} — {mobileOrder.address?.pincode}
                                    </span>
                                </div>
                                <hr />
                                <div className="summary-row"><span>💳 Payment:</span><span>{mobileOrder.paymentMethod}</span></div>
                                <hr />
                                <div className="summary-row"><span>Items ({mobileOrder.items.length})</span><span>₹{mobileOrder.total}</span></div>
                            </div>

                            {/* ✅ Return & Refund Flow */}
                            <div className="mobile-stepper-wrap">
                                {(() => {
                                    const st = effectiveStatus(mobileOrder);

                                    if (st === ORDER_STATUS.RETURN_REQUESTED)
                                        return <div className="cancelled-box">Return Requested — Awaiting Approval</div>;

                                    if (st === ORDER_STATUS.RETURN_ACCEPTED)
                                        return <div className="cancelled-box">Return Accepted — Send item back</div>;

                                    if (st === ORDER_STATUS.RETURN_RECEIVED)
                                        return <div className="cancelled-box">Item Received — Refund in progress</div>;

                                    if (st === ORDER_STATUS.RETURN_REJECTED)
                                        return <div className="cancelled-box">Return Rejected ❌</div>;

                                    if (st === ORDER_STATUS.RETURNED)
                                        return <div className="cancelled-box">Refund Completed — Returned ✅</div>;

                                    if (mobileOrder.status === ORDER_STATUS.CANCELLED) {
                                        if (mobileOrder.paymentStatus === PAYMENT_STATUS.REFUND_REQUESTED)
                                            return <div className="cancelled-box">Refund Requested — Awaiting Approval</div>;

                                        if (mobileOrder.paymentStatus === PAYMENT_STATUS.REFUND_INITIATED)
                                            return <div className="cancelled-box">Refund Initiated</div>;

                                        if (mobileOrder.paymentStatus === PAYMENT_STATUS.REFUND_DONE)
                                            return <div className="cancelled-box">Refund Completed ✅</div>;

                                        return <div className="cancelled-box">Order Cancelled ❌</div>;
                                    }

                                    return (
                                        <Stepper
                                            activeStep={mobileOrder.currentStep || 1}
                                            alternativeLabel
                                            connector={<QontoConnector />}
                                        >
                                            {steps.map((txt, i) => {
                                                const s = mobileOrder.statusHistory?.find(a => a.label === txt);
                                                return (
                                                    <Step key={txt} className="mobile-each-step">
                                                        <StepLabel StepIconComponent={CustomStepIcon}>
                                                            <div className="step-label">
                                                                {ORDER_STATUS_LABELS[txt] || txt}

                                                                {i === 0 && (
                                                                    <div className={`payment-status-badge ${mobileOrder.paymentStatus.toLowerCase()}`}>
                                                                        {PAYMENT_STATUS_LABELS[mobileOrder.paymentStatus]}
                                                                    </div>
                                                                )}

                                                                {s && (
                                                                    <div className="step-date">
                                                                        {new Date(s.date).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </StepLabel>
                                                    </Step>
                                                );
                                            })}
                                        </Stepper>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                </div>
            </SwipeableDrawer>

            {/* ✅ Complaint/Return Drawer */}
            <SwipeableDrawer
                anchor="bottom"
                open={complaintOpen}
                onClose={() => setComplaintOpen(false)}
                PaperProps={{ className: "mobile-bottom-sheet" }}
            >
                <div className="sheet-container">
                    <div style={{
                        width: "45px", height: "4px", background: "#666", borderRadius: 8,
                        margin: "0 auto 12px"
                    }} />

                    <h3 style={{ marginBottom: 5, fontWeight: 600 }}>
                        {complaintType === "RETURN" ? "Return Request" : "New Complaint"}
                    </h3>

                    {complaintOrder && (
                        <div style={{
                            background: "#1c1c1c", padding: 10, borderRadius: 8,
                            marginBottom: 14, fontSize: 13
                        }}>
                            <strong>Order ID:</strong> {complaintOrder.orderId}
                        </div>
                    )}

                    <TextField
                        fullWidth label="Title" value={complaintTitle}
                        onChange={(e) => setComplaintTitle(e.target.value)}
                        sx={{ mb: 2, "& .MuiInputBase-root": { background: "#1d1d1d", color: "#fff" } }}
                    />

                    <TextField
                        fullWidth multiline minRows={4} label="Description"
                        value={complaintText}
                        onChange={(e) => setComplaintText(e.target.value)}
                        sx={{ mb: 2, "& .MuiInputBase-root": { background: "#1d1d1d", color: "#fff" } }}
                    />

                    <Button
                        fullWidth variant="contained"
                        sx={{ background: "#00b86e", borderRadius: 8, py: 1.2, fontWeight: 600 }}
                        disabled={!complaintText.trim() || !complaintTitle.trim()}
                        onClick={async () => {
                            try {
                                await http.post("/api/complaints", {
                                    orderId: complaintOrder.orderId,
                                    userPhone: page?.user?.phoneNumber,
                                    type: complaintType,
                                    title: complaintTitle.trim(),
                                    message: complaintText.trim()
                                });
                                setComplaintText("");
                                setComplaintTitle("");
                                setComplaintOpen(false);
                                setComplaintType(null);
                                if (fetchOrders) await fetchOrders();
                            } catch (e) {
                                alert("Failed. Try again.");
                            }
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </SwipeableDrawer>

            <CancelOrderOtp
                open={cancelOtpOpen}
                onClose={() => setCancelOtpOpen(false)}
                userPhone={page?.user?.phoneNumber}
                onVerified={cancelOrder}
            />
        </>
    );
}
