import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type ReservationModalProps = {
    show: boolean;
    handleClose: () => void;
    handleReservation: (reservation: {
        date: string;
        hour: string;
        quantity: number;
        observations: string;
    }) => void;
};

const ReservationModal: React.FC<ReservationModalProps> = ({
    show,
    handleClose,
    handleReservation,
}) => {
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [observations, setObservations] = useState("");

    const handleSubmit = () => {
        handleReservation({ date, hour, quantity, observations });
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Reserve a Table</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="hour">
                        <Form.Label>Hour</Form.Label>
                        <Form.Control type="time" value={hour} onChange={(e) => setHour(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="quantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="observations">
                        <Form.Label>Observations</Form.Label>
                        <Form.Control type="text" value={observations} onChange={(e) => setObservations(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReservationModal;
