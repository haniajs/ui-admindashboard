"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";


interface Order {
    _id : string;
    firstName : string;
    lastName : string;
    phone : number;
    email : string;
    address : string;
    zipCode : string;
    city : string;
    total : number;
    discount : number;
    orderDate : string;
    status : string | null;
    cartItems : { title : string; productImage : string }[];
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        client.fetch(
            `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address,
            city,
            zipCode,
            total,
            discount,
            orderDate,
            status,
            cartItems[]->{
            title,
            productImage
            }
            }`
        )
        .then((data) => setOrders(data))
        .catch((error) => console.error("Error fetching orders", error));
    },[]);

    const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

    const toggleOrderDetails = (orderId : string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
    };

        const handleDelete = async (orderId: string) => {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });
            if (!result.isConfirmed) return;

            try {
                await client.delete(orderId);
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                Swal.fire("Deleted!", "Your order has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting order:", error);
                Swal.fire("Error!", "Something went wrong while deleting.", "error");
            }
        };


        const handleStatusChange = async (orderId : string, newStatus : string) => {
            try{
                await client.patch(orderId)
                .set({status: newStatus})
                .commit();

                setOrders((prevOrders) => prevOrders.map((order) => order._id === orderId ? {
                    ...order,
                    status: newStatus
                } : order)
           );

           if(newStatus === "dispatch") {
            Swal.fire("Dispatched", "The order is now dispatched.", "success");
           } else if (newStatus === "success") {
            Swal.fire("Success", "The order has been completed.", "success");
           }
            } catch (error) {
                console.error("Error updating order status:", error);
                Swal.fire("Error!", "Something went wrong while updating the status.", "error");
            }
        };


 const {user, isSignedIn} = useUser()
 const router = useRouter()
 const [isUserLoaded, setIsUserLoaded] = useState(false)

 useEffect(() => {
    if(isSignedIn && user) {
        setIsUserLoaded(true)
        if(user && user.primaryEmailAddress?.emailAddress !== "haniairshad959@gmail.com"){
            router.replace("/")
        }
    }
 }, [isSignedIn, user, router])

 if(!isUserLoaded) return <p>Loading...</p>

//    function handleStatus(_id: string, value: string): void {
//        throw new Error("Function not implemented.");
//    }

//    function handleDelete(_id: string) {
//        throw new Error("Function not implemented.");
//    }

//    function handleStatus(_id: string, value: string): void {
//        throw new Error("Function not implemented")
//    }


//    function handleDelete(_id: string) {
//        throw new Error("Function not implemented.");
//    }

        return (
            <ProtectedRoute >
            <div className="flex flex-col h-screen bg-gray-100">
                 {/* Navbar open */}
                <nav className="bg-purple-700 text-white p-4 shadow-lg flex justify-between">
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>

                    <div className="flex space-x-4">
                        {["All", "pending", "success", "dispatch"].map((status) => (
                            <button key={status} className={`px-4 py-2 rounded-lg transition-all ${
                                filter === status ? "bg-white text-purple-700 font-bold" : "text-white"
                            }`}
                            onClick={() => setFilter(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
                        ))}
                    </div>
                    <SignedIn>
                        <SignOutButton/>
                    </SignedIn>
                </nav>
                 {/* Navbar close */}

                 
                   {/* Orders Table open */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Orders</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
                            <thead className="bg-gray-50 text-purple-700">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="cursor-pointer hover:bg-purple-100 transition-all" onClick={() => toggleOrderDetails(order._id)}>
                                            <td>{order._id}</td>
                                            <td>{order.firstName} {order.lastName}</td>
                                            <td>{order.address}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>${order.total}</td>
                                        <td>
                                        <select value={order.status || ""} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="bg-gray-100 p-1 rounded">
                                                <option value="pending">Pending</option>
                                                <option value="success">Completed</option>
                                                <option value="dispatch">Dispatched</option>
                                            </select>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button onClick={(e) => {e.stopPropagation();  handleDelete(order._id)}}
                                                 className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-700 transition">Delete</button>
                                            </td>
                                            </tr>
                                            {selectedOrderId === order._id && (
                                                <tr>
                                                    <td colSpan={7} className="bg-gray-50 p-4 transition-all animate-fadeIn">
                                                        <h3 className="font-bold">Order Details</h3>
                                                        <p><strong>Phone:</strong> {order.phone}</p>
                                                        <p><strong>Email:</strong> {order.email}</p>
                                                        <p><strong>City:</strong> {order.city}</p>
                                                        <ul>
                                                            {order.cartItems.map((item, index) => (
                                                                <li key={`${order._id}-${index}`} className="flex items-center gap-2">
                                                                    {item.title}
                                                                    {item.productImage && (
                                                                        <Image src={urlFor(item.productImage).url()} alt={item.title} width={40} height={40}/>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
           </ ProtectedRoute>    
        );
}