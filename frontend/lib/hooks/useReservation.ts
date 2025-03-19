import axios, { AxiosResponse } from 'axios';
import { useNotification } from "./useNotification";
import config from "../config";
import { Picture, Reservation } from "../types";
import useAuthentication from './useAuthentication';
import { useReservationContext } from '@/ReservationContext';
import { useState } from 'react';

const useReservation = () => {
    const { onError, onSuccess } = useNotification();
    const { token } = useAuthentication();
    const { setReservationsState, setReservationState } = useReservationContext();
    const [loading, setLoading] = useState<boolean>(false);

    // Create a new reservation
    const createReservation = async (reservationData: Partial<Reservation>): Promise<Reservation> => {
        try {
            const result: AxiosResponse<Reservation> = await axios.post(config.reservation, reservationData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to create reservation.');
            throw error;
        }
    };

    // Get all reservations (admins see all; users see their own)
    const getReservations = async (): Promise<void> => {
        setLoading(true);
        try {
            const result: AxiosResponse<Reservation[]> = await axios.get(config.reservation, {
                headers: {
                    bearer: token,
                },
            });
            setReservationsState((prevState: any) => ({
                ...prevState,
                reservations: result.data,
            }));
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch reservations.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get a single reservation by ID
    const getReservationById = async (id: string): Promise<Reservation> => {
        try {
            if (token) {

                const result: AxiosResponse<Reservation> = await axios.get(`${config.reservation}/${id}`, {
                    headers: {
                        bearer: token,
                    },
                });
                setReservationState((prevState: any) => ({
                    ...prevState,
                    reservation: result.data,
                }));
                return result.data;
            }
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch reservation.');
            throw error;
        }
    };

    // Update a reservation by ID
    const updateReservationById = async (id: string, reservationData: Partial<Reservation>): Promise<Reservation> => {
        try {
            const result: AxiosResponse<Reservation> = await axios.put(`${config.reservation}/${id}`, reservationData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to update reservation.');
            throw error;
        }
    };

    // Delete a reservation by ID (Only for maintainers or reservation owner)
    const deleteReservationById = async (id: string): Promise<void> => {
        try {
            await axios.delete(`${config.reservation}/${id}`, {
                headers: {
                    bearer: token,
                },
            });
            onSuccess("Reservation deleted successfully.");
        } catch (error: any) {
            console.error(error);
            onError('Failed to delete reservation.');
            throw error;
        }
    };

    // Request return (User submits mileage and pictures)
    // Keep pictures as string for the image URLs, the backend handles further processing
    const requestReturn = async (id: string, returnData: { pictures: string[] }): Promise<void> => {
        try {
            const result: AxiosResponse<{ message: string, reservation: Reservation }> = await axios.post(
                `${config.reservation}/${id}/request-return`,
                returnData,
                {
                    headers: {
                        bearer: token,
                    },
                }
            );
            onSuccess(result.data.message);
        } catch (error: any) {
            console.error(error);
            onError('Failed to request return.');
            throw error;
        }
    };

    // Approve return request (Maintainer confirms return)
    const approveReturn = async (id: string, pictures: Picture[]): Promise<void> => {
        try {
            const result: AxiosResponse<{ message: string, reservation: Reservation }> = await axios.post(
                `${config.reservation}/${id}/approve-return`,
                { pictures },
                {
                    headers: {
                        bearer: token,
                    },
                }
            );
            onSuccess(result.data.message);
        } catch (error: any) {
            console.error(error);
            onError('Failed to approve return.');
            throw error;
        }
    };

    // Reject return request (Maintainer rejects and reverts status to ongoing)
    const rejectReturn = async (id: string, pictures: Picture[]): Promise<void> => {
        try {
            const result: AxiosResponse<{ message: string, reservation: Reservation }> = await axios.post(
                `${config.reservation}/${id}/reject-return`,
                { pictures },
                {
                    headers: {
                        bearer: token,
                    },
                }
            );
            onSuccess(result.data.message);
        } catch (error: any) {
            console.error(error);
            onError('Failed to reject return.');
            throw error;
        }
    };

    return {
        createReservation,
        getReservations,
        getReservationById,
        updateReservationById,
        deleteReservationById,
        requestReturn,
        approveReturn,
        rejectReturn,
        loading,
        setLoading,
    };
};

export default useReservation;
