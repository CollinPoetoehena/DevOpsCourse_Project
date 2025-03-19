// @ts-nocheck
import Head from "next/head";
import config from "@/lib/config";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/AuthContext";
import { useGarageContext } from "@/GarageContext";
import useReservation from "@/lib/hooks/useReservation";
import { Reservation, ReservationStatus, Role } from "@/lib/types";
import { motion } from "framer-motion";
import ActionButton from "@/components/common/actionButton";
import { useRouter } from "next/router";
import useAuthentication from "@/lib/hooks/useAuthentication";
import React from "react";
import { useReservationContext } from "@/ReservationContext";
import Link from "next/link";

export default function ReservationsPage() {
    // Access reservation-related state from the Reservation Context
    const { reservationState, reservationsState, setReservationState, setReservationsState } = useReservationContext();
    const { reservations } = reservationsState;

    const router = useRouter();
    const { getReservations, setLoading, getReservationById, deleteReservationById } = useReservation();
    const { token, loading } = useAuthentication();
    const { isAuthenticated, role } = useAuth();

    useEffect(() => {
        if (token) {
            getReservations()
        }
    }, [token]);

    // Modal state for delete confirmation (or similar actions)
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [selectedReservation, setSelectedReservation] = React.useState<Reservation>();

    const toggleModal = (reservation: Reservation) => {
        if (reservation) {
            setSelectedReservation(reservation);
            setShowModal(!showModal);
        }
    };

    const handleDeleteReservation = async (id: string) => {
        if (isAuthenticated) {
            await deleteReservationById(id);
            await getReservations();
        }
    };

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const tableRef = useRef<HTMLTableElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(reservations.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Adjust items per page based on screen/table size
    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tableRef.current || !screenRef.current) return;

            // Get the total height available from screen container and the top offset of the table
            const screenRect = screenRef.current.getBoundingClientRect();
            const tableRect = tableRef.current.getBoundingClientRect();
            // Calculate available height below the table's top position
            const availableHeight = screenRect.height - tableRect.top;
            // Get the height of a single row from the first row in tbody
            const firstRow = tableRef.current.querySelector("tbody tr");
            const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 0;

            if (rowHeight > 0) {
                // Subtract 1 row to account for header or padding if needed
                const calculatedItemsPerPage = Math.floor(availableHeight / rowHeight) - 1;
                setItemsPerPage(calculatedItemsPerPage || 5);
            }
        };

        // Call once after mounting
        handleResize();

        // Listen for window resize events
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [reservations]);

    return (
        <>
            <Head>
                <title>Reservations {config.titleWithSeparator}</title>
                <meta name="description" content="View reservations" />
            </Head>

            <div className="relative">
                <section
                    className="bg-white overflow-hidden pt-24 min-h-screen"
                    ref={screenRef}
                    style={{ minHeight: 'calc(100vh - 3rem)' }}
                >
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" ref={tableRef}>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Car</th>
                                    {role !== Role.user && <th scope="col" className="px-6 py-3">User</th>}
                                    <th scope="col" className="px-6 py-3">Start Date</th>
                                    <th scope="col" className="px-6 py-3">End Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    {role !== Role.user && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((reservation) => (
                                    <tr key={reservation._id} className="bg-white border-b hover:bg-gray-50">
                                        <motion.th
                                            layoutId={reservation._id}
                                            scope="row"
                                            className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                                        >
                                            <Link href={`/reservation/${reservation._id}`}>
                                                {reservation.car.make} {reservation.car.model} ({reservation.car.firstRegistration})
                                            </Link>
                                        </motion.th>
                                        {role !== Role.user && (
                                            <td className="px-6 py-4">{reservation.user}</td>
                                        )}
                                        <td className="px-6 py-4">
                                            {new Date(reservation.startDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(reservation.endDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">{reservation.status}</td>
                                        <td className="flex items-center justify-end px-3 py-2 space-x-2">
                                            {role !== Role.user && (
                                                <>
                                                    <ActionButton
                                                        onClick={() => {
                                                            if (reservation.status === ReservationStatus.completed) {
                                                                toggleModal(reservation);
                                                            }
                                                        }}
                                                        icon="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        item={reservation}
                                                        disabled={reservation.status !== ReservationStatus.completed} // Disable if not completed
                                                        customClasses={`${reservation.status !== ReservationStatus.completed ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                                                            }`}
                                                    />
                                                </>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                            {showModal && (
                                <div
                                    id="popup-modal"
                                    tabIndex={-1}
                                    className={`fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full flex justify-center items-center  backdrop-blur-[6px]`}
                                >
                                    <div className="relative w-full max-w-md max-h-full">
                                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                            <button
                                                type="button"
                                                onClick={() => { if (selectedReservation) { toggleModal(selectedReservation) } }}
                                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                                data-modal-hide="popup-modal"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                            <div className="p-6 text-center">
                                                <svg
                                                    aria-hidden="true"
                                                    className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                    Are you sure you want to remove the reservation for <span className='font-semibold'>{`${selectedReservation?.car.make} ${selectedReservation?.car.model} (${selectedReservation?.car.firstRegistration})` || "this car"}?
                                                    </span>
                                                </h3>
                                                <button
                                                    data-modal-hide="popup-modal"
                                                    type="button"
                                                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                    onClick={() => {
                                                        if (selectedReservation) {
                                                            toggleModal(selectedReservation)
                                                            handleDeleteReservation(selectedReservation?._id)
                                                        }
                                                    }}
                                                >
                                                    Yes, I&apos;m sure
                                                </button>
                                                <button
                                                    data-modal-hide="popup-modal"
                                                    type="button"
                                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                    onClick={() => { if (selectedReservation) { toggleModal(selectedReservation) } }}
                                                >
                                                    No, cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </table>
                    </div>
                </section>
            </div>
            {/* Pagination */}
            <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-between p-2 w-full"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal text-gray-500 md:mb-0 block md:inline md:w-auto">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                        {indexOfFirstItem + 1}-{indexOfLastItem >= reservations.length ? reservations.length : indexOfLastItem}
                    </span>{" "}
                    of <span className="font-semibold text-gray-900">{reservations.length}</span>
                </span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            onClick={prevPage}
                            className={`flex items-center justify-center px-3 h-8 ${currentPage === 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                                }`}
                        >
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                        const pageNumber = currentPage - Math.floor(5 / 3) + index;
                        if (pageNumber < 1 || pageNumber > totalPages) return null;
                        return (
                            <li key={pageNumber}>
                                <button
                                    onClick={() => paginate(pageNumber)}
                                    className={`flex items-center justify-center px-3 h-8 ${currentPage === pageNumber
                                        ? "text-cyan-600 border border-gray-300 bg-cyan-50 hover:bg-cyan-100 hover:text-cyan-700"
                                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            </li>
                        );
                    })}
                    <li>
                        <button
                            onClick={nextPage}
                            className={`flex items-center justify-center px-3 h-8 ${currentPage === totalPages
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                                }`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}
