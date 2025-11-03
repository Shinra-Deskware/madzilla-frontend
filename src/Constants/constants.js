// client/src/Constants/constants.js
export const ORDER_STATUS = {
    PENDING: "PENDING",
    ORDER_PLACED: "ORDER_PLACED",
    ORDER_PACKED: "ORDER_PACKED",
    IN_TRANSIT: "IN_TRANSIT",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",

    RETURN_REQUESTED: "RETURN_REQUESTED",
    RETURN_ACCEPTED: "RETURN_ACCEPTED",
    RETURN_RECEIVED: "RETURN_RECEIVED",
    RETURN_REJECTED: "RETURN_REJECTED",
    RETURNED: "RETURNED",

    CANCELLED: "CANCELLED",
    PAYMENT_FAILED: "Payment Failed",
};

export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
    REFUND_REQUESTED: "REFUND_REQUESTED",
    REFUND_INITIATED: "REFUND_INITIATED",
    REFUND_FAILED: "REFUND_FAILED",
    REFUND_DONE: "REFUND_DONE",
    PAYMENT_FAILED: "PAYMENT_FAILED"
};

export const ORDER_STATUS_LABELS = {
    PENDING: "Status",
    ORDER_PLACED: "Order Placed",
    ORDER_PACKED: "Packed",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",

    RETURN_REQUESTED: "Return Requested",
    RETURN_ACCEPTED: "Return Accepted",
    RETURN_RECEIVED: "Item Received",
    RETURN_REJECTED: "Return Rejected",
    RETURNED: "Returned",

    CANCELLED: "Cancelled",
    "Payment Failed": "Payment Failed",
};

export const PAYMENT_STATUS_LABELS = {
    PENDING: "Payment Pending",
    PAID: "Paid",
    FAILED: "Payment Failed",
    CANCELLED: "Cancelled",
    REFUND_REQUESTED: "Refund Requested",
    REFUND_INITIATED: "Refund Initiated",
    REFUND_FAILED: "Refund Failed",
    REFUND_DONE: "Refund Completed",
};
