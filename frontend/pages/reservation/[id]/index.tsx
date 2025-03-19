// @ts-nocheck
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/AuthContext";
import useReservation from "@/lib/hooks/useReservation";
import { Reservation, ReservationStatus, Role } from "@/lib/types";
import { useReservationContext } from "@/ReservationContext";
import ActionButton from "@/components/common/actionButton";
import useAuthentication from "@/lib/hooks/useAuthentication";
import { useNotification } from "@/lib/hooks/useNotification";
import axios from "axios";
import config from "@/lib/config";

const ReservationDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const { getReservationById, requestReturn, approveReturn, rejectReturn } = useReservation();
    const { reservationState: { reservation } } = useReservationContext();

    const { isAuthenticated, role } = useAuth();
    const { token } = useAuthentication();
    const { onError } = useNotification();

    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        if (isAuthenticated && id) {
            getReservationById(id as string);
        }
    }, [isAuthenticated, router.query, token]);

    // Handles image selection and live preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (filesArray.length !== 5) {
                onError("Please select exactly 5 images for the car return.");
                return;
            }
            setImages(filesArray);
            setPreviewImages(filesArray.map((file) => URL.createObjectURL(file)));
        }
    };

    // Upload images to backend, receive URLs in response
    const uploadImages = async (): Promise<string[]> => {
        try {
            const formData = new FormData();
            images.forEach((file) => formData.append("images", file));

            // Send a POST request to upload images
            const response = await axios.post(`${config.image}/upload-images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    bearer: token,
                },
            });

            return response.data.imageUrls;
        } catch (error) {
            console.error("Image upload failed:", error);
            onError("Failed to upload images. Please try again.");
            throw new Error("Image upload failed");
        }
    };

    const handleRequestReturn = async () => {
        if (images.length < 5) {
            onError("Please provide all 5 images.");
            return;
        }

        try {
            const imageUrls = await uploadImages();
            // Request return, pass image URLs as string, the backend handles further processing of other values of the picture model
            await requestReturn(id as string, { pictures: imageUrls });

            router.back();
        } catch (error) {
            console.error(error);
            onError("Failed to request return. Please try again.");
        }
    };

    const handleApproveReturn = async () => {
        try {
            await approveReturn(id as string, reservation?.pictures || []);
            router.back();
        } catch (error) {
            console.error(error);
            onError("Failed to approve return.");
        }
    };

    const handleRejectReturn = async () => {
        try {
            await rejectReturn(id as string, reservation?.pictures || []);
            router.back();
        } catch (error) {
            console.error(error);
            onError("Failed to reject return.");
        }
    };

    return (
        <>
            <Head>
                <title>Reservation Details {config.titleWithSeparator}</title>
            </Head>

            <div className="min-h-screen pt-28 flex items-center justify-center">
                <div className="container mx-auto">
                    <div className="mx-auto bg-white">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Reservation Details</h2>

                        {/* 🚗 Car & Garage Info Section */}
                        <div className="bg-white p-8 rounded-xl mb-6 shadow-lg backdrop-blur-lg border border-gray-200">
                            <h4 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
                                Vehicle Details
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 🚘 Car Make & Model */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Car</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-blue-500 text-xl mr-2">🚘</span>
                                        {reservation?.car.make} {reservation?.car.model} ({reservation?.car.firstRegistration})
                                    </p>
                                </div>

                                {/* ⛽ Fuel Type */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Fuel Type</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-green-500 text-xl mr-2">⛽</span> {reservation?.car.fuelType}
                                    </p>
                                </div>

                                {/* ⚙️ Gear Type */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Gear Type</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-blue-500 text-xl mr-2">⚙️</span> {reservation?.car.gear}
                                    </p>
                                </div>

                                {/* 🚙 Body Type */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Body Type</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-orange-500 text-xl mr-2">🚙</span> {reservation?.car.bodyType}
                                    </p>
                                </div>

                                {/* 🏎️ Power (HP) */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Power</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-red-500 text-xl mr-2">🏎️</span> {reservation?.car.powerHP} HP
                                    </p>
                                </div>

                                {/* 📏 Mileage */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Mileage</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-yellow-500 text-xl mr-2">📏</span> {reservation?.car.mileage.toLocaleString()} km
                                    </p>
                                </div>
                            </div>
                        </div>




                        {/* 📅 Reservation Details */}
                        <div className="bg-white p-8 rounded-xl mb-6 shadow-lg backdrop-blur-lg border border-gray-200">
                            <h4 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
                                Renting Period
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Rented By */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Rented By</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-blue-500 text-xl mr-2">👤</span> {reservation?.user || "N/A"}
                                    </p>
                                </div>

                                {/* Start Date */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Start Date</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-green-500 text-xl mr-2">📅</span> {new Date(reservation?.startDate).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* End Date */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">End Date</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-red-500 text-xl mr-2">⏳</span> {new Date(reservation?.endDate).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Reservation Status */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Status</p>
                                    <span className={`px-3 py-1 mt-1 text-sm font-semibold rounded-full shadow-sm flex items-center
                ${reservation?.status === ReservationStatus.ongoing ? "bg-green-100 text-green-800 border border-green-300" :
                                            reservation?.status === "return_requested" ? "bg-yellow-100 text-yellow-800 border border-yellow-300" :
                                                "bg-gray-100 text-gray-800 border border-gray-300"}`}>
                                        {reservation?.status === ReservationStatus.ongoing && "🟢 Ongoing"}
                                        {reservation?.status === ReservationStatus.return && "🟡 Return Requested"}
                                        {reservation?.status === ReservationStatus.completed && "⚪ Completed"}
                                        {reservation?.status !== ReservationStatus.ongoing && reservation?.status !== ReservationStatus.return && reservation?.status !== ReservationStatus.completed && "⚪ Unknown"}
                                    </span>
                                </div>

                                {/* 🏢 Garage Location */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Location</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-indigo-500 text-xl mr-2">🏢</span> {reservation?.car.garage?.name || "Unknown"}
                                    </p>
                                </div>

                                {/* 🔧 Garage Maintainer */}
                                <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Maintainer</p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                                        <span className="text-purple-500 text-xl mr-2">🔧</span> {reservation?.car.garage?.maintainer || "Not Assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* 📷 Photo Guidelines */}
                        {role === Role.user && reservation?.status === ReservationStatus.ongoing && (
                            < div className="bg-white p-8 rounded-xl mb-6 shadow-lg backdrop-blur-lg border border-gray-200 flex flex-col items-center text-center">
                                <h4 className="text-2xl font-extrabold text-gray-900 mb-3 flex items-center">
                                    Photo Guidelines
                                </h4>
                                <p className="text-gray-600 text-lg mb-6 max-w-2xl">
                                    Please upload exactly <strong>5 images</strong> showing the
                                    <span className="text-blue-500 font-bold"> Front</span>,
                                    <span className="text-green-500 font-bold"> Both Sides</span>,
                                    <span className="text-red-500 font-bold"> Rear</span>, and
                                    <span className="text-purple-500 font-bold"> Odometer</span> of the vehicle.
                                </p>

                                {/* 📷 Image Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src="/car-views.png"
                                            alt="Car Views Guide"
                                            className="w-full max-w-sm md:max-w-xs object-contain rounded-lg shadow-lg"
                                        />
                                        <p className="text-gray-500 mt-2 text-sm">Vehicle Views</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <img
                                            src="/odometer.png"
                                            alt="Odometer Guide"
                                            className="w-full max-w-sm md:max-w-xs object-contain rounded-lg shadow-lg"
                                        />
                                        <p className="text-gray-500 mt-2 text-sm">Odometer Example</p>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* 🚗 Return Your Car */}
                        {role === Role.user && reservation?.status === ReservationStatus.ongoing && (
                            <div className="bg-blue-50 p-8 rounded-xl mb-6 shadow-lg border border-blue-200">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 flex items-center">
                                    Return Your Car
                                </h3>
                                <p className="text-gray-600 text-lg mb-4 ">
                                    Upload images showing the <strong>Front</strong>, <strong>Both Sides</strong>, <strong>Rear</strong>, and <strong>Odometer</strong> before submitting your return request.
                                </p>

                                {/* 📷 Upload Section */}
                                <div className="">
                                    <label className="block">
                                        <input
                                            type="file"
                                            className="mt-2 block w-full"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    {/* 🖼 Live Image Previews */}
                                    {previewImages.length > 0 && (
                                        <div className="grid grid-cols-5 gap-4 mt-4">
                                            {previewImages.map((src, index) => (
                                                <img
                                                    key={index}
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg shadow-md border border-gray-300"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 🔘 Submit Request Button */}
                                <div className="mt-6 flex justify-center">
                                    <ActionButton
                                        text="Submit Return Request"
                                        onClick={handleRequestReturn}
                                        customClasses="w-full bg-brand text-white justify-center"
                                    />
                                </div>
                            </div>
                        )}


                        {/* 🔍 Maintainer: Approve/Reject Return */}
                        {role === Role.maintainer && reservation?.status === ReservationStatus.return && (
                            <div className="bg-yellow-50 p-8 rounded-xl shadow-lg backdrop-blur-lg border border-yellow-200">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                                    Review Return Request
                                </h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    Please review the uploaded images before approving or rejecting the return request.
                                </p>

                                {/* 📸 Uploaded Images */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reservation?.pictures && reservation.pictures.length > 0 ? (
                                        reservation.pictures.map((picture, index) => (
                                            <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                                <img src={picture.url} alt={`Return Image ${index + 1}`} className="rounded-lg w-full h-40 object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center col-span-2">No images uploaded.</p>
                                    )}
                                </div>

                                {/* ✅❌ Approve & Reject Buttons */}
                                <div className="flex justify-between mt-6 align-middle space-x-2">
                                    <ActionButton
                                        text="Approve Return"
                                        onClick={handleApproveReturn}
                                        customClasses="bg-green-600 text-white px-6 py-3 w-full justify-center"
                                    />
                                    <ActionButton
                                        text="Reject Return"
                                        onClick={handleRejectReturn}
                                        customClasses="bg-red-600 text-white px-6 py-3 w-full justify-center"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div >

        </>
    );
};

export default ReservationDetails;
