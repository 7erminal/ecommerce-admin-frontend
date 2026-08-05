import React, { useEffect, useContext, useMemo, useState } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";

const OrdersPage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [productQuantities, setProductQuantities] = useState<Record<string, string>>({});
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [currency, setCurrency] = useState("");
    const [customerid, setCustomerId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const items = Array.isArray(applicationContext?.items) ? applicationContext.items : [];
    const orders = Array.isArray(applicationContext?.orders) ? applicationContext.orders : [];
    const customers = Array.isArray(applicationContext?.customers) ? applicationContext.customers : [];
    const currencyOptions = useMemo(() => {
        const branchCurrency = applicationContext?.branch?.Country?.Currency?.Symbol;
        const branchCurrencyId = applicationContext?.branch?.Country?.Currency?.CurrencyId;
        if (!branchCurrencyId || !branchCurrency) {
            return [] as Array<{ value: string; label: string }>;
        }

        return [
            {
                value: String(branchCurrencyId),
                label: branchCurrency,
            },
        ];
    }, [applicationContext?.branch]);

    useEffect(()=>{
        document.title = "Orders"
        getOrders();
        getItems();
        getCustomers();
    }, [])

    const getOrders = async () => {
        await applicationContext!.fetchOrders("desc");
    }

    const getItems = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchItems();
    }

    const getCustomers = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchCustomers();
    }

    const resetForm = () => {
        setSelectedProductIds([]);
        setProductQuantities({});
        setPaymentMethodId("");
        setCurrency(currencyOptions[0]?.value || "");
        setCustomerId("");
        setErrorMessage("");
    }

    const handleProductSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
        setSelectedProductIds(selected);
        setProductQuantities((prev) => {
            const next: Record<string, string> = {};
            selected.forEach((id) => {
                next[id] = prev[id] || "1";
            });
            return next;
        });
    }

    const handleQuantityChange = (productId: string, value: string) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productId]: value,
        }));
    }

    const handlePlaceOrder = async () => {
        if (!applicationContext) {
            return;
        }

        if (selectedProductIds.length === 0) {
            setErrorMessage("Select at least one product.");
            return;
        }

        if (!paymentMethodId.trim()) {
            setErrorMessage("Payment method is required.");
            return;
        }

        if (!currency) {
            setErrorMessage("Currency is required.");
            return;
        }

        const products = selectedProductIds.map((productId) => ({
            ProductId: productId,
            Quantity: Math.max(1, Number(productQuantities[productId] || "1")),
        }));

        setSubmitting(true);
        setErrorMessage("");
        const response = await applicationContext.placeOrder({
            Products: products,
            PaymentMethodId: paymentMethodId.trim(),
            Currency: currency,
            OrderDate: new Date().toISOString(),
            CustomerId: customerid,
        });
        setSubmitting(false);

        if (response?.Success) {
            setShowModal(false);
            resetForm();
            await getOrders();
            return;
        }

        setErrorMessage(response?.StatusDesc || "Failed to place order.");
    }


    return <div className="flex flex-col whitespace-normal p-4">
        <section className="mb-6">
            <div className="bg-white border border-red-100 rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
                        <p className="text-sm text-gray-500 mt-1">Create new orders and review recent order requests.</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        style={{
                            background: "#c53030",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            textAlign: "center",
                            border: "2px solid #c53030",
                        }}
                    >
                        Add Order
                    </button>
                </div>
            </div>
        </section>

        <section className="space-y-4">
            {orders.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                    No orders available.
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.OrderId.toString()} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <p className="text-sm text-gray-500">Order Number</p>
                                <h3 className="text-lg font-semibold text-gray-800">{order.OrderNumber}</h3>
                            </div>
                            <div className="text-sm text-gray-600">
                                {order.Currency} {Number(order.Cost || 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </section>

        {showModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white w-full max-w-2xl rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Add Order</h3>
                        <button onClick={() => setShowModal(false)} className="text-sm text-gray-500">Close</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Products</label>
                            <select
                                multiple
                                value={selectedProductIds}
                                onChange={handleProductSelection}
                                className="mt-1 w-full min-h-36 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                {items.map((item) => (
                                    <option key={item.ProductId.toString()} value={item.ProductId.toString()}>
                                        {item.ProductName} (Available: {item.Quantity})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Hold Cmd/Ctrl to select multiple products.</p>
                        </div>

                        {selectedProductIds.map((productId) => {
                            const product = items.find((item) => item.ProductId.toString() === productId);
                            return (
                                <div key={productId} className="md:col-span-2 rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-gray-700">{product?.ProductName || productId}</p>
                                        <input
                                            type="number"
                                            min={1}
                                            value={productQuantities[productId] || "1"}
                                            onChange={(e) => handleQuantityChange(productId, e.target.value)}
                                            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            placeholder="Quantity"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div>
                            <label className="text-sm text-gray-700">Customer</label>
                            <select
                                value={customerid}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                            >
                                <option value="">Select customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.CustomerId.toString()} value={customer.CustomerId.toString()}>
                                        {customer.FullName || customer.Email || `Customer ${customer.CustomerId}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">Payment Method ID</label>
                            <input
                                value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Enter payment method id"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                {currencyOptions.map((curr) => (
                                    <option key={curr.value} value={curr.value}>{curr.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {errorMessage ? (
                        <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
                    ) : null}

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                            style={{ backgroundColor: "#c53030" }}
                        >
                            {submitting ? "Submitting..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
    </div>
}

export default OrdersPage;